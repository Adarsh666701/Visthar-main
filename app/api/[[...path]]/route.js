import { handleAdminRoute } from '@/backend/controllers/admin-controller';
import { handleAuthRoute } from '@/backend/controllers/auth-controller';
import { handleCartRoute } from '@/backend/controllers/cart-controller';
import { handleLeadRoute } from '@/backend/controllers/lead-controller';
import { handleOrderRoute } from '@/backend/controllers/order-controller';
import { handlePaymentRoute } from '@/backend/controllers/payment-controller';
import { handleProductRoute } from '@/backend/controllers/product-controller';
import { handleSiteSettingsRoute } from '@/backend/controllers/site-settings-controller';
import { handlePublicStatsRoute } from '@/backend/controllers/stats-controller';
import { logError, logRateLimit, logRequestEnd, logRequestStart } from '@/backend/core/logger';
import { createRequestContext } from '@/backend/core/request-context';
import { emptyResponse, errorResponse, jsonResponse } from '@/backend/core/response';
import { getDb } from '@/backend/services/db-service';
import { enforceRateLimit } from '@/backend/services/rate-limit-service';

export async function OPTIONS(req, { params }) {
  const ctx = createRequestContext(req, params);
  const res = emptyResponse(ctx, 200);
  logRequestEnd(ctx, res.status);
  return res;
}

async function handle(req, { params }) {
  const ctx = createRequestContext(req, params);
  logRequestStart(ctx);

  try {
    if (!ctx.path) {
      const res = jsonResponse(ctx, {
        ok: true,
        service: 'visthar-api',
        ts: new Date().toISOString(),
      });
      logRequestEnd(ctx, res.status);
      return res;
    }

    const rateLimitResult = await enforceRateLimit({
      ip: ctx.ip,
      method: ctx.method,
      path: ctx.path,
    });

    if (rateLimitResult.limited) {
      logRateLimit(ctx, rateLimitResult.policy);
      const res = errorResponse(ctx, 'too many requests', 429);
      res.headers.set('Retry-After', String(rateLimitResult.retryAfterSec));
      logRequestEnd(ctx, res.status);
      return res;
    }

    const db = await getDb();
    const handlers = [
      handleAuthRoute,
      handleSiteSettingsRoute,
      handleProductRoute,
      handleAdminRoute,
      handleCartRoute,
      handlePaymentRoute,
      handleOrderRoute,
      handleLeadRoute,
    ];

    for (const routeHandler of handlers) {
      const response = await routeHandler(req, db, ctx);
      if (response) {
        logRequestEnd(ctx, response.status);
        return response;
      }
    }

    const statsResponse = await handlePublicStatsRoute(db, ctx);
    if (statsResponse) {
      logRequestEnd(ctx, statsResponse.status);
      return statsResponse;
    }

    const notFound = jsonResponse(ctx, { error: 'not found', path: ctx.path }, 404);
    logRequestEnd(ctx, notFound.status);
    return notFound;
  } catch (error) {
    logError(ctx, error);
    const res = errorResponse(ctx, error?.message || 'internal server error', 500);
    logRequestEnd(ctx, res.status);
    return res;
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
