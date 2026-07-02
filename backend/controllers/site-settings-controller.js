import { SITE_SETTINGS_TTL_MS } from '../core/constants';
import { errorResponse, jsonResponse } from '../core/response';
import { parseBody, schemas } from '../core/validation';
import { requireAdmin } from '../services/auth-service';
import { getCachedJson, setCachedJson } from '../services/cache-service';

const SITE_SETTINGS_CACHE_KEY = 'cache:site-settings:contact';

export async function handleSiteSettingsRoute(req, db, ctx) {
  const { method, path } = ctx;

  if (path === 'site-settings' && method === 'GET') {
    const cached = await getCachedJson(SITE_SETTINGS_CACHE_KEY);
    if (cached) return jsonResponse(ctx, { settings: cached });

    const settings = await db
      .collection('site_settings')
      .findOne({ key: 'contact' }, { projection: { _id: 0 } });

    const safe = settings || {};
    await setCachedJson(SITE_SETTINGS_CACHE_KEY, safe, SITE_SETTINGS_TTL_MS);
    return jsonResponse(ctx, { settings: safe });
  }

  if (path === 'site-settings' && method === 'PUT') {
    const admin = await requireAdmin(req, db);
    if (!admin) return errorResponse(ctx, 'forbidden', 403);

    const body = await parseBody(req, schemas.siteSettings);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    const update = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await db
      .collection('site_settings')
      .updateOne({ key: 'contact' }, { $set: update }, { upsert: true });

    await setCachedJson(
      SITE_SETTINGS_CACHE_KEY,
      {
        key: 'contact',
        ...update,
      },
      SITE_SETTINGS_TTL_MS
    );

    return jsonResponse(ctx, { ok: true, settings: update });
  }

  return null;
}
