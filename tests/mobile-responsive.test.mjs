import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("root layout enables device viewport and loads the mobile layer last", async () => {
  const layout = await read("app/layout.tsx");

  assert.match(layout, /viewportFit:\s*"cover"/);
  assert.match(layout, /width:\s*"device-width"/);
  assert.ok(
    layout.indexOf('import "./mobile.css"') > layout.indexOf('import "./opening-walk.css"'),
    "mobile overrides must load after the scene styles",
  );
});

test("mobile styles cover safe areas, dynamic viewport and primary route families", async () => {
  const css = await read("app/mobile.css");

  for (const required of [
    "100dvh",
    "safe-area-inset-top",
    "safe-area-inset-bottom",
    "(max-height: 520px) and (pointer: coarse)",
    ".pc-window.qq-window",
    ".pc-map-search",
    ".pc-map-canvas",
    ".pc-diary-mobile-select",
    ".edge-toolbar",
    ".gp-mail-list",
    ".gp-mail-mobile-back",
    ".pc-recycle-list",
    ".wx-mobile-chat-open",
    ".qq-mobile-chat-open",
    ".wb-layout",
    ".record-app",
    ".uni-hub",
    ".hm-case",
    ".police-workbench",
    ".aid-calendar",
    ".nightdrive-grid",
    ".rescue-dlc",
  ]) {
    assert.ok(css.includes(required), `missing mobile coverage for ${required}`);
  }
});

test("QQ and WeChat expose list-detail navigation on phones", async () => {
  const desktop = await read("app/computer/DesktopRoute.tsx");

  assert.match(desktop, /qq-mobile-chat-open/);
  assert.match(desktop, /className="qq-mobile-back"/);
  assert.match(desktop, /wx-mobile-chat-open/);
  assert.match(desktop, /className="wx-mobile-back"/);
  assert.match(desktop, /aria-label="返回会话列表"/);
  assert.match(desktop, /\(hover: none\) and \(pointer: coarse\)/);
});

test("phone taskbar exposes a device switcher without changing desktop layout", async () => {
  const [desktop, css] = await Promise.all([
    read("app/computer/DesktopRoute.tsx"),
    read("app/mobile.css"),
  ]);

  assert.match(desktop, /className={`pc-mobile-device-button/);
  assert.match(desktop, /className="pc-mobile-device-menu"/);
  assert.match(desktop, /aria-label="切换电脑"/);
  assert.doesNotMatch(desktop, /尚未解锁/);
  assert.match(desktop, /\(gupanComputerAvailable\|\|owner==="gupan"\)&&<a/);
  assert.match(desktop, /\(liuHanComputerAvailable\|\|owner==="liuhan"\)&&<a/);
  assert.match(css, /\.pc-mobile-device-button,\s*\n\.pc-mobile-device-menu\s*{\s*display:\s*none/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.pc-taskbar \.pc-mobile-device-button,\s*\n\s*\.pc-taskbar \.pc-mobile-hint-button\s*{[\s\S]*display:\s*flex/);
});

test("normal mode exposes the current investigation hint from the phone taskbar", async () => {
  const [desktop, css] = await Promise.all([
    read("app/computer/DesktopRoute.tsx"),
    read("app/mobile.css"),
  ]);

  assert.match(desktop, /gameMode==="normal"&&<button[^>]+pc-mobile-hint-button/);
  assert.match(desktop, /className="pc-mobile-hint-panel" aria-label="当前调查提示"/);
  assert.match(desktop, /查看调查档案/);
  assert.match(css, /\.pc-mobile-hint-button,\s*\n\.pc-mobile-hint-panel,\s*\n\.pc-mobile-device-button/);
  assert.match(css, /\.pc-taskbar \.pc-mobile-device-button,\s*\n\s*\.pc-taskbar \.pc-mobile-hint-button\s*{[\s\S]*display:\s*flex/);
});

test("phone translation toggle clears the computer window close control", async () => {
  const css = await read("app/mobile.css");

  assert.match(css, /body:has\(\.pc-window\) \.global-translation-toggle\s*{\s*right:\s*calc\(55px \+ var\(--mobile-safe-right\)\)/);
});

test("computer apps use dedicated phone layouts instead of compressed desktop grids", async () => {
  const [desktop, css] = await Promise.all([
    read("app/computer/DesktopRoute.tsx"),
    read("app/mobile.css"),
  ]);

  assert.match(desktop, /className="pc-diary-mobile-select"/);
  assert.match(css, /\.pc-map-search\s*{[\s\S]*grid-template-columns:\s*1fr;[\s\S]*grid-template-rows:\s*auto minmax\(150px, 36%\) minmax\(0, 1fr\)/);
  assert.match(desktop, /mobileMessageOpen\?"mobile-mail-open":""/);
  assert.match(desktop, /className="gp-mail-mobile-back"/);
  assert.match(css, /\.gp-mailbox\.mobile-mail-open \.gp-mail-list\s*{\s*display:\s*none/);
  assert.match(css, /\.gp-mailbox\.mobile-mail-open article\s*{\s*display:\s*block/);
  assert.match(css, /\.edge-tabs > span\s*{[\s\S]*min-width:\s*0/);
  assert.match(css, /\.pc-diary\s*{\s*grid-template-rows:\s*auto minmax\(0, 1fr\)/);
  assert.match(css, /@media \(max-height: 520px\) and \(orientation: landscape\)[\s\S]*\.pc-map-search\s*{[\s\S]*grid-template-columns:\s*minmax\(0, 1\.25fr\)/);
});
