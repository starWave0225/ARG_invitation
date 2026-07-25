import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

test("labels Hao Qian's negative testimony choice as the first ending",async()=>{
  const desktop=await readFile(new URL("../app/computer/DesktopRoute.tsx",import.meta.url),"utf8");

  assert.match(desktop,/data-testid="hq-ending-one-choice"[\s\S]*否。到这里吧。— 第一结局/);
});
