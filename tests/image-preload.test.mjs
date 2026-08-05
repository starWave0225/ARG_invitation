import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("preloads every referenced game image before a difficulty can launch", async () => {
  const page = await readFile("app/page.tsx", "utf8");
  const hook = await readFile("app/useGameImagePreloader.ts", "utf8");
  const manifest = JSON.parse(await readFile("public/game-image-manifest.json", "utf8"));

  assert.match(page, /useGameImagePreloader\(\)/);
  assert.match(page, /disabled=\{!imagePreload\.ready\}/);
  assert.match(page, /全部图片资源已就绪/);
  assert.match(hook, /PRELOAD_CONCURRENCY = 6/);
  assert.match(hook, /new URL\("\."\s*,\s*manifestUrl\)/);
  assert.equal(manifest.count, manifest.local.length + manifest.remote.length);
  assert.ok(manifest.count > 80, `expected the complete image set, got ${manifest.count}`);
  assert.ok(manifest.local.includes("opening/evidence-table.png"));
  assert.ok(manifest.local.includes("evidence/liuhan-scene/06-plan-fragment.png"));
  assert.ok(manifest.local.includes("ending/xi/04-police-dawn.png"));
});
