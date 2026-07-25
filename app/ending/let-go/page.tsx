"use client";

import {useEffect,useRef,useState} from "react";

const ENDING_TRACK="/audio/bgm/ending-one-sun-earth.ogg";

type EndingStatus="gate"|"reading";

export default function LetGoEndingPage(){
  const [unlocked,setUnlocked]=useState<boolean|null>(null);
  const [status,setStatus]=useState<EndingStatus>("gate");
  const [paused,setPaused]=useState(false);
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const baseVolumeRef=useRef(.45);

  useEffect(()=>{
    const frame=window.requestAnimationFrame(()=>setUnlocked(
      localStorage.getItem("jia-ending-one-unlocked")==="true"&&
      localStorage.getItem("jia-ending-one-source")==="hq-testimony-declined"
    ));
    return()=>window.cancelAnimationFrame(frame);
  },[]);

  useEffect(()=>()=>audioRef.current?.pause(),[]);

  const startReading=()=>{
    const audio=audioRef.current;
    if(!audio)return;
    const stored=Number(localStorage.getItem("arg-music-volume")??.45);
    const master=Number.isFinite(stored)?Math.min(1,Math.max(0,stored)):.45;
    const muted=localStorage.getItem("arg-music-muted")==="true";
    baseVolumeRef.current=muted?0:Math.min(.62,master);
    audio.currentTime=0;
    audio.volume=baseVolumeRef.current;
    setStatus("reading");
    setPaused(false);
    localStorage.setItem("jia-ending-one-complete","true");
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

  const returnToChoice=()=>{
    audioRef.current?.pause();
    localStorage.removeItem("jia-hq-testimony-decision");
    localStorage.setItem("jia-hq-testimony-step","7");
    window.location.assign("/computer/shen?app=wechat&chat=haoqian");
  };

  if(unlocked===null)return <main className="let-go-ending let-go-loading">正在关闭最后一段对话……</main>;
  if(!unlocked)return <main className="let-go-ending let-go-locked"><section><small>ENDING LOCKED</small><h1>还没有人决定放手。</h1><p>这条结局来自郝倩最终对质中的选择。</p><a href="/computer/shen?app=wechat&chat=haoqian">返回沈望的微信</a></section></main>;

  return <main className={`let-go-ending let-go-text-ending ${status==="reading"?"is-reading":""}`}>
    <audio ref={audioRef} src={ENDING_TRACK} preload="metadata"/>

    {status==="gate"&&<section className="let-go-gate">
      <small>第一结局 · 终于放手</small>
      <h1>那张合影里，<br/>他们还站得很近。</h1>
      <p>点击开始阅读，背景音乐将从头播放。</p>
      <button type="button" onClick={startReading}>开始阅读　↘</button>
      <button type="button" className="let-go-return" onClick={returnToChoice}>返回郝倩的对话，重新选择</button>
      <em>BGM · 卢广仲《太阳与地球》</em>
    </section>}

    {status==="reading"&&<>
      <div className="let-go-reading-background" aria-hidden="true">
        <div className="let-go-static-halo"/>
        <figure className="let-go-static-photo">
          <img src="/memories/art-show-2018.png" alt=""/>
          <figcaption>2018.10.21 · 左望，右盼</figcaption>
        </figure>
        <img className="let-go-static-person let-go-static-shen" src="/ending/let-go/shen-walking.png" alt=""/>
        <img className="let-go-static-person let-go-static-gupan" src="/ending/let-go/gupan-walking.png" alt=""/>
        <div className="let-go-static-vignette"/>
      </div>

      <header className="let-go-reading-top">
        <span>嫁</span>
        <em>ENDING 01 / FINALLY LETTING GO</em>
      </header>

      <article className="let-go-reading-article">
        <small>第一结局</small>
        <h1>终于放手</h1>
        <p className="let-go-reading-lead">2018年10月21日，照片把他们留在了同一天。</p>

        <p>那时的沈望和顾盼还站得很近。画展的灯落在两个人肩上，他们相信地图是圆的，相信十三个小时的时差只是暂时，相信只要一直往前走，总会在世界的某处重新会合。</p>

        <p>后来，顾盼去了更远的地方。</p>

        <p>许多年以后，沈望终于找到了那段失踪的时间。他看见编号、账目、被隐藏的记录，也终于知道，在自己抱怨工作、疲惫和距离的时候，顾盼曾怎样独自站在一个没有人愿意相信她的夜晚里。</p>

        <p>真相没有像他想象中那样带来答案。它只是把迟到的人重新带回原地，让他清楚地看见：当年的自己离她有多远。</p>

        <p>聊天窗口停在郝倩说害怕丈夫知道过去的那一刻。光标在输入框里闪烁。沈望还可以继续追问，可以要求她面对警察、法庭和那些不愿再想起的事情。</p>

        <p>他也可以停下来。</p>

        <p>这一次，输入框里没有出现新的文字。</p>

        <p>沈望没有原谅任何人。他也没有忘记顾盼经历过什么。所有证据依然留在硬盘里，按照日期排列，像一扇扇已经打开、却再也无法通往过去的门。</p>

        <p>他只是忽然明白，知道全部真相，并不意味着能够把一个人带回来。继续站在原地，也不会让那封没有寄到的信重新抵达。</p>

        <p>他关掉微信，重新看了一遍那张合照。照片里的顾盼仍然微微偏着头，靠在他身旁。那一天没有改变，也永远不会继续向后发生。</p>

        <p>窗外天快亮了。沈望把照片放回文件夹，没有删除，也没有带走。</p>

        <blockquote>他没有等到她回头。<br/>也终于不再站在原地。</blockquote>

        <footer>
          <small>ENDING 01 · FINALLY LETTING GO</small>
          <div>
            <button type="button" onClick={returnToChoice}>返回选择</button>
            <a href="/">返回主菜单</a>
          </div>
        </footer>
      </article>

      <aside className="let-go-reading-music" aria-label="结局背景音乐">
        <span>♪</span>
        <p><small>正在播放</small><b>太阳与地球</b></p>
        <button type="button" onClick={togglePause}>{paused?"继续播放":"暂停音乐"}</button>
      </aside>
    </>}
  </main>;
}
