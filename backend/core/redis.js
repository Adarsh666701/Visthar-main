import { createClient } from 'redis';

let redisClient = null;
let redisInitPromise = null;

async function initRedisClient() {
  if (!process.env.REDIS_URL) return null;
  if (redisClient?.isReady) return redisClient;
  if (redisInitPromise) return redisInitPromise;

  redisInitPromise = (async () => {
    try {
      const client = createClient({ url: process.env.REDIS_URL });
      client.on('error', () => {});
      await client.connect();
      redisClient = client;
      return redisClient;
    } catch {
      redisClient = null;
      return null;
    } finally {
      redisInitPromise = null;
    }
  })();

  return redisInitPromise;
}

export async function getRedisClient() {
  return initRedisClient();
}
