export async function getRevenue(db) {
  const result = await db.collection('orders').aggregate([
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]).toArray();
  return result?.[0]?.total || 0;
}

export async function buildPublicStats(db) {
  const [prebookings, notify, newsletter, contact, oem, users, orders] = await Promise.all([
    db.collection('prebookings').countDocuments(),
    db.collection('notify_me').countDocuments(),
    db.collection('newsletter').countDocuments(),
    db.collection('contact_messages').countDocuments(),
    db.collection('oem_leads').countDocuments(),
    db.collection('users').countDocuments(),
    db.collection('orders').countDocuments(),
  ]);

  return { prebookings, notify, newsletter, contact, oem, users, orders };
}

export async function buildAdminStats(db) {
  const [base, revenue] = await Promise.all([
    buildPublicStats(db),
    getRevenue(db),
  ]);

  return {
    ...base,
    revenue,
  };
}
