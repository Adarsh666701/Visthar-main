import { RATE_LIMITS } from '../core/constants';
import { getRedisClient } from '../core/redis';

let state = global._backendRateLimiterState;
if (!state) {
  state = global._backendRateLimiterState = {
    memory: new Map(),
  };
}

function getPolicy(path, method) {
  if (path.startsWith('admin/')) return RATE_LIMITS.admin;
  if (path.startsWith('auth/')) return RATE_LIMITS.auth;
  if (['prebook', 'notify-me', 'newsletter', 'contact', 'oem-inquiry'].includes(path)) return RATE_LIMITS.lead;
  return method === 'GET' ? RATE_LIMITS.defaultRead : RATE_LIMITS.defaultWrite;
}

function applyMemoryLimit(key, policy) {
  const now = Date.now();
  const record = state.memory.get(key);

  if (!record || record.resetAt <= now) {
    state.memory.set(key, { count: 1, resetAt: now + policy.windowMs });
    return { limited: false, policy };
  }

  if (record.count >= policy.limit) {
    return {
      limited: true,
      retryAfterSec: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
      policy,
    };
  }

  record.count += 1;
  state.memory.set(key, record);
  return { limited: false, policy };
}

async function applyRedisLimit(key, policy) {
  const redis = await getRedisClient();
  if (!redis) return null;

  const count = await redis.incr(key);
  if (count === 1) {
    await redis.pExpire(key, policy.windowMs);
  }

  if (count > policy.limit) {
    const ttlMs = await redis.pTTL(key);
    return {
      limited: true,
      retryAfterSec: Math.max(1, Math.ceil((ttlMs > 0 ? ttlMs : policy.windowMs) / 1000)),
      policy,
    };
  }

  return { limited: false, policy };
}

export async function enforceRateLimit({ ip, method, path }) {
  const policy = getPolicy(path, method);
  const key = `rl:${ip}:${method}:${path}`;

  const redisResult = await applyRedisLimit(key, policy);
  if (redisResult) return redisResult;

  return applyMemoryLimit(key, policy);
}
