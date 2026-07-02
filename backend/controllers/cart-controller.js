import { errorResponse, jsonResponse } from '../core/response';
import { parseBody, schemas } from '../core/validation';
import { currentUser } from '../services/auth-service';

export async function handleCartRoute(req, db, ctx) {
  const { method, path } = ctx;

  if (path === 'cart' && method === 'GET') {
    const user = await currentUser(req, db);
    if (!user) return jsonResponse(ctx, { items: [] });

    const cart = await db.collection('carts').findOne({ userId: user.id });
    return jsonResponse(ctx, { items: cart?.items || [] });
  }

  if (path === 'cart' && method === 'POST') {
    const user = await currentUser(req, db);
    if (!user) return errorResponse(ctx, 'unauthenticated', 401);

    const body = await parseBody(req, schemas.cart);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    await db.collection('carts').updateOne(
      { userId: user.id },
      {
        $set: {
          userId: user.id,
          items: body.items || [],
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    return jsonResponse(ctx, { ok: true });
  }

  return null;
}
