"use client";

import {useEffect} from "react";

const PLAYBACK_CHANNEL="arg-bgm-playback-owner";
const ENDING_PRIORITY_EVENT="jia-ending-music-priority";

type EndingMusicControlProps={
  paused:boolean;
  onToggle:()=>void;
};

export default function EndingMusicControl({paused,onToggle}:EndingMusicControlProps){
  useEffect(()=>{
    const tabId=window.crypto.randomUUID();
    const channel="BroadcastChannel" in window?new BroadcastChannel(PLAYBACK_CHANNEL):null;
    const claimEndingPriority=()=>{
      window.dispatchEvent(new Event(ENDING_PRIORITY_EVENT));
      channel?.postMessage({type:"ending-claim",tabId});
    };

    if(!paused)claimEndingPriority();
    if(channel){
      channel.onmessage=(event:MessageEvent<{type?:string;tabId?:string}>)=>{
        if(paused||event.data?.type!=="claim"||event.data.tabId===tabId)return;
        claimEndingPriority();
      };
    }

    return()=>channel?.close();
  },[paused]);

  const toggle=()=>{
    if(paused)window.dispatchEvent(new Event(ENDING_PRIORITY_EVENT));
    onToggle();
  };

  return <aside className={`ending-music-control ${paused?"is-paused":"is-playing"}`} aria-label="结局背景音乐">
    <span aria-hidden="true">{paused?"▶":"Ⅱ"}</span>
    <button
      type="button"
      data-testid="ending-music-toggle"
      aria-pressed={!paused}
      aria-label={paused?"播放结局音乐":"暂停结局音乐"}
      onClick={toggle}
    >
      {paused?"播放音乐":"暂停音乐"}
    </button>
  </aside>;
}
