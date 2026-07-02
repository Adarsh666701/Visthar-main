function log(level, event, payload = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...payload,
  };
  console.log(JSON.stringify(entry));
}

export function logRequestStart(ctx) {
  log('info', 'request.start', {
    requestId: ctx.requestId,
    method: ctx.method,
    path: ctx.path,
    ip: ctx.ip,
  });
}

export function logRequestEnd(ctx, status) {
  log('info', 'request.end', {
    requestId: ctx.requestId,
    method: ctx.method,
    path: ctx.path,
    ip: ctx.ip,
    status,
    latencyMs: Date.now() - ctx.startedAt,
  });
}

export function logRateLimit(ctx, policy) {
  log('warn', 'request.rate_limited', {
    requestId: ctx.requestId,
    method: ctx.method,
    path: ctx.path,
    ip: ctx.ip,
    limit: policy.limit,
    windowMs: policy.windowMs,
  });
}

export function logError(ctx, error) {
  log('error', 'request.error', {
    requestId: ctx.requestId,
    method: ctx.method,
    path: ctx.path,
    ip: ctx.ip,
    message: error?.message || 'Unknown error',
    stack: error?.stack,
  });
}
