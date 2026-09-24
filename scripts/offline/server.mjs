import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat, realpath } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

export const DEFAULT_PORT = 41739;
const APP_ID = "jia-offline-v1";
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif",
  ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav",
  ".mp4": "video/mp4", ".woff2": "font/woff2", ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

// Bind only to this computer; serve only files inside the exported website.
export function createGameServer(root) {
  const site = resolve(root);
  const inside = path => path === site || path.startsWith(site + sep);
  return createServer(async (req, res) => {
    const port = req.socket.localPort;
    if (req.headers.host !== `127.0.0.1:${port}`) {
      res.writeHead(403).end("Forbidden host");
      return;
    }
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self'");
    try {
      const url = new URL(req.url, `http://127.0.0.1:${port}`);
      if (url.pathname === "/__jia_offline_health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(req.method === "HEAD" ? undefined : JSON.stringify({ app: APP_ID, site }));
        return;
      }
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); } catch {
        res.writeHead(400).end("Bad path"); return;
      }
      if (pathname.includes("\\") || pathname.includes("\0")) {
        res.writeHead(400).end("Bad path"); return;
      }
      let file = resolve(site, "." + pathname);
      if (!inside(file)) { res.writeHead(403).end("Forbidden"); return; }
      let info = await stat(file);
      if (info.isDirectory()) {
        if (!url.pathname.endsWith("/")) {
          res.writeHead(308, { Location: url.pathname + "/" + url.search }).end();
          return;
        }
        file = resolve(file, "index.html");
        info = await stat(file);
      }
      const canonicalRoot = await realpath(site);
      const canonicalFile = await realpath(file);
      if (!info.isFile() || !canonicalFile.startsWith(canonicalRoot + sep)) {
        res.writeHead(403).end("Forbidden"); return;
      }
      res.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
      res.setHeader("Accept-Ranges", "bytes");
      let start = 0;
      let end = info.size - 1;
      let partial = false;
      if (req.headers.range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if (!match || (!match[1] && !match[2])) {
          res.writeHead(416, { "Content-Range": `bytes */${info.size}` }).end(); return;
        }
        start = match[1] ? Number(match[1]) : Math.max(0, info.size - Number(match[2]));
        end = match[1] && match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1;
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= info.size) {
          res.writeHead(416, { "Content-Range": `bytes */${info.size}` }).end(); return;
        }
        partial = true;
        res.setHeader("Content-Range", `bytes ${start}-${end}/${info.size}`);
      }
      res.setHeader("Content-Length", Math.max(0, end - start + 1));
      res.writeHead(partial ? 206 : 200);
      if (req.method === "HEAD" || info.size === 0) { res.end(); return; }
      const stream = createReadStream(file, { start, end });
      stream.on("error", () => res.destroy());
      res.on("close", () => stream.destroy());
      stream.pipe(res);
    } catch (error) {
      res.writeHead(["ENOENT", "ENOTDIR"].includes(error.code) ? 404 : 500).end("File not found");
    }
  });
}

function openBrowser(url) {
  const command = process.platform === "win32" ? "rundll32.exe" : process.platform === "darwin" ? "open" : "xdg-open";
  const args = process.platform === "win32" ? ["url.dll,FileProtocolHandler", url] : [url];
  const child = spawn(command, args, { stdio: "ignore", detached: true });
  child.on("error", () => console.log(`Please open ${url} in your browser.`));
  child.unref();
}

async function main() {
  const site = resolve(dirname(fileURLToPath(import.meta.url)), "site");
  const url = `http://127.0.0.1:${DEFAULT_PORT}/`;
  await stat(resolve(site, "index.html"));
  const server = createGameServer(site);
  server.on("error", async error => {
    if (error.code === "EADDRINUSE") {
      try {
        const response = await fetch(`${url}__jia_offline_health`, { signal: AbortSignal.timeout(2000) });
        const existing = await response.json();
        if (existing.app === APP_ID && existing.site === site) {
          console.log("Game is already running. Opening browser...");
          if (!process.argv.includes("--no-open")) openBrowser(url);
          return;
        }
      } catch { /* Another application owns the fixed save origin. */ }
      console.error(`Port ${DEFAULT_PORT} is in use. Close the other game/server window and try again.`);
    } else console.error(error.message);
    process.exitCode = 1;
  });
  server.listen(DEFAULT_PORT, "127.0.0.1", () => {
    console.log(`嫁 | JIA Offline\n${url}\nKeep this window open while playing. Press Ctrl+C to quit.\n游戏运行中，请保留此窗口。按 Ctrl+C 退出。`);
    if (!process.argv.includes("--no-open")) openBrowser(url);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
