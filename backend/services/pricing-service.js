import { PRODUCTS } from '../../lib/products.js';
import { loadProductsWithFallback } from '../../lib/inventory-products';

function productPriceMap(products) {
  return new Map(products.map((p) => [p.slug, { name: p.name, price: Number(p.price || 0) }]));
}

function normalizeQuantity(rawQty) {
  const qty = Number(rawQty);
  if (!Number.isInteger(qty) || qty <= 0 || qty > 20) {
    throw new Error('invalid item quantity');
  }
  return qty;
}

export async function calculateServerOrder(db, items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('items are required');
  }

  if (items.length > 200) {
    throw new Error('too many items');
  }

  const products = db ? await loadProductsWithFallback(db) : PRODUCTS;
  const productPriceBySlug = productPriceMap(products);
  const merged = new Map();
  for (const item of items) {
    const slug = String(item?.slug || '').trim();
    if (!slug) throw new Error('item slug is required');

    const product = productPriceBySlug.get(slug);
    if (!product) throw new Error(`unknown product: ${slug}`);

    const qty = normalizeQuantity(item?.qty);
    const previous = merged.get(slug) || 0;
    merged.set(slug, previous + qty);
  }

  const normalizedItems = [];
  let total = 0;

  for (const [slug, qty] of merged.entries()) {
    const product = productPriceBySlug.get(slug);
    const unitPrice = Number(product.price);
    const lineTotal = unitPrice * qty;
    total += lineTotal;
    normalizedItems.push({
      slug,
      name: product.name,
      unitPrice,
      qty,
      lineTotal,
    });
  }

  if (total <= 0) {
    throw new Error('invalid order amount');
  }

  return {
    items: normalizedItems,
    total,
  };
}
