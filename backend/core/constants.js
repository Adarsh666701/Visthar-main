export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-Id',
};

export const SITE_SETTINGS_TTL_MS = 60 * 1000;
export const STATS_TTL_MS = 20 * 1000;
export const MAX_ADMIN_PAGE_SIZE = 500;

export const RATE_LIMITS = {
  defaultRead: { limit: 300, windowMs: 60 * 1000 },
  defaultWrite: { limit: 120, windowMs: 60 * 1000 },
  auth: { limit: 10, windowMs: 60 * 1000 },
  lead: { limit: 20, windowMs: 60 * 1000 },
  admin: { limit: 240, windowMs: 60 * 1000 },
};

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

// Twilio Configuration
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

export const AWS_S3_URL = process.env.AWS_S3_URL || '';
export const AWS_CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL || '';
