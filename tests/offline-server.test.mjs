import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { request } from "node:http";
import { after, before, test } from "node:test";
import { createGameServer } from "../scripts/offline/server.mjs";

let directory, server, base;
before(async () => {
  directory = await mkdtemp(join(tmpdir(), "jia-offline-"));
  const site = join(directory, "site");
  await mkdir(join(site, "computer", "shen"), { recursive: true });
  await writeFile(join(site, "index.html"), "<title>嫁</title>");
  await writeFile(join(site, "computer", "shen", "index.html"), "computer");
  await writeFile(join(site, "music.mp3"), "0123456789");
  await writeFile(join(site, "附件.txt"), "evidence");
  await writeFile(join(site, "empty.txt"), "");
  await writeFile(join(site, "computer", "shen", "index.txt"), "flight-payload");
  await writeFile(join(directory, "secret.txt"), "private");
  await symlink(join(directory, "secret.txt"), join(site, "escape.txt"));
  server = createGameServer(site);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  await rm(directory, { recursive: true, force: true });
});

test("serves the game, nested routes, Flight payloads and Unicode downloads", async () => {
  const home = await fetch(base);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /嫁/);
  assert.match(home.headers.get("content-security-policy"), /connect-src 'self'/);
  const redirect = await fetch(`${base}/computer/shen?clue=1`, { redirect: "manual" });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get("location"), "/computer/shen/?clue=1");
  assert.equal(await (await fetch(`${base}/computer/shen/`)).text(), "computer");
  assert.equal(await (await fetch(`${base}/computer/shen/index.txt?_rsc=abc`)).text(), "flight-payload");
  assert.equal(await (await fetch(`${base}/${encodeURIComponent("附件.txt")}`)).text(), "evidence");
  assert.equal((await fetch(`${base}/does-not-exist`)).status, 404);
  assert.equal(await (await fetch(`${base}/empty.txt`)).text(), "");
});

test("supports audio seeking with byte ranges and HEAD", async () => {
  for (const [range, body, contentRange] of [["bytes=2-5", "2345", "bytes 2-5/10"], ["bytes=-3", "789", "bytes 7-9/10"], ["bytes=8-", "89", "bytes 8-9/10"]]) {
    const response = await fetch(`${base}/music.mp3`, { headers: { Range: range } });
    assert.equal(response.status, 206);
    assert.equal(response.headers.get("content-type"), "audio/mpeg");
    assert.equal(response.headers.get("content-range"), contentRange);
    assert.equal(await response.text(), body);
  }
  for (const range of ["bytes=100-", "bytes=5-2", "bytes=-0", "bytes=-", "bytes=0-1,4-5"]) {
    assert.equal((await fetch(`${base}/music.mp3`, { headers: { Range: range } })).status, 416);
  }
  const head = await fetch(`${base}/music.mp3`, { method: "HEAD" });
  assert.equal(head.headers.get("content-length"), "10");
  assert.equal(await head.text(), "");
});

test("rejects traversal, symlinks outside the site, foreign hosts and writes", async () => {
  const raw = (path, headers = {}) => new Promise((resolve, reject) => {
    request(base, { path, headers }, response => { response.resume(); resolve(response.statusCode); }).on("error", reject).end();
  });
  assert.equal(await raw("/%2e%2e%2fsecret.txt"), 403);
  assert.equal(await raw("/%ZZ"), 400);
  assert.equal(await raw("/a%5c..%5csecret.txt"), 400);
  assert.equal((await fetch(`${base}/escape.txt`)).status, 403);
  assert.equal(await raw("/", { Host: "example.com" }), 403);
  assert.equal((await fetch(base, { method: "POST" })).status, 405);
  assert.equal((await (await fetch(`${base}/__jia_offline_health`)).json()).app, "jia-offline-v1");
});
