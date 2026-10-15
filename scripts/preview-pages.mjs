import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { parseArgs } from "node:util";
import { pagesBasePath } from "./pages-options.mjs";

const { values } = parseArgs({ options: {
  port: { type: "string", default: "3200" },
  "base-path": { type: "string", default: pagesBasePath() },
} });
const root = resolve("out");
const basePath = values["base-path"];
const notFoundPage = await readFile(resolve(root, "404.html"));
const mimeTypes = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".woff2": "font/woff2",
};

const server = createServer(async (request, response) => {
  function notFound() {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(notFoundPage);
  }
  try {
    const url = new URL(request.url, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    if (basePath && pathname !== basePath && !pathname.startsWith(`${basePath}/`)) return notFound();
    const relativePath = pathname.slice(basePath.length) || "/";
    let file = resolve(root, `.${relativePath}`);
    if (file !== root && !file.startsWith(root + sep)) return notFound();
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith("/")) {
        response.writeHead(301, { Location: `${url.pathname}/${url.search}` });
        return response.end();
      }
      file = resolve(file, "index.html");
      await stat(file);
    }
    response.writeHead(200, { "Content-Type": mimeTypes[extname(file)] || "application/octet-stream" });
    if (request.method === "HEAD") return response.end();
    createReadStream(file).on("error", () => response.destroy()).pipe(response);
  } catch { notFound(); }
});

server.listen(Number(values.port), "127.0.0.1", () => {
  console.log(`Static Pages preview listening on port ${values.port}, path ${basePath || "/"}.`);
});
