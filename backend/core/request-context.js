import crypto from 'crypto';

export function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export function createRequestContext(req, params) {
  const path = (params?.path || []).join('/');
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
