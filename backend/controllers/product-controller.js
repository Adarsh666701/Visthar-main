import { jsonResponse } from '../core/response';
import { loadProductsWithFallback, loadProductWithFallback } from '../../lib/inventory-products';

export async function handleProductRoute(db, ctx) {
  const { method, path } = ctx;
  if (method !== 'GET') return null;

  if (path === 'products') {
    const products = await loadProductsWithFallback(db);
    return jsonResponse(ctx, { products });
  }

  if (path.startsWith('products/')) {
    const slug = decodeURIComponent(path.slice('products/'.length));
    const product = await loadProductWithFallback(db, slug);
    return product ? jsonResponse(ctx, { product }) : jsonResponse(ctx, { error: 'product not found' }, 404);
  }

  return null;
}
