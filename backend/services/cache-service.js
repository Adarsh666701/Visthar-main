import { getRedisClient } from '../core/redis';

let state = global._backendCacheState;
if (!state) {
  state = global._backendCacheState = {
    memory: new Map(),
  };
}

function nowMs() {
  return Date.now();
}

function getFromMemory(key) {
  const value = state.memory.get(key);
  if (!value) return null;
  if (value.expiresAt <= nowMs()) {
    state.memory.delete(key);
    return null;
  }
  return value.data;
}

function setInMemory(key, data, ttlMs) {
  state.memory.set(key, {
    data,
    expiresAt: nowMs() + ttlMs,
  });
}

export async function getCachedJson(key) {
  const redis = await getRedisClient();
  if (redis) {
    const raw = await redis.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  return getFromMemory(key);
}

export async function setCachedJson(key, data, ttlMs) {
  const redis = await getRedisClient();
  if (redis) {
    await redis.set(key, JSON.stringify(data), {
      EX: Math.max(1, Math.ceil(ttlMs / 1000)),
    });
    return;
  }

  setInMemory(key, data, ttlMs);
}

export async function deleteCachedKey(key) {
  const redis = await getRedisClient();
  if (redis) {
    await redis.del(key);
    return;
  }

  state.memory.delete(key);
}

export async function invalidateStatsCache() {
  await Promise.all([
    deleteCachedKey('cache:stats:admin'),
    deleteCachedKey('cache:stats:public'),
  ]);
}
