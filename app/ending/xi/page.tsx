"use client";

import {useEffect,useRef,useState} from "react";

const ENDING_DURATION=92;
const ENDING_TRACK="/audio/bgm/ending-xi.mp3";

type EndingStatus="gate"|"playing"|"complete";
type EndingBeat={
  from:number;
  to:number;
  chapter:string;
  title?:string;
  text:string;
  quote?:string;
};

const endingBeats:EndingBeat[]=[
  {
    from:0,
    to:7,
    chapter:"第三结局",
    title:"喜",
    text:"红纸写下婚约以前，没有人问过她愿不愿意。"
  },
  {
    from:7,
    to:18,
    chapter:"壹 · 囍字未干",
    text:"回国以后，顾盼的父母收走了她的护照和手机，把门从外面锁上。他们说，这是一门能让全家重新体面的婚事。"
  },
  {
    from:18,
    to:29,
    chapter:"壹 · 囍字未干",
    text:"顾盼一次次拒绝，一次次被告知：经历过那些事，还有人肯娶，就应该知足。她的名字写在合同里，唯独她的意见不在。"
  },
  {
    from:29,
    to:39,
    chapter:"贰 · 人已不在",
    text:"长期的拘禁与逼迫最终夺走了她。可死亡没有终止那场婚姻，反而让另一份更加荒诞的委托得以开始。"
  },
  {
    from:39,
    to:50,
    chapter:"贰 · 阴契",
    text:"红线、纸人、牌位、花轿。恒慕把顾盼称作“标的”，把遗体称作“交付”，把六十万元写成一桩所谓的圆满方案。"
  },
  {
    from:50,
    to:61,
    chapter:"叁 · 赶到",
    text:"沈望和刘涵循着转运记录赶到永安礼仪园。喜乐已经响起，东区静安厅的门正在合上。",
    quote:"刘涵：警察已经在路上。"
  },
  {
    from:61,
    to:72,
    chapter:"叁 · 破门",
    text:"他们掀翻拦在门前的桌椅，和守在现场的人扭打在一起。沈望只说了一句话。",
    quote:"沈望：先把门打开。"
  },
  {
    from:72,
    to:83,
    chapter:"肆 · 收网",
    text:"警灯照进礼仪厅。合同、账本、硬盘和转运记录被逐一封存。父母、恒慕人员与参与交易的中间人被带离现场。"
  },
  {
    from:83,
    to:92,
    chapter:"终 · 天亮",
    text:"那一晚，他们终于没有再次迟到。被当作婚约、商品与档案编号的顾盼，重新以自己的名字进入了案卷。"
  }
];

const scenes=[
  {from:0,to:29,src:"/ending/xi/01-forced-marriage.png",alt:"顾盼被家人逼迫接受婚姻安排"},
  {from:27,to:51,src:"/ending/xi/02-ghost-marriage.png",alt:"家属和中间人筹备非法冥婚"},
  {from:49,to:73,src:"/ending/xi/03-intervention.png",alt:"沈望与刘涵闯入礼仪园阻止仪式"},
  {from:71,to:92,src:"/ending/xi/04-police-dawn.png",alt:"警方控制现场并封存证据"}
];

function sceneOpacity(time:number,from:number,to:number){
  const fade=2.2;
  const entering=Math.min(1,Math.max(0,(time-from)/fade));
  const leaving=Math.min(1,Math.max(0,(to-time)/fade));
  return Math.min(entering,leaving);
}

function formatTime(value:number){
  return `${String(Math.floor(value/60)).padStart(2,"0")}:${String(Math.floor(value%60)).padStart(2,"0")}`;
}

