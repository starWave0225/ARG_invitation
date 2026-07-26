import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

test("documents the complete late-flowers branch and Liu Han rewind",async()=>{
  const [guide,outline,map]=await Promise.all([
    readFile(new URL("../public/story-guide.html",import.meta.url),"utf8"),
    readFile(new URL("../app/FullInvestigation.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/page.tsx",import.meta.url),"utf8"),
  ]);

  for(const document of [guide,outline,map]){
    assert.match(document,/明日黄花/);
    assert.match(document,/三天前/);
  }
  assert.match(guide,/第二结局：明日黄花[\s\S]*扮演刘涵/);
  assert.match(guide,/原有的刘涵聊天不会被替换/);
  assert.match(guide,/沈望与刘涵此前的聊天记录都会保留/);
  assert.match(outline,/第二结局后，扮演刘涵继续调查/);
});
