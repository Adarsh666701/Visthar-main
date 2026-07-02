import { AWS_CLOUDFRONT_URL, AWS_S3_URL } from '../core/constants';

function isAbsoluteUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function normalizeKey(value) {
  if (!value) return '';
  return String(value).replace(/^\/+/, '');
}

function encodeS3Key(key) {
  return normalizeKey(key)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function getBaseUrl() {
  if (AWS_CLOUDFRONT_URL) return AWS_CLOUDFRONT_URL.replace(/\/+$/, '');
  if (AWS_S3_URL) return AWS_S3_URL.replace(/\/+$/, '');
  return '';
}

export function getMediaUrl(key) {
  if (!key) return '';
  if (isAbsoluteUrl(key)) return String(key);

  const baseUrl = getBaseUrl();
  if (!baseUrl) return String(key);

  return `${baseUrl}/${encodeS3Key(String(key))}`;
}
