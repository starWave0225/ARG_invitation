import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

test("shows the B-17 arrival mail notification only once per playthrough", async () => {
  const desktop=await readFile(new URL("../app/computer/DesktopRoute.tsx",import.meta.url),"utf8");

  assert.match(desktop,/localStorage\.getItem\("jia-notified-b17-arrival-v2"\)!=="true"/);
  assert.match(desktop,/const b17AlreadyHandled=localStorage\.getItem\("jia-gupan-pc-unlocked"\)==="true";/);
  assert.match(desktop,/if\(!notice\|\|wechatNotice\|\|owner!=="shen"\)return;/);
  assert.match(desktop,/localStorage\.setItem\("jia-notified-b17-arrival-v2","true"\);/);
  assert.match(desktop,/if\(shouldShowB17Notice\)setNotice\(true\);/);
});
