import http from "http";
import https from "https";
import { setCache } from "./caching.js";
export function forwardRequest(req, res, originUrl, cacheKey) {
    // Determine if the request should be forwarded over HTTP or HTTPS
    const isHttps = originUrl.protocol === "https:";
    const client = isHttps ? https : http;
    if (!originUrl || !originUrl.hostname) {
        res.writeHead(500);
        res.end("Invalid origin URL");
        return;
    }
    const options = {
        hostname: originUrl.hostname,
        port: originUrl.port || (isHttps ? 443 : 80),
        path: req.url,
        method: req.method,
        headers: req.headers,
    };
    const proxyReq = client.request(options, (proxyRes) => {
        let body = [];
        proxyRes.on("data", (chunk) => body.push(chunk));
        proxyRes.on("end", () => {
            const buffer = Buffer.concat(body);
            res.writeHead(proxyRes.statusCode || 500, {
                ...proxyRes.headers,
                "X-Cache": "MISS",
            });
            res.end(buffer);
            if (req.method === "GET") {
                setCache(cacheKey, {
                    statusCode: proxyRes.statusCode,
                    headers: proxyRes.headers,
                    body: buffer,
                });
            }
        });
    });
    proxyReq.on("error", () => {
        res.writeHead(502);
        res.end("Bad Gateway");
    });
    req.pipe(proxyReq);
}
