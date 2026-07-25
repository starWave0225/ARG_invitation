import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

test("keeps Liu Han's opening history when the farewell branch begins", async () => {
  const desktop=await readFile(new URL("../app/computer/DesktopRoute.tsx",import.meta.url),"utf8");

  assert.match(desktop,/function LiuHanFarewellDialogue\(\)[\s\S]*liuHanOpeningExchanges\.slice\(0,openingStep\)/);
  assert.match(desktop,/沈望已前往海外北港的寄存中心[\s\S]*今天 03:17/);
  assert.match(desktop,/function ShenWangOpeningMirror\(\)[\s\S]*沈望前往北港前/);
  assert.match(desktop,/先查下顾盼现在住哪里？/);
  assert.match(desktop,/调查目标已更新：确认顾盼目前的住址/);
  assert.doesNotMatch(desktop,/她为什么会死？/);
  assert.doesNotMatch(desktop,/还原顾盼死亡前的全部记录/);
});
