import Stripe from 'stripe';

let stripeClient = null;

function getCurrency() {
  return (process.env.STRIPE_CURRENCY || 'inr').toLowerCase();
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY);
}

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (stripeClient) return stripeClient;

  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });

  return stripeClient;
}

export function toStripeAmount(amount) {
  const numeric = Number(amount || 0);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.round(numeric * 100);
}

export async function createStripePaymentIntent({ amount, user, metadata = {} }) {
  const stripeAmount = toStripeAmount(amount);
  if (stripeAmount <= 0) {
    throw new Error('invalid amount');
  }

  if (!isStripeConfigured()) {
    return {
      mocked: true,
      clientSecret: `pi_mock_${Date.now()}_secret`,
      paymentIntentId: `pi_mock_${Date.now()}`,
      amount: stripeAmount,
      currency: getCurrency(),
      status: 'succeeded',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    };
  }

  const stripe = getStripeClient();
  const intent = await stripe.paymentIntents.create({
    amount: stripeAmount,
    currency: getCurrency(),
    automatic_payment_methods: { enabled: true },
    metadata: {
      userId: user.id,
      userEmail: user.email,
      ...metadata,
    },
    receipt_email: user.email,
  });

  return {
    mocked: false,
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    amount: intent.amount,
    currency: intent.currency,
    status: intent.status,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  };
}

export async function verifyStripePaymentIntent({ paymentIntentId, expectedAmount, expectedUserId }) {
  if (!paymentIntentId) throw new Error('payment intent id required');

  if (!isStripeConfigured()) {
    return {
      mocked: true,
      id: paymentIntentId,
      status: 'succeeded',
      amountReceived: toStripeAmount(expectedAmount),
      currency: getCurrency(),
    };
  }

  const stripe = getStripeClient();
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (intent.status !== 'succeeded') {
    throw new Error('payment not completed');
  }

  if (expectedUserId && intent.metadata?.userId !== expectedUserId) {
    throw new Error('payment does not belong to user');
  }

  const expected = toStripeAmount(expectedAmount);
  if (expected > 0 && intent.amount !== expected) {
    throw new Error('payment amount mismatch');
  }

  return {
    mocked: false,
    id: intent.id,
    status: intent.status,
    amountReceived: intent.amount_received || intent.amount,
    currency: intent.currency,
  };
}
