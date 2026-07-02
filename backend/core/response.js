import { NextResponse } from 'next/server';
import { CORS_HEADERS } from './constants';

export function withResponseMeta(res, ctx) {
  res.headers.set('X-Request-Id', ctx.requestId);
  res.headers.set('Server-Timing', `app;dur=${Date.now() - ctx.startedAt}`);
  return res;
}

export function jsonResponse(ctx, body, status = 200, extraHeaders = {}) {
  const res = NextResponse.json(body, {
    status,
    headers: {
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
  return withResponseMeta(res, ctx);
}

export function emptyResponse(ctx, status = 200) {
  const res = new NextResponse(null, {
    status,
    headers: {
      ...CORS_HEADERS,
    },
  });
  return withResponseMeta(res, ctx);
}

export function errorResponse(ctx, message, status = 400) {
  return jsonResponse(ctx, { error: message }, status);
}
