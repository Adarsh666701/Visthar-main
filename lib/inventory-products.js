import { getMediaUrl } from '../backend/services/s3-service.js';
import { PRODUCTS } from './products';

const FALLBACK_IMAGE = PRODUCTS[0]?.image || '';

function normalizeList(value) {
  return Array.isArray(value) ? value.filter(Boolean).map(String) : [];
}

function normalizeSpecs(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

export function inventoryToProduct(item) {
  const rawImage = item.image || (Array.isArray(item.images) ? item.images[0]?.url || item.images[0] : undefined) || FALLBACK_IMAGE;
  const image = getMediaUrl(rawImage);
  const images = Array.isArray(item.images)
    ? item.images.map((entry) => {
        if (entry && typeof entry === 'object') {
          return {
            ...entry,
            url: getMediaUrl(entry.url || entry.path || ''),
          };
        }
        return { url: getMediaUrl(entry) };
      })
    : [];

  return {
    slug: item.slug || item.sku?.toLowerCase(),
    sku: item.sku,
    name: item.name || item.sku || 'Untitled product',
    category: item.category || 'future-products',
    tagline: item.tagline || item.notes || '',
    badge: item.badge || 'NEW',
    status: item.status || 'active',
    price: Number(item.price || 0),
    stock: Number(item.stock || 0),
    image,
    images,
    features: normalizeList(item.features),
    specs: normalizeSpecs(item.specs),
  };
}

async function loadCollectionProducts(db, collectionName) {
  const items = await db
    .collection(collectionName)
    .find({ status: { $ne: 'deleted' } }, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return items.map(inventoryToProduct).filter((product) => product.slug);
}

export async function loadInventoryProducts(db) {
  const inventoryProducts = await loadCollectionProducts(db, 'inventory');
  if (inventoryProducts.length) return inventoryProducts;

  return loadCollectionProducts(db, 'products');
}

export async function loadProductsWithFallback(db) {
  const inventoryProducts = await loadInventoryProducts(db);
  return inventoryProducts.length ? inventoryProducts : PRODUCTS;
}

export async function loadProductWithFallback(db, slug) {
  const inventoryItem = await db.collection('inventory').findOne(
    { slug, status: { $ne: 'deleted' } },
    { projection: { _id: 0 } }
  ) || await db.collection('products').findOne(
    { slug, status: { $ne: 'deleted' } },
    { projection: { _id: 0 } }
  );

  return inventoryItem ? inventoryToProduct(inventoryItem) : PRODUCTS.find((product) => product.slug === slug);
}
