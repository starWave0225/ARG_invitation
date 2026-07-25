import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

test("queues desktop messages and marks only the visible notification as seen", async () => {
  const desktop=await readFile(new URL("../app/computer/DesktopRoute.tsx",import.meta.url),"utf8");

  assert.match(desktop,/const \[wechatNotices,setWechatNotices\]=useState/);
  assert.match(desktop,/const wechatNotice=wechatNotices\[0\]\?\?null;/);
  assert.match(desktop,/return \[\.\.\.current,\.\.\.incoming\.filter/);
  assert.match(desktop,/localStorage\.setItem\(wechatNotice\.seen,"true"\);/);
  assert.doesNotMatch(desktop,/fresh\.forEach\(item=>localStorage\.setItem\(item\.seen,"true"\)\)/);
});
