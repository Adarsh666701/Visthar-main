import { STATS_TTL_MS } from '../core/constants';
import { errorResponse, jsonResponse } from '../core/response';
import { requireAdmin } from '../services/auth-service';
import { getCachedJson, setCachedJson } from '../services/cache-service';
import { collectionList, parsePageParams } from '../services/query-service';
import { buildAdminStats } from '../services/stats-service';

export async function handleAdminRoute(req, db, ctx) {
  const { method, path } = ctx;
  if (!path.startsWith('admin/')) return null;

  const admin = await requireAdmin(req, db);
  if (!admin) return errorResponse(ctx, 'forbidden', 403);

  const sub = path.slice(6);

  if (sub === 'stats' && method === 'GET') {
    const cacheKey = 'cache:stats:admin';
    const cached = await getCachedJson(cacheKey);
    if (cached) return jsonResponse(ctx, cached);

    const stats = await buildAdminStats(db);
    await setCachedJson(cacheKey, stats, STATS_TTL_MS);
    return jsonResponse(ctx, stats);
  }

  if (sub === 'prebookings' && method === 'GET') {
    const paging = parsePageParams(req, 200);
    return jsonResponse(ctx, { items: await collectionList(db.collection('prebookings'), paging), ...paging });
  }

  if (sub === 'notify' && method === 'GET') {
    const paging = parsePageParams(req, 200);
    return jsonResponse(ctx, { items: await collectionList(db.collection('notify_me'), paging), ...paging });
  }

  if (sub === 'newsletter' && method === 'GET') {
    const paging = parsePageParams(req, 500);
    return jsonResponse(ctx, { items: await collectionList(db.collection('newsletter'), paging), ...paging });
  }

  if (sub === 'contacts' && method === 'GET') {
    const paging = parsePageParams(req, 200);
    return jsonResponse(ctx, { items: await collectionList(db.collection('contact_messages'), paging), ...paging });
  }

  if (sub === 'oem' && method === 'GET') {
    const paging = parsePageParams(req, 200);
    return jsonResponse(ctx, { items: await collectionList(db.collection('oem_leads'), paging), ...paging });
  }

  if (sub === 'orders' && method === 'GET') {
    const paging = parsePageParams(req, 200);
    return jsonResponse(ctx, { items: await collectionList(db.collection('orders'), paging), ...paging });
  }

  if (sub === 'users' && method === 'GET') {
    const paging = parsePageParams(req, 200);
    return jsonResponse(ctx, { items: await collectionList(db.collection('users'), paging), ...paging });
  }

  return errorResponse(ctx, 'admin route not found', 404);
}
