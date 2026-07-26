import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

test("gives every ending a shared play-pause music control",async()=>{
  const endingFiles=[
    "../app/ending/let-go/page.tsx",
    "../app/ending/late-flowers/page.tsx",
    "../app/ending/xi/page.tsx",
    "../app/ending/hidden/page.tsx"
  ];
  const endings=await Promise.all(endingFiles.map(file=>
    readFile(new URL(file,import.meta.url),"utf8")
  ));
  const control=await readFile(
    new URL("../app/ending/EndingMusicControl.tsx",import.meta.url),
    "utf8"
  );

  for(const ending of endings){
    assert.match(ending,/import EndingMusicControl from "\.\.\/EndingMusicControl"/);
    assert.match(ending,/<EndingMusicControl paused=\{paused\} onToggle=\{togglePause\}\/>/);
  }
  assert.match(control,/data-testid="ending-music-toggle"/);
  assert.match(control,/\{paused\?"播放音乐":"暂停音乐"\}/);
  assert.match(control,/aria-label=\{paused\?"播放结局音乐":"暂停结局音乐"\}/);
});

test("ending music claims priority over opening and desktop BGM",async()=>{
  const [control,opening,styles]=await Promise.all([
    readFile(new URL("../app/ending/EndingMusicControl.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/OpeningMusic.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/globals.css",import.meta.url),"utf8")
  ]);

  assert.match(control,/const PLAYBACK_CHANNEL="arg-bgm-playback-owner"/);
  assert.match(control,/postMessage\(\{type:"ending-claim",tabId\}\)/);
  assert.match(control,/event\.data\?\.type!=="claim"/);
  assert.match(opening,/const ENDING_PRIORITY_EVENT = "jia-ending-music-priority"/);
  assert.match(opening,/const suspendForEnding = useCallback/);
  assert.match(opening,/pathname\.startsWith\("\/ending\/"\)/);
  assert.match(opening,/\["claim", "ending-claim"\]\.includes/);
  assert.match(opening,/playerVisible && !pathname\.startsWith\("\/ending\/"\)/);
  assert.match(styles,/\.ending-music-control\{/);
});
