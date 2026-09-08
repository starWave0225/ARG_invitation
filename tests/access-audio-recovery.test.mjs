import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
async function load(path) {
  const source = await readFile(new URL(path, root), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}
function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), clear: () => values.clear() };
}
const access = await load("app/yuanfan/access.ts");
const music = await load("app/music-settings.ts");

test("only an existing access grant or completed Han Duo verification unlocks Yuanfan", () => {
  for (const initial of [{}, { "jia-hd-added": "true", "jia-school-registered": "true" }]) {
    const save = storage(initial);
    assert.equal(access.readYuanfanAccess(save), false);
    assert.equal(save.getItem("jia-yuanfan-site-access"), null);
  }
  assert.equal(access.readYuanfanAccess(storage({ "jia-yuanfan-site-access": "true" })), true);
});

test("verified legacy saves repair access, while a cleared save stays locked", () => {
  const save = storage({ "jia-hd-trusted": "true" });
  assert.equal(access.readYuanfanAccess(save), true);
  assert.equal(save.getItem("jia-yuanfan-site-access"), "true");
  save.clear();
  assert.equal(access.readYuanfanAccess(save), false);
});

test("open Yuanfan pages resync on storage, focus, visibility and history restoration", async () => {
  const source = await readFile(new URL("app/yuanfan/useYuanfanAccess.ts", root), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const save = storage();
  const window = new EventTarget();
  window.localStorage = save;
  const document = new EventTarget();
  document.visibilityState = "visible";
  let state;
  let effect;
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module, exports: module.exports, window, document,
    require: name => name === "react" ? {
      useState: initial => { state = initial; return [state, value => { state = value; }]; },
      useEffect: callback => { effect = callback; },
    } : access,
  });
  module.exports.useYuanfanAccess();
  assert.equal(state, null, "the initial render is pending, not denied");
  const cleanup = effect();
  assert.equal(state, false);
  for (const event of ["storage", "jia-progress", "focus", "pageshow", "visibilitychange"]) {
    save.setItem("jia-hd-trusted", "true");
    (event === "visibilitychange" ? document : window).dispatchEvent(new Event(event));
    assert.equal(state, true, event);
    save.clear();
    window.dispatchEvent(new Event("storage"));
    assert.equal(state, false);
  }
  cleanup();
  save.setItem("jia-hd-trusted", "true");
  window.dispatchEvent(new Event("storage"));
  assert.equal(state, false, "unmounted listeners are removed");
});

test("restoring a legacy zero-volume save returns to the default audible volume", () => {
  const save = storage({ "arg-music-volume": "0", "arg-music-muted": "false" });
  const restored = music.toggleMusicMuted(save);
  assert.equal(restored.volume, 0.45);
  assert.equal(restored.muted, false);
});

test("zero volume survives reload and restores the last nonzero setting", () => {
  const save = storage();
  music.changeMusicVolume(save, 0.73);
  music.changeMusicVolume(save, 0);
  assert.equal(music.readMusicSettings(save).volume, 0);
  assert.equal(music.readMusicSettings(save).muted, true);
  const restored = music.toggleMusicMuted(save);
  assert.equal(restored.volume, 0.73);
  assert.equal(restored.muted, false);
});

test("raising the slider unmutes, and settings can be read by another page", () => {
  const save = storage();
  music.toggleMusicMuted(save);
  const updated = music.changeMusicVolume(save, 0.6);
  assert.equal(updated.muted, false);
  assert.deepEqual(music.readMusicSettings(save), updated);
  music.toggleMusicMuted(save);
  assert.equal(music.toggleMusicMuted(save).volume, 0.6);
});

test("invalid audio preferences recover to finite bounded volumes", () => {
  const save = storage({ "arg-music-volume": "bad", "arg-music-last-volume": "0" });
  assert.equal(music.readMusicSettings(save).volume, 0.45);
  assert.equal(music.changeMusicVolume(save, 2).volume, 1);
  assert.equal(music.changeMusicVolume(save, -1).volume, 0);
  assert.equal(music.toggleMusicMuted(save).volume, 1);
});