export default function XiEndingPage(){
  const [unlocked,setUnlocked]=useState<boolean|null>(null);
  const [status,setStatus]=useState<EndingStatus>("gate");
  const [time,setTime]=useState(0);
  const [paused,setPaused]=useState(false);
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const frameRef=useRef<number|null>(null);
  const startedAtRef=useRef(0);
  const elapsedBeforePauseRef=useRef(0);
  const baseVolumeRef=useRef(.44);

  useEffect(()=>{
    const frame=window.requestAnimationFrame(()=>{
      const preview=new URLSearchParams(window.location.search).get("preview")==="1";
      const localPreview=preview&&["localhost","127.0.0.1"].includes(window.location.hostname);
      setUnlocked(localPreview||(
        localStorage.getItem("jia-ending-xi-unlocked")==="true"&&
        localStorage.getItem("jia-ending-xi-source")==="hengmu-confrontation"
      ));
    });
    return()=>window.cancelAnimationFrame(frame);
  },[]);

  useEffect(()=>{
    if(status!=="playing"||paused)return;
    startedAtRef.current=performance.now()-elapsedBeforePauseRef.current*1000;
    const tick=(now:number)=>{
      const next=Math.min(ENDING_DURATION,(now-startedAtRef.current)/1000);
      elapsedBeforePauseRef.current=next;
      setTime(next);
      const audio=audioRef.current;
      if(audio)audio.volume=Math.min(1,baseVolumeRef.current);
      if(next>=ENDING_DURATION){
        localStorage.setItem("jia-ending-xi-complete","true");
        localStorage.setItem("jia-game-cleared","true");
        window.dispatchEvent(new Event("jia-progress"));
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

  const start=()=>{
    const audio=audioRef.current;
    if(!audio)return;
    const stored=Number(localStorage.getItem("arg-music-volume")??.45);
    const master=Number.isFinite(stored)?Math.min(1,Math.max(0,stored)):.45;
    const muted=localStorage.getItem("arg-music-muted")==="true";
    baseVolumeRef.current=muted?0:Math.min(.58,master);
    audio.currentTime=0;
    audio.volume=baseVolumeRef.current;
    elapsedBeforePauseRef.current=0;
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
    elapsedBeforePauseRef.current=ENDING_DURATION;
    setTime(ENDING_DURATION);
    setPaused(false);
    localStorage.setItem("jia-ending-xi-complete","true");
    localStorage.setItem("jia-game-cleared","true");
    window.dispatchEvent(new Event("jia-progress"));
    setStatus("complete");
  };

  const replay=()=>{
    audioRef.current?.pause();
    elapsedBeforePauseRef.current=0;
    setTime(0);
    setPaused(false);
    setStatus("gate");
  };

  const beat=endingBeats.find(item=>time>=item.from&&time<item.to)??endingBeats.at(-1)!;
  const progress=Math.min(100,time/ENDING_DURATION*100);

  if(unlocked===null)return <main className="xi-ending xi-ending-locked">正在确认永安礼仪园的位置……</main>;
  if(!unlocked)return <main className="xi-ending xi-ending-locked"><section><small>ENDING LOCKED</small><h1>喜乐还没有响起。</h1><p>取得警方调查档案后，回到刘涵微信，与恒慕特别委托组完成最终对质。</p><a href="/computer/liuhan?app=wechat&chat=hengmu-plan">返回刘涵微信</a></section></main>;

  return <main className={`xi-ending is-${status} ${paused?"is-paused":""}`}>
    <audio ref={audioRef} src={ENDING_TRACK} preload="auto"/>
    <div className="xi-ending-grain" aria-hidden="true"/>

    {status==="gate"&&<section className="xi-ending-gate">
      <small>03/04 · REGULAR ENDING</small>
      <h1>第三结局 · 嫁</h1>
      <p>一纸红喜，盖不住她自己的名字。</p>
      <button type="button" onClick={start}>进入永安礼仪园　→</button>
      <em>BGM · 葛东琪《囍》· 从头播放</em>
    </section>}

    {status==="playing"&&<section className="xi-ending-cinema" aria-live="polite">
      <div className="xi-ending-scenes" aria-hidden="true">
        {scenes.map((scene,index)=><figure
          key={scene.src}
          className={`xi-ending-scene scene-${index+1}`}
          style={{opacity:sceneOpacity(time,scene.from,scene.to)}}
        >
          <img src={scene.src} alt=""/>
        </figure>)}
        <div className="xi-ending-shade"/>
      </div>

      <header className="xi-ending-topline">
        <b>嫁</b>
        <span>ENDING 03 / DOUBLE HAPPINESS</span>
      </header>

      <article className="xi-ending-copy" key={`${beat.from}-${beat.text}`}>
        <small>{beat.chapter}</small>
        {beat.title&&<h1>{beat.title}</h1>}
        <p>{beat.text}</p>
        {beat.quote&&<blockquote>{beat.quote}</blockquote>}
      </article>

      <footer className="xi-ending-controls">
        <button type="button" onClick={togglePause}>{paused?"继续":"暂停"}</button>
        <div><i style={{width:`${progress}%`}}/></div>
        <time>{formatTime(time)} / {formatTime(ENDING_DURATION)}</time>
        <button type="button" onClick={finish}>跳过演出</button>
      </footer>
    </section>}

    {status==="complete"&&<section className="xi-ending-finale">
      <img src="/ending/xi/04-police-dawn.png" alt="黎明时警方封存非法冥婚现场证据"/>
      <div/>
      <article>
        <small>第三结局</small>
        <h1>嫁</h1>
        <p>不是所有红纸都代表祝福。</p>
        <blockquote>真正的喜事，是让一个人的名字，重新属于她自己。</blockquote>
        <nav>
          <button type="button" onClick={replay}>重播结局</button>
          <a href="/computer/liuhan">回到刘涵的电脑</a>
          <a href="/story-guide.html#endings">查看完整故事线</a>
        </nav>
        <em>BGM · 葛东琪《囍》</em>
      </article>
    </section>}
  </main>;
}
