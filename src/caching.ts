//import { LRU } from "lru-cache";
import { LRUCache } from "lru-cache";
//const cache = new Map();

export interface CacheEntry {
  statusCode: number | undefined;
  headers: Record<string, any>;
  body: Buffer;
}

export const cache = new LRUCache<string, CacheEntry>({
  max: 500, // Maximum number of items in cache
  ttl: 1000 * 60 * 5, // 5 minutes TTL
});

export function getCache(key: string): CacheEntry | undefined {
  return cache.get(key);
}

export function setCache(key: string, value: CacheEntry) {
  cache.set(key, value);
}

export function clearCache() {
  cache.clear();
  console.log("Cache cleared");
}
