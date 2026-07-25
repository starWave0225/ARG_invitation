import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

test("merges medical evidence and advances after the Hao Qian confrontation", async () => {
  const desktop=await readFile(new URL("../app/computer/DesktopRoute.tsx",import.meta.url),"utf8");

  assert.match(desktop,/title:"医疗记录与远帆转介"/);
  assert.match(desktop,/ready:medicalSeen\|\|hqTreatmentSeen/);
  assert.doesNotMatch(desktop,/title:"顾盼的医疗记录"/);
  assert.doesNotMatch(desktop,/title:"郝倩的治疗与远帆转介"/);
  assert.match(desktop,/!hqTreatmentSeen&&!hqFirstRoundComplete\?"查询遗留的治疗记录和账单/);
  assert.match(desktop,/!hqFirstRoundComplete\?"使用相关证据和郝倩完成首轮对质/);
  assert.doesNotMatch(desktop,/!prototypeSeen\.includes\("medical"\)\|\|!prototypeSeen\.includes\("hq-treatment"\)/);
});
