import { build } from "esbuild";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { test as base } from "@playwright/test";

export const test = base.extend<object, { mapHarness: string }>({
  mapHarness: [async ({}, runFixture) => {
    const output = await mkdtemp(join(tmpdir(), "vijfhoek-map-test-"));
    const server = createServer(async (request, response) => {
      if (request.url === "/map.js" || request.url === "/map.css") {
        response.setHeader("Content-Type", request.url.endsWith(".js") ? "text/javascript" : "text/css");
        response.end(await readFile(join(output, request.url.slice(1))));
      } else if (request.url === "/original.svg") {
        response.setHeader("Content-Type", "image/svg+xml");
        response.end('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M80 80H450V450H80Z M520 80H910V450H690V330H520Z M80 540H450V900H80Z M270 540V900 M520 540H910V900H520Z M650 650H750V750H650Z" fill="#eef1ef" fill-rule="evenodd" stroke="#626e67" stroke-width="2"/></svg>');
      } else {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end('<!DOCTYPE html><html lang="nl"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Isolated map component test</title><link rel="stylesheet" href="/map.css"><style>*{box-sizing:border-box}body{margin:0;background:#fff;color:#151616;font:15px/1.65 Arial,sans-serif}main{max-width:1200px;margin:auto;padding:20px}h1{font-size:24px}h3,p{margin:0}button,input{font:inherit}a{color:inherit}.sr-only{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.text-link{display:inline-flex;align-items:center;gap:10px}</style></head><body><div id="root"></div><script type="module" src="/map.js"></script></body></html>');
      }
    });
    try {
      await build({
        entryPoints: [resolve("tests/fixtures/map-app.tsx")],
        outfile: join(output, "map.js"),
        bundle: true,
        format: "esm",
        platform: "browser",
        jsx: "automatic",
        alias: { "next/link": resolve("tests/fixtures/map-link.tsx"), "next/navigation": resolve("tests/fixtures/map-navigation.tsx") },
        define: { "process.env.NODE_ENV": '"production"', "process.env.NEXT_PUBLIC_BASE_PATH": '""' },
        logLevel: "silent",
      });
      await new Promise<void>((ready) => server.listen(0, "127.0.0.1", ready));
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("Map test harness failed to start.");
      await runFixture(`http://127.0.0.1:${address.port}`);
    } finally {
      server.closeAllConnections();
      if (server.listening) await new Promise<void>((done) => server.close(() => done()));
      await rm(output, { recursive: true, force: true });
    }
  }, { scope: "worker" }],
});

export { expect } from "@playwright/test";
