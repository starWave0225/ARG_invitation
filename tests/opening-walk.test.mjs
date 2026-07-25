import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

test("animates the legs during the opening walk sequence",async()=>{
  const [layout,walkStyles]=await Promise.all([
    readFile(new URL("../app/layout.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/opening-walk.css",import.meta.url),"utf8"),
  ]);

  assert.match(layout,/import "\.\/opening-walk\.css"/);
  assert.match(walkStyles,/\.opening-pixel-parallel \.pose-walk::after/);
  assert.match(walkStyles,/animation: opening-leg-stride/);
  assert.match(walkStyles,/@keyframes opening-leg-stride/);
  assert.match(walkStyles,/scaleX\(-1\)/);
});
