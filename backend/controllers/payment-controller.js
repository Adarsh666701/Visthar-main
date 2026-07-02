import { errorResponse, jsonResponse } from '../core/response';
import { parseBody, schemas } from '../core/validation';
import { currentUser } from '../services/auth-service';
import { createStripePaymentIntent } from '../services/payment-service';
import { calculateServerOrder } from '../services/pricing-service';

export async function handlePaymentRoute(req, db, ctx) {
  const { method, path } = ctx;

  if (path === 'payments/create-intent' && method === 'POST') {
    const user = await currentUser(req, db);
    if (!user) return errorResponse(ctx, 'unauthenticated', 401);

    const body = await parseBody(req, schemas.paymentIntentCreate);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    try {
      const priced = await calculateServerOrder(db, body.items);
      const payment = await createStripePaymentIntent({
        amount: priced.total,
        user,
        metadata: {
          source: 'visthar-checkout',
          itemCount: String(priced.items.length),
        },
      });

      const nowIso = new Date().toISOString();
      await db.collection('payment_intents').updateOne(
        { paymentIntentId: payment.paymentIntentId },
        {
          $set: {
            paymentIntentId: payment.paymentIntentId,
            userId: user.id,
            userEmail: user.email,
            items: priced.items,
            total: priced.total,
            currency: payment.currency,
            mocked: payment.mocked,
            status: 'created',
            updatedAt: nowIso,
          },
          $setOnInsert: {
            createdAt: nowIso,
          },
        },
        { upsert: true }
      );

      return jsonResponse(ctx, {
        ok: true,
        payment: {
          ...payment,
          total: priced.total,
        },
      });
    } catch (error) {
      return errorResponse(ctx, error?.message || 'unable to create payment intent', 400);
    }
  }

  return null;
}
