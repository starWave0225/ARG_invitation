import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

test("ships a post-ending DLC route that genuinely saves Gu Pan",async()=>{
  const [home,dlc,layout,styles,guide]=await Promise.all([
    readFile(new URL("../app/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/dlc/rescue/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/dlc/rescue/layout.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/dlc/rescue/rescue.css",import.meta.url),"utf8"),
    readFile(new URL("../public/story-guide.html",import.meta.url),"utf8"),
  ]);

  assert.doesNotMatch(home,/DLC STORY|\/dlc\/rescue/);
  assert.doesNotMatch(guide,/DLC《希·望》|救援结局：人间向阳/);
  assert.match(layout,/import "\.\/rescue\.css"/);
  assert.match(layout,/希·望｜《嫁》DLC/);
  assert.match(layout,/process\.env\.NODE_ENV==="development"\|\|process\.env\.DLC_RESCUE_ENABLED==="true"/);
  assert.match(layout,/metadata:Metadata=isDlcEnabled\?dlcMetadata/);
  assert.match(layout,/title:"页面不存在｜嫁"/);
  assert.match(layout,/if\(!isDlcEnabled\)notFound\(\)/);
  assert.doesNotMatch(layout,/next\/headers|headers\(\)/);
  assert.match(dlc,/我想活下去！/);
  assert.doesNotMatch(dlc,/jia-ending-xi-complete/);
  assert.match(dlc,/STANDALONE ROUTE/);
  assert.match(dlc,/你将扮演顾盼/);
  assert.match(dlc,/旧手机只剩6%的电/);
  assert.match(dlc,/我是顾盼，被反锁在晴川公寓4-1-402/);
  assert.match(dlc,/我叫顾盼。我被从外面反锁/);
  assert.match(dlc,/我叫顾盼。/);
  assert.match(dlc,/我活下来了。/);
  assert.match(dlc,/画是我自己挂的/);
  assert.match(dlc,/jia-dlc-hope-complete/);
  assert.doesNotMatch(dlc,/让刘涵独自上门|带着真相，回到三天前/);
  assert.match(styles,/\.rescue-dlc/);
});
