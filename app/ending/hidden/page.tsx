"use client";

import {useEffect,useRef,useState} from "react";

const ENDING_DURATION=108;
const ENDING_TRACK="/audio/bgm/hao-jiu-bu-jian.mp3";

type EndingStatus="gate"|"playing"|"complete";

type EndingScene={
  id:string;
  from:number;
  to:number;
  image?:string;
  eyebrow:string;
  title:string;
  body:string;
};

const scenes:EndingScene[]=[
  {id:"prologue",from:0,to:10,eyebrow:"隐藏结局 · 镜花水月",title:"如果时间肯在那一晚，向相爱的人偏一点。",body:"这不是被改写的现实，只是一场无人能够夺走的梦。"},
  {id:"arrival",from:8,to:32,image:"/ending/hidden/north-harbor-reunion.png",eyebrow:"2022.11 · 北港",title:"这一次，他意外到访北港。",body:"像是受到了感召，又或者只是太想念。只是终于在最需要彼此的时候，站到了同一个地方。"},
  {id:"map",from:30,to:57,image:"/ending/hidden/unfinished-map.png",eyebrow:"2022—2025 · 未走完的地图",title:"空白开始被填满。",body:"海岸线上的太阳，一年比一年多了起来。欢笑、眼泪、还有那枚闪亮着光芒的戒指，都变成旅行的回忆，被留在地图上。"},
  {id:"ordinary",from:55,to:75,image:"/ending/hidden/unfinished-map.png",eyebrow:"那些没有写进日记的日子",title:"不是每一天都像电影。",body:"他们会错过车，会忘记纪念日，也会在深夜重新牵住对方的手。平凡本身，就是那场梦最奢侈的部分。"},
  {id:"wedding",from:73,to:98,image:"/ending/hidden/seaside-wedding.png",eyebrow:"2026 · 海岸线",title:"她成为了沈望的新娘。",body:"没有盛大的宴席，也没有谁替她决定往后的人生。清晨的海风里，他们交换了戒指，也交换继续同行的承诺。"},
  {id:"waking",from:96,to:108,image:"/ending/hidden/seaside-wedding.png",eyebrow:"梦醒之前",title:"“这一次，你等到我了吗？”",body:"“没有。这一次，我走到了你身边。”"},
];

function sceneOpacity(time:number,scene:EndingScene){
  if(time<scene.from||time>scene.to)return 0;
  const fade=Math.min(3,(scene.to-scene.from)/3);
  return Math.min(1,(time-scene.from)/fade,(scene.to-time)/fade);
}

function sceneProgress(time:number,scene:EndingScene){
  return Math.min(1,Math.max(0,(time-scene.from)/(scene.to-scene.from)));
}

function clock(seconds:number){
  const value=Math.max(0,Math.min(ENDING_DURATION,Math.floor(seconds)));
  return `${String(Math.floor(value/60)).padStart(2,"0")}:${String(value%60).padStart(2,"0")}`;
}

