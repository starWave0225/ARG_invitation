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
  assert.doesNotMatch(guide,/DLC《希。望》|救援结局：人间向阳/);
  assert.match(layout,/import "\.\/rescue\.css"/);
  assert.match(layout,/希。望｜《嫁》DLC/);
  assert.doesNotMatch(dlc,/jia-ending-xi-complete/);
  assert.match(dlc,/STANDALONE ROUTE/);
  assert.match(dlc,/183\.214\.76\.119/);
  assert.match(dlc,/同步报警并请求急救联动/);
  assert.match(dlc,/要让他们进来吗/);
  assert.match(dlc,/顾盼，27岁，/);
  assert.match(dlc,/幸存。/);
  assert.match(dlc,/这一次，我自己挂/);
  assert.match(dlc,/jia-dlc-rescue-complete/);
  assert.match(styles,/\.rescue-dlc/);
});
