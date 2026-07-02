import { STATS_TTL_MS } from '../core/constants';
import { jsonResponse } from '../core/response';
import { getCachedJson, setCachedJson } from '../services/cache-service';
import { buildPublicStats } from '../services/stats-service';

export async function handlePublicStatsRoute(db, ctx) {
  const { path, method } = ctx;
  if (path !== 'stats' || method !== 'GET') return null;

  const cacheKey = 'cache:stats:public';
  const cached = await getCachedJson(cacheKey);
  if (cached) return jsonResponse(ctx, cached);

  const stats = await buildPublicStats(db);
  await setCachedJson(cacheKey, stats, STATS_TTL_MS);
  return jsonResponse(ctx, stats);
}
