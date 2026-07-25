import assert from "node:assert/strict";
import {readFile,stat} from "node:fs/promises";
import test from "node:test";

test("animates the legs during the opening walk sequence",async()=>{
  const [layout,walkStyles,shenFrame,gupanFrame]=await Promise.all([
    readFile(new URL("../app/layout.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/opening-walk.css",import.meta.url),"utf8"),
    stat(new URL("../public/opening/shen-walk-alt.png",import.meta.url)),
    stat(new URL("../public/opening/gupan-walk-alt.png",import.meta.url)),
  ]);

  assert.match(layout,/import "\.\/opening-walk\.css"/);
  assert.match(walkStyles,/\.opening-pixel-parallel \.pose-walk::after/);
  assert.match(walkStyles,/shen-walk-alt\.png/);
  assert.match(walkStyles,/gupan-walk-alt\.png/);
  assert.match(walkStyles,/@keyframes opening-walk-frame-a/);
  assert.match(walkStyles,/@keyframes opening-walk-frame-b/);
  assert.match(walkStyles,/@keyframes pixel-walk-left-facing-center/);
  assert.doesNotMatch(walkStyles,/pixel-walk-left-facing-center[\s\S]*?scaleX\(-1\)/);
  assert.ok(shenFrame.size>10_000);
  assert.ok(gupanFrame.size>10_000);
});
