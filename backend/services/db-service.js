import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

let state = global._backendState;
if (!state) {
  state = global._backendState = {
    client: null,
    db: null,
    seeded: false,
    initialized: false,
  };
}

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('users').createIndex({ createdAt: -1 }),
    db.collection('orders').createIndex({ userId: 1, createdAt: -1 }),
    db.collection('orders').createIndex({ createdAt: -1 }),
    db.collection('orders').createIndex(
      { stripePaymentIntentId: 1 },
      { unique: true, partialFilterExpression: { stripePaymentIntentId: { $exists: true } } }
    ),
    db.collection('payment_intents').createIndex({ paymentIntentId: 1 }, { unique: true }),
    db.collection('payment_intents').createIndex({ userId: 1, status: 1, createdAt: -1 }),
    db.collection('prebookings').createIndex({ createdAt: -1 }),
    db.collection('notify_me').createIndex({ createdAt: -1 }),
    db.collection('newsletter').createIndex({ createdAt: -1 }),
    db.collection('contact_messages').createIndex({ createdAt: -1 }),
    db.collection('oem_leads').createIndex({ createdAt: -1 }),
    db.collection('carts').createIndex({ userId: 1 }, { unique: true }),
    db.collection('site_settings').createIndex({ key: 1 }, { unique: true }),
  ]);
}

async function seedAdmin(db) {
  const email = (process.env.ADMIN_EMAIL || 'admin@visthar-lifestyle.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Nitish@2003';
  const hash = await bcrypt.hash(password, 10);
  const existing = await db.collection('users').findOne({ email });

  if (!existing) {
    await db.collection('users').insertOne({
      id: uuidv4(),
      email,
      password_hash: hash,
      name: 'Admin',
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    return;
  }

  if (existing.role !== 'admin' || !(await bcrypt.compare(password, existing.password_hash))) {
    await db.collection('users').updateOne({ email }, { $set: { password_hash: hash, role: 'admin' } });
  }
}

async function seedSettings(db) {
  const existing = await db.collection('site_settings').findOne({ key: 'contact' });
  if (existing) return;

  await db.collection('site_settings').insertOne({
    key: 'contact',
    email: 'hello@visthar.com',
    phone: '+91 - Coming soon',
    address: 'Bengaluru, India',
    hq: 'Visthar Lab, Bengaluru, India',
    instagram: '#',
    twitter: '#',
    youtube: '#',
    linkedin: '#',
    company: 'Vistharuio Electronics Private Limited',
    updatedAt: new Date().toISOString(),
  });
}

export async function getDb() {
  if (state.db) return state.db;

  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  state.client = client;
  state.db = client.db(
    process.env.DB_NAME && process.env.DB_NAME !== 'your_database_name'
      ? process.env.DB_NAME
      : 'visthar'
  );

  if (!state.initialized) {
    await ensureIndexes(state.db);
    state.initialized = true;
  }

  if (!state.seeded) {
    await seedAdmin(state.db);
    await seedSettings(state.db);
    state.seeded = true;
  }

  return state.db;
}
