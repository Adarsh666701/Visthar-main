import { v4 as uuidv4 } from 'uuid';
import { errorResponse, jsonResponse } from '../core/response';
import { parseBody, schemas } from '../core/validation';
import { invalidateStatsCache } from '../services/cache-service';

export async function handleLeadRoute(req, db, ctx) {
  const { method, path } = ctx;

  if (path === 'prebook' && method === 'POST') {
    const body = await parseBody(req, schemas.prebook);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    const id = uuidv4();
    await db.collection('prebookings').insertOne({
      id,
      email: body.email,
      productSlug: body.productSlug,
      name: body.name || '',
      phone: body.phone || '',
      createdAt: new Date().toISOString(),
    });
    await invalidateStatsCache();

    return jsonResponse(ctx, { ok: true, id, message: 'Pre-booking confirmed. Welcome to the founder list.' });
  }

  if (path === 'notify-me' && method === 'POST') {
    const body = await parseBody(req, schemas.notify);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    await db.collection('notify_me').insertOne({
      id: uuidv4(),
      email: body.email,
      productSlug: body.productSlug,
      createdAt: new Date().toISOString(),
    });
    await invalidateStatsCache();

    return jsonResponse(ctx, { ok: true, message: "We'll notify you at launch." });
  }

  if (path === 'newsletter' && method === 'POST') {
    const body = await parseBody(req, schemas.newsletter);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    await db.collection('newsletter').insertOne({
      id: uuidv4(),
      email: body.email,
      createdAt: new Date().toISOString(),
    });
    await invalidateStatsCache();

    return jsonResponse(ctx, { ok: true });
  }

  if (path === 'contact' && method === 'POST') {
    const body = await parseBody(req, schemas.contact);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    await db.collection('contact_messages').insertOne({
      id: uuidv4(),
      ...body,
      createdAt: new Date().toISOString(),
    });
    await invalidateStatsCache();

    return jsonResponse(ctx, { ok: true, message: "Message received. We'll respond within 24 hours." });
  }

  if (path === 'oem-inquiry' && method === 'POST') {
    const body = await parseBody(req, schemas.oem);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    await db.collection('oem_leads').insertOne({
      id: uuidv4(),
      ...body,
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    await invalidateStatsCache();

    return jsonResponse(ctx, { ok: true, message: 'Inquiry received. Our partnerships team will respond within 48 hours.' });
  }

  return null;
}