export default function HiddenEndingPage(){
  const [unlocked,setUnlocked]=useState<boolean|null>(null);
  const [status,setStatus]=useState<EndingStatus>("gate");
  const [time,setTime]=useState(0);
  const [paused,setPaused]=useState(false);
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const frameRef=useRef<number|null>(null);
  const baseVolumeRef=useRef(.42);

  useEffect(()=>{
    const frame=window.requestAnimationFrame(()=>setUnlocked(
      localStorage.getItem("jia-hidden-ending-unlocked")==="true"&&
      localStorage.getItem("jia-hidden-ending-source")==="gupan-final-letter"
    ));
    return()=>window.cancelAnimationFrame(frame);
  },[]);

  useEffect(()=>{
    if(status!=="playing"||paused)return;
    const tick=()=>{
      const audio=audioRef.current;
      if(!audio)return;
      const next=audio.currentTime;
      setTime(next);
      audio.volume=Math.min(1,baseVolumeRef.current);
      if(next>=ENDING_DURATION){
        setStatus("complete");
        setPaused(false);
        return;
      }
      frameRef.current=window.requestAnimationFrame(tick);
    };
    frameRef.current=window.requestAnimationFrame(tick);
    return()=>{
      if(frameRef.current!==null)window.cancelAnimationFrame(frameRef.current);
      frameRef.current=null;
    };
  },[paused,status]);

  useEffect(()=>()=>audioRef.current?.pause(),[]);
  useEffect(()=>{
    if(status!=="complete")return;
    const audio=audioRef.current;
    if(audio&&!audio.ended&&audio.paused)void audio.play().catch(()=>{});
  },[status]);

  const start=()=>{
    const audio=audioRef.current;
    if(!audio)return;
    const stored=Number(localStorage.getItem("arg-music-volume")??.45);
    const master=Number.isFinite(stored)?Math.min(1,Math.max(0,stored)):.45;
    const muted=localStorage.getItem("arg-music-muted")==="true";
    baseVolumeRef.current=muted?0:Math.min(.58,master*.9);
    audio.currentTime=0;
    audio.volume=baseVolumeRef.current;
    setTime(0);
    setPaused(false);
    setStatus("playing");
    void audio.play().catch(()=>setPaused(true));
  };

  const togglePause=()=>{
    const audio=audioRef.current;
    if(!audio)return;
    if(paused){
      setPaused(false);
      void audio.play().catch(()=>setPaused(true));
    }else{
      audio.pause();
      setPaused(true);
    }
  };

  const finish=()=>{
    const audio=audioRef.current;
    if(audio&&!audio.ended)void audio.play().catch(()=>{});
    setTime(ENDING_DURATION);
    setPaused(false);
    setStatus("complete");
  };

  if(unlocked===null)return <main className="hidden-ending-route hidden-ending-loading">正在打开那封没有寄出的信……</main>;
  if(!unlocked)return <main className="hidden-ending-route hidden-ending-locked"><section><small>ENDING LOCKED</small><h1>这里还没有可以抵达的梦。</h1><p>完成刘涵调查线后，返回顾盼旧电脑，在回收站中读完《希望_未寄出.txt》。</p><a href="/computer/gupan">返回顾盼的旧电脑</a></section></main>;

  return <main className={`hidden-ending-route hidden-ending-film ${paused?"is-paused":""}`}>
    <audio ref={audioRef} src={ENDING_TRACK} preload="auto"/>
    <div className="hidden-ending-film-grain"/>

    {status==="gate"&&<section className="hidden-ending-gate">
      <small>HIDDEN ENDING · 镜花水月</small>
      <h1>在梦里，他们拥有完整的一生</h1>
      <p>请打开声音。接下来的约两分钟，是一场没有发生过的未来。</p>
      <button type="button" onClick={start}><span>▶</span>播放隐藏结局</button>
      <em>配乐：《好久不见》· 陈奕迅</em>
    </section>}

    {status==="playing"&&<section className="hidden-ending-cinema" aria-live="polite">
      {scenes.map(scene=>{
        const opacity=sceneOpacity(time,scene);
        const progress=sceneProgress(time,scene);
        return <article
          className={`hidden-ending-scene hidden-ending-scene-${scene.id}`}
          key={scene.id}
          style={{opacity,pointerEvents:opacity>.5?"auto":"none"}}
          aria-hidden={opacity<.5}
        >
          {scene.image&&<img
            src={scene.image}
            alt=""
            style={{transform:`scale(${1.035+progress*.055}) translate3d(${scene.id==="ordinary"?-progress*.7:progress*.35}%,${scene.id==="waking"?progress*.6:0}%,0)`}}
          />}
          <div className="hidden-ending-scene-shade"/>
          <div className="hidden-ending-scene-copy">
            <small>{scene.eyebrow}</small>
            <h2>{scene.title}</h2>
            <p>{scene.body}</p>
            {scene.id==="arrival"&&<blockquote>“你怎么会在这里？”<br/>“别说话，抱紧我。”</blockquote>}
            {scene.id==="ordinary"&&<div className="hidden-ending-tickets"><span>错车纪念</span><span>又一个太阳</span><span>重新出发</span></div>}
          </div>
        </article>
      })}
      <div className="hidden-ending-snow" aria-hidden="true">{Array.from({length:18},(_,index)=><i key={index}/>)}</div>
      <header className="hidden-ending-film-top"><span>镜花水月</span><em>2018　→　2026</em></header>
      <footer className="hidden-ending-controls">
        <button type="button" onClick={togglePause}>{paused?"继续":"暂停"}</button>
        <div><i style={{width:`${time/ENDING_DURATION*100}%`}}/></div>
        <time>{clock(time)} / {clock(ENDING_DURATION)}</time>
        <button type="button" onClick={finish}>跳过</button>
      </footer>
    </section>}

    {status==="complete"&&<section className="hidden-ending-finale">
      <small>隐藏结局 · 镜花水月</small>
      <h1>死亡没有被改写。</h1>
      <p>但在无人能够夺走的梦里，<br/>他们曾有过完整的一生。</p>
      <blockquote>左望，右盼。<br/>而右边的人，终于回过了头。</blockquote>
      <div><button type="button" onClick={start}>重新播放</button><a href="/">醒来　→</a></div>
      <span className="hidden-ending-credit">《好久不见》· 陈奕迅</span>
    </section>}
  </main>;
}
