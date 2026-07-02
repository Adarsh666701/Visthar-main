import { MAX_ADMIN_PAGE_SIZE } from '../core/constants';

export function parsePageParams(req, fallback = 200) {
  const limitRaw = Number(req.nextUrl.searchParams.get('limit'));
  const skipRaw = Number(req.nextUrl.searchParams.get('skip'));
  const limit = Number.isFinite(limitRaw) && limitRaw > 0
    ? Math.min(Math.floor(limitRaw), MAX_ADMIN_PAGE_SIZE)
    : fallback;
  const skip = Number.isFinite(skipRaw) && skipRaw >= 0 ? Math.floor(skipRaw) : 0;
  return { limit, skip };
}

export function collectionList(collection, paging) {
  return collection
    .find({}, { projection: { _id: 0, password_hash: 0 } })
    .sort({ createdAt: -1 })
    .skip(paging.skip)
    .limit(paging.limit)
    .toArray();
}
