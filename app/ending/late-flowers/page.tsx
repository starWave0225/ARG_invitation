"use client";

import {useEffect,useRef,useState} from "react";

const ENDING_DURATION=38;
const ENDING_TRACK="/audio/bgm/second-chance.mp3";

type EndingStatus="gate"|"film"|"finale";
type EndingBeat={from:number;to:number;chapter:string;speaker?:string;text:string;subtext?:string};

const endingBeats:EndingBeat[]=[
  {from:0,to:4.6,chapter:"起 · 返程",speaker:"刘涵",text:"我在到达层。你出来以后别走，我来接你。"},
  {from:4.6,to:8.3,chapter:"起 · 返程",speaker:"沈望",text:"她在哪？"},
  {from:8.3,to:11.3,chapter:"起 · 返程",speaker:"刘涵",text:"晴川公寓。路上再说。"},
  {from:11.3,to:16.5,chapter:"承 · 凌晨五点",text:"临川刚下过雨。刘涵把能查到的记录递给他：一通只持续三秒的报警电话，一场取消的婚宴，一间三天没有人应门的公寓。"},
  {from:16.5,to:19.7,chapter:"承 · 凌晨五点",speaker:"刘涵",text:"我一直以为她只是回来了。"},
  {from:19.7,to:22.8,chapter:"承 · 凌晨五点",speaker:"沈望",text:"我也一直以为，还有时间。"},
  {from:22.8,to:26.2,chapter:"转 · 晴川公寓",text:"门外没有婚礼的红纸，只有已经撕掉的封条。"},
  {from:26.2,to:28.3,chapter:"转 · 晴川公寓",speaker:"沈望",text:"她人呢？"},
  {from:28.3,to:31.5,chapter:"转 · 晴川公寓",speaker:"刘涵",text:"……顾盼已经去世了。"},
  {from:31.5,to:33.4,chapter:"转 · 晴川公寓",speaker:"沈望",text:"什么时候？"},
  {from:33.4,to:35.8,chapter:"合 · 迟到",speaker:"刘涵",text:"四天前。对不起，我也是刚刚确认。"},
  {from:35.8,to:38,chapter:"合 · 迟到",speaker:"沈望",text:"她一个人吗？",subtext:"刘涵没有回答。天已经亮了。"}
];

