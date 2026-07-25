import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

test("revisits the ending before entering Liu Han's three-days-earlier investigation",async()=>{
  const [ending,styles]=await Promise.all([
    readFile(new URL("../app/ending/late-flowers/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/ending/late-flowers/transition.module.css",import.meta.url),"utf8"),
  ]);

  assert.match(ending,/type EndingStatus="gate"\|"film"\|"finale"\|"handoff"/);
  assert.match(ending,/setHandoffStage\("flowers"\)/);
  assert.match(ending,/setHandoffStage\("title"\)/);
  assert.match(ending,/>三天前<\/h1>/);
  assert.match(ending,/jia-liuhan-flashback-complete/);
  assert.match(ending,/window\.location\.assign\("\/computer\/liuhan\?app=wechat"\)/);
  assert.match(styles,/echo-door-recede/);
  assert.match(styles,/three-days-title/);
});
