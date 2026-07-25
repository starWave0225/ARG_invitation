import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

test("keeps Liu Han's opening history when the farewell branch begins", async () => {
  const desktop=await readFile(new URL("../app/computer/DesktopRoute.tsx",import.meta.url),"utf8");

  assert.match(desktop,/function LiuHanFarewellDialogue\(\)[\s\S]*liuHanOpeningExchanges\.slice\(0,openingStep\)/);
  assert.match(desktop,/沈望已前往海外北港的寄存中心[\s\S]*今天 03:17/);
  assert.match(desktop,/function ShenWangOpeningMirror\(\)[\s\S]*第二结局之前 · 今天 03:17/);
  assert.match(desktop,/liuHanFarewellExchanges\.slice\(0,farewellStep\)/);
  assert.match(desktop,/第二结局之后 · 2025年12月4日 05:52/);
});
