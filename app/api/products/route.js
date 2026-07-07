import { logError, logRequestEnd, logRequestStart } from '@/backend/core/logger';
import { createRequestContext } from '@/backend/core/request-context';
import { errorResponse, jsonResponse } from '@/backend/core/response';
import { getDb } from '@/backend/services/db-service';
import { loadProductsWithFallback } from '@/lib/inventory-products';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const ctx = createRequestContext(req, { path: ['products'] });
  logRequestStart(ctx);

  try {
    const db = await getDb();
    const products = await loadProductsWithFallback(db);
    const res = jsonResponse(ctx, { products });
    logRequestEnd(ctx, res.status);
    return res;
  } catch (error) {
    logError(ctx, error);
    const res = errorResponse(ctx, error?.message || 'internal server error', 500);
    logRequestEnd(ctx, res.status);
    return res;
  }
}
