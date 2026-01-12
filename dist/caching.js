//import { LRU } from "lru-cache";
import { LRUCache } from "lru-cache";
export const cache = new LRUCache({
    max: 500, // Maximum number of items in cache
    ttl: 1000 * 60 * 5, // 5 minutes TTL
});
export function getCache(key) {
    return cache.get(key);
}
export function setCache(key, value) {
    cache.set(key, value);
}
export function clearCache() {
    cache.clear();
    console.log("Cache cleared");
}
