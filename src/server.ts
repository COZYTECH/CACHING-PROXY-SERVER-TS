import http from "http";
import { forwardRequest } from "./proxy.js";
import { URL } from "url";
import { getCache, setCache, clearCache as wipe } from "./caching.js";

export function clearCache() {
  wipe();
}

export function startServer({
  port,
  origin,
}: {
  port: number;
  origin: string;
}) {
  const originUrl = new URL(origin);

  const server = http.createServer(async (req, res) => {
    const cacheKey = `${req.method}:${req.url}`;

    // Only cache GET
    if (req.method === "GET") {
      const cached = getCache(cacheKey);
      if (cached) {
        res.writeHead(cached.statusCode || 500, {
          ...cached.headers,
          "X-Cache": "HIT",
        });
        res.end(cached.body);
        return;
      }
    }

    forwardRequest(req, res, originUrl, cacheKey);
  });

  server.listen(port, () => {
    console.log(`Caching proxy running on http://localhost:${port}`);
    console.log(` Forwarding to ${origin}`);
  });
}
