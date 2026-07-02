import { v4 as uuidv4 } from 'uuid';
import { errorResponse, jsonResponse } from '../core/response';
import { parseBody, schemas } from '../core/validation';
import { currentUser } from '../services/auth-service';
import { invalidateStatsCache } from '../services/cache-service';
import { verifyStripePaymentIntent } from '../services/payment-service';

const PAYMENT_INTENT_MAX_AGE_MIN = Number(process.env.STRIPE_INTENT_MAX_AGE_MIN || 30);

export async function handleOrderRoute(req, db, ctx) {
  const { method, path } = ctx;

  if (path === 'orders' && method === 'POST') {
    const user = await currentUser(req, db);
    if (!user) return errorResponse(ctx, 'unauthenticated', 401);

    const body = await parseBody(req, schemas.order);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    if (body.paymentProvider !== 'stripe') {
      return errorResponse(ctx, 'unsupported payment provider', 400);
    }

    const pending = await db.collection('payment_intents').findOne({
      paymentIntentId: body.paymentIntentId,
      userId: user.id,
      status: 'created',
    });

    if (!pending) {
      return errorResponse(ctx, 'invalid or already consumed payment intent', 400);
    }

    const pendingAgeMs = Date.now() - new Date(pending.createdAt).getTime();
    if (Number.isFinite(pendingAgeMs) && pendingAgeMs > PAYMENT_INTENT_MAX_AGE_MIN * 60 * 1000) {
      return errorResponse(ctx, 'payment intent expired, please retry checkout', 400);
    }

    let payment;
    try {
      payment = await verifyStripePaymentIntent({
        paymentIntentId: body.paymentIntentId,
        expectedAmount: pending.total,
        expectedUserId: user.id,
      });
    } catch (error) {
      return errorResponse(ctx, error?.message || 'payment verification failed', 402);
    }

    const consumeResult = await db.collection('payment_intents').updateOne(
      {
        paymentIntentId: body.paymentIntentId,
        userId: user.id,
        status: 'created',
      },
      {
        $set: {
          status: 'consumed',
          consumedAt: new Date().toISOString(),
        },
      }
    );

    if (!consumeResult.matchedCount) {
      return errorResponse(ctx, 'payment intent already consumed', 409);
    }

    const order = {
      id: uuidv4(),
      userId: user.id,
      userEmail: user.email,
      items: pending.items || [],
      total: pending.total || 0,
      shipping: body.shipping,
      paymentMethod: 'stripe',
      stripePaymentIntentId: payment.id,
      stripeStatus: payment.status,
      stripeAmountReceived: payment.amountReceived,
      stripeCurrency: payment.currency,
      status: 'confirmed',
      mocked: payment.mocked,
      paymentProvider: 'stripe',
      createdAt: new Date().toISOString(),
    };

    try {
      await db.collection('orders').insertOne(order);
    } catch (error) {
      if (error?.code === 11000) {
        return errorResponse(ctx, 'order already registered for this payment', 409);
      }
      throw error;
    }
    await db.collection('carts').updateOne({ userId: user.id }, { $set: { items: [] } });
    await invalidateStatsCache();

    return jsonResponse(ctx, { ok: true, order });
  }

  if (path === 'orders' && method === 'GET') {
    const user = await currentUser(req, db);
    if (!user) return jsonResponse(ctx, { orders: [] });

    const orders = await db
      .collection('orders')
      .find({ userId: user.id }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return jsonResponse(ctx, { orders });
  }

  return null;
}
