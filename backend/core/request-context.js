import crypto from 'crypto';

export function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export function createRequestContext(req, params) {
  const paramPath = params?.path;
  const pathFromParams = Array.isArray(paramPath) ? paramPath.join('/') : paramPath || '';
  const urlPath = req.nextUrl?.pathname || new URL(req.url).pathname;
  const pathFromUrl = urlPath.replace(/^\/api\/?/, '').replace(/^\/+|\/+$/g, '');
  const path = pathFromParams || pathFromUrl;
  const method = req.method;
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
  return {
    requestId,
    method,
    path,
    ip: getClientIp(req),
    startedAt: Date.now(),
  };
}
