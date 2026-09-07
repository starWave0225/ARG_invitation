import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import postcss from "postcss";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("content-parity overrides restore sidebars and metadata across every narrow breakpoint", async () => {
  const css = postcss.parse(await read("app/mobile.css"));
  const displays = new Map();
  css.walkRules(rule => {
    if (rule.parent.type !== "atrule" || !rule.parent.params.includes("max-width: 1050px")) return;
    rule.walkDecls("display", declaration => {
      for (const selector of rule.selectors) displays.set(selector, declaration.value);
    });
  });
  for (const selector of [
    ".wb-layout > aside", ".pc-weibo-app .wb-layout > .wb-right",
    ".qz-layout > aside", ".qq-own-space-layout aside", ".nightdrive-right",
    ".nightdrive-layout > aside:first-child", ".nightdrive-header > span",
    ".medical-utility span:last-child", ".qz-archive > header > span",
    ".gp-final-letter > header small", ".hidden-ending-controls time",
    ".let-go-controls time", ".late-flowers-controls time", ".xi-ending-controls time",
  ]) assert.equal(displays.get(selector), "block", `${selector} must not disappear on narrow screens`);
  for (const selector of [".wb-top nav", ".medical-site > header nav", ".uni-header nav", ".hm-header nav", ".police-header nav"])
    assert.equal(displays.get(selector), "flex", `${selector} must remain available`);
  const text = css.toString();
  assert.doesNotMatch(text, /\.wb-right[^{}]*\{\s*display:\s*none\s*!important/);
  assert.match(text, /\.uni-content-grid > \*[\s\S]*?min-width: 0/);
  assert.match(text, /\.uni-program-table,[\s\S]*?overflow-x: auto/);
});

test("phone device menu preserves mode, main menu, reset and date without bypassing unlocks", async () => {
  const desktop = await read("app/computer/DesktopRoute.tsx");
  const menu = desktop.slice(desktop.indexOf('{mobileDevicesOpen&&<nav'), desktop.indexOf('{start&&<div'));
  assert.match(menu, /onClick={toggleGameMode}/);
  assert.match(menu, /href="\/"/);
  assert.match(menu, /onClick={resetGame}/);
  assert.match(menu, /cfg\.date/);
  assert.match(menu, /systemTime/);
  assert.match(desktop, /if\(!window\.confirm\(/, "reset still requires confirmation");
});

test("guide download supports taps while retaining its student access requirement", async () => {
  const nav = await read("app/yuanfan/YuanfanNav.tsx");
  assert.match(nav, /className="aid-guide-download" disabled={!hasAccess}/);
  assert.match(nav, /onClick={\(\)=>{if\(hasAccess\)downloadGuide\(\)}}/);
});

test("evidence viewer offers readable zoom and two-axis touch scrolling", async () => {
  const [desktop, css] = await Promise.all([read("app/computer/DesktopRoute.tsx"), read("app/mobile.css")]);
  assert.match(desktop, /className="pc-image-zoom" aria-pressed={imageZoomed}/);
  assert.match(desktop, /setImageZoomed\(false\),\[previewImage\]/);
  assert.match(css, /touch-action: pan-x pan-y pinch-zoom/);
  assert.match(css, /\.pc-image-lightbox\.is-zoomed figure\s*{\s*width: max\(100%, 760px\)/);
});

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
