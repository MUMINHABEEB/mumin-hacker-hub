import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "http";

/**
 * Dev-server bridge: runs the Netlify function handler in `netlify/functions/api.ts`
 * for any `/api/*` request during `vite dev`, so the preview talks to MongoDB Atlas
 * exactly like production does on Netlify.
 *
 * Secrets (MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH) are read from
 * process.env on the Node side only — they are never bundled into the client.
 */
export function apiDevServer(): Plugin {
  return {
    name: "mongo-api-dev-server",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url || "";
        if (!url.startsWith("/api/")) return next();

        try {
          const parsed = new URL(url, "http://localhost");
          const queryStringParameters: Record<string, string> = {};
          parsed.searchParams.forEach((v, k) => (queryStringParameters[k] = v));

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const body = chunks.length ? Buffer.concat(chunks).toString("utf-8") : null;

          const headers: Record<string, string> = {};
          for (const [k, v] of Object.entries(req.headers)) {
            if (typeof v === "string") headers[k.toLowerCase()] = v;
            else if (Array.isArray(v)) headers[k.toLowerCase()] = v.join(", ");
          }

          // Loaded lazily so edits to the function hot-reload in dev.
          const mod = await server.ssrLoadModule("/netlify/functions/api.ts");
          const handler = mod.handler;

          const result = await handler({
            path: parsed.pathname,
            httpMethod: req.method || "GET",
            headers,
            queryStringParameters,
            body,
            isBase64Encoded: false,
          });

          res.statusCode = result.statusCode ?? 200;
          for (const [k, v] of Object.entries(result.headers || {})) {
            res.setHeader(k, v as string);
          }
          res.end(result.body ?? "");
        } catch (err) {
          console.error("[api-dev]", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: err instanceof Error ? err.message : "Internal server error",
            })
          );
        }
      });
    },
  };
}
