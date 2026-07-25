import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the game opening screen", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>嫁｜双周目网页调查叙事<\/title>/);
  assert.match(html, /点击播放《嫁》游戏片头/);
  assert.match(html, /CLICK TO BEGIN · 建议使用耳机/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("ships the reversible testimony branch and text-based first ending", async () => {
  const [desktop, ending, audioInfo] = await Promise.all([
    readFile(new URL("../app/computer/DesktopRoute.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ending/let-go/page.tsx", import.meta.url), "utf8"),
    stat(new URL("../public/audio/bgm/ending-one-sun-earth.ogg", import.meta.url)),
  ]);

  assert.match(desktop, /是否继续要求郝倩出庭作证？/);
  assert.match(desktop, /返回“是否要求出庭”/);
  assert.match(desktop, /savedTestimonyStep>=9/);
  assert.match(desktop, /查看刘涵的消息/);
  assert.match(desktop, /data-testid="hq-testimony-next"/);
  assert.match(desktop, /window\.location\.assign\("\/ending\/let-go"\)/);
  assert.match(desktop, /心脏像被骤然攥紧，沈望无法将那句话说完，视线在短暂的黑暗中失去焦点。/);
  assert.match(ending, /ending-one-sun-earth\.ogg/);
  assert.match(ending, /memories\/art-show-2018\.png/);
  assert.match(ending, /ending\/let-go\/shen-walking\.png/);
  assert.match(ending, /ending\/let-go\/gupan-walking\.png/);
  assert.match(ending, /let-go-reading-article/);
  assert.match(ending, /<small>01\/04<\/small>/);
  assert.match(ending, /进入结局|audio\.currentTime=0/);
  assert.match(ending, /沈望尽量不让自己哭出声/);
  assert.match(ending, /至少，那张照片，替他们记得/);
  assert.doesNotMatch(ending, /ENDING_DURATION|narrativeBeats|let-go-controls/);
  assert.doesNotMatch(ending, /let-go-walker-wrap/);
  assert.match(ending, /返回对话，重新选择/);
  assert.ok(audioInfo.size > 1_000_000);

  await Promise.all([
    access(new URL("../app/ending/let-go/page.tsx", import.meta.url)),
    access(new URL("../public/ending/let-go/shen-walking.png", import.meta.url)),
    access(new URL("../public/ending/let-go/gupan-walking.png", import.meta.url)),
  ]);
});

test("documents every secret archive query and enlarges emotional narration", async () => {
  const [guide, styles] = await Promise.all([
    readFile(new URL("../public/story-guide.html", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(guide, /郝倩秘密档案查询[\s\S]*YF-HQ-0214/);
  assert.match(guide, /顾盼秘密档案查询[\s\S]*SD-8845127[\s\S]*HM-2217/);
  assert.match(guide, /秘密档案网站入口[\s\S]*womandriver/);
  assert.ok(
    guide.indexOf("从H.Q.微博确认真实姓名") < guide.indexOf("查询郝倩康复记录"),
    "H.Q.微博应当排在郝倩康复记录查询之前",
  );
  assert.doesNotMatch(guide, /<li><b>康复账单：<\/b><code>HAO QIAN/);
  assert.match(styles, /\.wx-inner-voice\{[^}]*clamp\(14px,1\.05vw,16px\)\/2/);
  assert.match(styles, /\.wx-inner-voice\.urgent\{[^}]*animation:hq-urgent-text-shake \.18s steps\(2,end\) infinite/);
  assert.match(styles, /\.let-go-text-ending\.is-reading\{[^}]*height:100dvh[^}]*overflow-y:auto/);
  assert.match(styles, /\.let-go-text-ending \.let-go-gate>small,\.let-go-reading-article>small\{font-size:16px/);
});

test("ships the late-flowers ending and Liu Han continuation handoff", async () => {
  const [desktop, ending, audioInfo] = await Promise.all([
    readFile(new URL("../app/computer/DesktopRoute.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ending/late-flowers/page.tsx", import.meta.url), "utf8"),
    stat(new URL("../public/audio/bgm/second-chance.mp3", import.meta.url)),
  ]);

  assert.match(desktop, /沈望，你先别订回程。/);
  assert.match(desktop, /这次你不是一个人去。/);
  assert.match(desktop, /data-testid="enter-late-flowers-ending"/);
  assert.match(desktop, /window\.location\.assign\("\/ending\/late-flowers"\)/);
  assert.match(desktop, /你现在是刘涵 · 调查目标已更新/);
  assert.match(ending, /const ENDING_DURATION=38/);
  assert.match(ending, /……顾盼已经去世了。/);
  assert.match(ending, /明日黄花/);
  assert.match(ending, /扮演刘涵，继续调查全部真相/);
  assert.match(ending, /window\.location\.assign\("\/computer\/liuhan\?app=wechat"\)/);
  assert.ok(audioInfo.size > 1_000_000);

  await access(new URL("../app/ending/late-flowers/page.tsx", import.meta.url));
});