export default function LateFlowersEndingPage(){
  const [unlocked,setUnlocked]=useState<boolean|null>(null);
  const [status,setStatus]=useState<EndingStatus>("gate");
  const [elapsed,setElapsed]=useState(0);
  const [paused,setPaused]=useState(false);
  const elapsedRef=useRef(0);
  const audioRef=useRef<HTMLAudioElement|null>(null);

  useEffect(()=>{
    const frame=window.requestAnimationFrame(()=>{
      const localPreview=["localhost","127.0.0.1"].includes(window.location.hostname)&&new URLSearchParams(window.location.search).get("preview")==="1";
      setUnlocked(localPreview||(
        localStorage.getItem("jia-ending-two-unlocked")==="true"&&
        localStorage.getItem("jia-ending-two-source")==="hq-testimony-secured"
      ));
    });
    return()=>window.cancelAnimationFrame(frame);
  },[]);

  useEffect(()=>{
    if(status!=="film"||paused)return;
    const origin=performance.now()-elapsedRef.current*1000;
    let frame=0;
    const tick=(now:number)=>{
      const next=Math.min(ENDING_DURATION,(now-origin)/1000);
      elapsedRef.current=next;
      setElapsed(next);
      if(next>=ENDING_DURATION){
        localStorage.setItem("jia-ending-two-complete","true");
        localStorage.setItem("jia-second-route-unlocked","true");
        localStorage.setItem("jia-liuhan-route-unlocked","true");
        window.dispatchEvent(new Event("jia-progress"));
        setStatus("finale");
        return;
      }
      frame=window.requestAnimationFrame(tick);
    };
    frame=window.requestAnimationFrame(tick);
    return()=>window.cancelAnimationFrame(frame);
  },[status,paused]);

  useEffect(()=>()=>audioRef.current?.pause(),[]);

  const startFilm=()=>{
    const audio=audioRef.current;
    if(!audio)return;
    const stored=Number(localStorage.getItem("arg-music-volume")??.45);
    const master=Number.isFinite(stored)?Math.min(1,Math.max(0,stored)):.45;
    const muted=localStorage.getItem("arg-music-muted")==="true";
    audio.currentTime=0;
    audio.volume=muted?0:Math.min(.5,master);
    elapsedRef.current=0;
    setElapsed(0);
    setStatus("film");
    setPaused(false);
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

  const finishNow=()=>{
    elapsedRef.current=ENDING_DURATION;
    setElapsed(ENDING_DURATION);
    setPaused(false);
    localStorage.setItem("jia-ending-two-complete","true");
    localStorage.setItem("jia-second-route-unlocked","true");
    localStorage.setItem("jia-liuhan-route-unlocked","true");
    window.dispatchEvent(new Event("jia-progress"));
    setStatus("finale");
  };

  const continueAsLiuHan=()=>{
    localStorage.setItem("jia-ending-two-complete","true");
    localStorage.setItem("jia-second-route-unlocked","true");
    localStorage.setItem("jia-liuhan-route-unlocked","true");
    audioRef.current?.pause();
    window.location.assign("/computer/liuhan?app=wechat");
  };

  const replay=()=>{
    audioRef.current?.pause();
    elapsedRef.current=0;
    setElapsed(0);
    setPaused(false);
    setStatus("gate");
  };

  const beat=endingBeats.find(item=>elapsed>=item.from&&elapsed<item.to)||endingBeats.at(-1)!;
  const phase=elapsed<11.3?"airport":elapsed<22.8?"road":elapsed<33.4?"corridor":"flowers";
  const progress=Math.min(100,elapsed/ENDING_DURATION*100);

  if(unlocked===null)return <main className="late-flowers-ending late-flowers-loading">正在确认返程信息……</main>;
  if(!unlocked)return <main className="late-flowers-ending late-flowers-locked"><section><small>ENDING LOCKED</small><h1>这趟返程还没有开始。</h1><p>只有在郝倩同意出庭作证后，刘涵才会发来这条消息。</p><a href="/computer/shen?app=wechat&chat=haoqian">返回郝倩的对话</a></section></main>;

  return <main className={`late-flowers-ending is-${status} ${paused?"is-paused":""}`}>
    <audio ref={audioRef} src={ENDING_TRACK} preload="metadata"/>
    <div className="late-flowers-grain" aria-hidden="true"/>

    {status==="gate"&&<section className="late-flowers-gate">
      <small>第二结局 · 明日黄花</small>
      <h1>最迟的一次告别，<br/>从回临川开始。</h1>
      <p>约 38 秒自动演出 · 建议佩戴耳机</p>
      <button type="button" onClick={startFilm}>前往临川　→</button>
      <em>BGM · Signal to Noise — Scott Buckley</em>
    </section>}

    {status==="film"&&<section className={`late-flowers-film phase-${phase}`} aria-live="polite">
      <div className="late-flowers-airport" aria-hidden="true">
        <img src="/memories/airport-goodbye-2022.png" alt=""/>
        <span className="late-flowers-flight-line"/>
      </div>
      <div className="late-flowers-road" aria-hidden="true">
        <div className="late-flowers-windshield"/>
        <i/><i/><i/><i/><i/><i/>
      </div>
      <div className="late-flowers-corridor" aria-hidden="true">
        <span className="late-flowers-wall left"/>
        <span className="late-flowers-wall right"/>
        <span className="late-flowers-door"><b>602</b><i>封</i></span>
      </div>
      <div className="late-flowers-painting" aria-hidden="true">
        <img src="/paintings/xiangyangchu.png" alt=""/>
        <i/><i/><i/><i/><i/><i/>
      </div>
      <div className="late-flowers-vignette" aria-hidden="true"/>

      <header className="late-flowers-film-top">
        <span>嫁</span>
        <em>ENDING 02 / LATE FLOWERS</em>
      </header>

      <article className="late-flowers-subtitle" key={`${beat.from}-${beat.text}`}>
        <small>{beat.chapter}</small>
        {beat.speaker&&<b>{beat.speaker}</b>}
        <p>{beat.text}</p>
        {beat.subtext&&<em>{beat.subtext}</em>}
      </article>

      <footer className="late-flowers-controls">
        <button type="button" onClick={togglePause}>{paused?"继续":"暂停"}</button>
        <div><i style={{width:`${progress}%`}}/></div>
        <time>{Math.floor(elapsed).toString().padStart(2,"0")} / {ENDING_DURATION}</time>
        <button type="button" onClick={finishNow}>跳过演出</button>
      </footer>
    </section>}

    {status==="finale"&&<section className="late-flowers-finale">
      <div className="late-flowers-final-painting" aria-hidden="true"><img src="/paintings/xiangyangchu.png" alt=""/></div>
      <article>
        <small>第二结局</small>
        <h1>明日黄花</h1>
        <p>花仍会开，只是开在来不及的明天。</p>
        <blockquote>他们原本是来告别的。<br/>到最后，连该把花放在哪里都不知道。</blockquote>
        <div>
          <button type="button" onClick={continueAsLiuHan}>扮演刘涵，继续调查全部真相　→</button>
          <button type="button" className="secondary" onClick={replay}>重看演出</button>
          <a href="/computer/shen">回到沈望的电脑</a>
        </div>
        <em>BGM · “Signal to Noise” by Scott Buckley · CC BY 4.0</em>
      </article>
    </section>}
  </main>;
}
