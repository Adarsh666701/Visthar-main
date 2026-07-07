import { logError, logRequestEnd, logRequestStart } from '@/backend/core/logger';
import { createRequestContext } from '@/backend/core/request-context';
import { errorResponse, jsonResponse } from '@/backend/core/response';
import { getDb } from '@/backend/services/db-service';
import { loadProductWithFallback } from '@/lib/inventory-products';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  const slug = String(params?.slug || '');
  const ctx = createRequestContext(req, { path: ['products', slug] });
  logRequestStart(ctx);

  try {
    const db = await getDb();
    const product = await loadProductWithFallback(db, slug);
    const res = product
      ? jsonResponse(ctx, { product })
      : jsonResponse(ctx, { error: 'product not found' }, 404);
    logRequestEnd(ctx, res.status);
    return res;
  } catch (error) {
    logError(ctx, error);
    const res = errorResponse(ctx, error?.message || 'internal server error', 500);
    logRequestEnd(ctx, res.status);
    return res;
  }
}
