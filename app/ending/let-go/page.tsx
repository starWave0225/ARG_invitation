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

  useEffect(()=>{
    if(unlocked!==true)return;
    const audio=audioRef.current;
    if(!audio)return;
    const stored=Number(localStorage.getItem("arg-music-volume")??.45);
    const master=Number.isFinite(stored)?Math.min(1,Math.max(0,stored)):.45;
    const muted=localStorage.getItem("arg-music-muted")==="true";
    baseVolumeRef.current=muted?0:Math.min(.62,master);
    audio.currentTime=0;
    audio.volume=baseVolumeRef.current;
    void audio.play().then(()=>setPaused(false)).catch(()=>setPaused(true));
  },[unlocked]);

  const startReading=()=>{
    const audio=audioRef.current;
    if(!audio)return;
    setStatus("reading");
    localStorage.setItem("jia-ending-one-complete","true");
    if(audio.paused){
      audio.currentTime=0;
      audio.volume=baseVolumeRef.current;
      setPaused(false);
      void audio.play().catch(()=>setPaused(true));
    }
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
      <small>01/04</small>
      <h1>第一结局 · 终于放手</h1>
      <button type="button" onClick={startReading}>开始阅读　↘</button>
      <button type="button" className="let-go-return" onClick={returnToChoice}>返回对话，重新选择</button>
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
        <p className="let-go-reading-lead">2018年10月21日。<br/>那张合影里，<br/>他们还站得很近。</p>

        <p>画展的灯温柔地落在两个人肩上，他们的爱情，也从那一刻开始。和所有恋人一样，他们争吵过、迷惘过，也被阴晴不定的生活推着向前。只是，哪怕在艰难的时刻，他们也不曾放弃彼此。</p>

        <p>后来，顾盼去了更远的地方。他们相信地图是圆的，相信十三个小时的时差只是上天给予他们的考验，相信只要一直向前走，总会在世界的某个地方重新会合。</p>

        <p>可是，后来，一切都变了。<br/>许多年以后，沈望终于找到了那段消失的时间。他看见一条条被人处心积虑隐藏的记录，也终于知道，顾盼曾怎样独自站在一个又一个无人可以求救的漫长黑夜里。</p>

        <p>真相没有像他想象中那样带来答案，反而让他更加迷惘。<br/>他开始怀疑这样刨根问底的意义。是不是只是把最黑暗的往事重新撕开，让它见光，也让那些结痂的伤口再次流血？是不是会毁掉郝倩好不容易得来的平静，也惊扰顾盼即将奔赴的新生活？</p>

        <p>聊天窗口停在郝倩说害怕过去的那一刻。光标仍在输入框里闪烁。<br/>沈望想了很多、很多。他忽然觉得，既然顾盼已经决定结婚，也许她早已同过去和解，正在走向属于自己的新生活。</p>

        <p>在坚持之外，他也可以做另一种选择。</p>

        <p>......<br/>沉默背后，沈望尽量不让自己哭出声。<br/>他分不清这些眼泪，究竟是为顾盼当年的遭遇而流，还是为两个人没能并肩面对这一切而流。<br/>但至少，那当年无从下落的眼泪，到今天，在这物是人非的异乡，终于是落在了地面上。</p>

        <p>沈望不再对郝倩继续追问，却没有选择原谅。<br/>他决定用自己的方式，让那些伤害过顾盼的人付出代价。<br/>这也许称不上正义，只是一个迟到太久的旧情人，仍带着少年意气的拳头。</p>

        <p>所有证据依然留在硬盘里，按照日期排列，像一扇扇已经打开、却再也无法通往过去的门。</p>

        <p>再看一眼她的微博，就一眼吧。<br/>窗外天快亮了。</p>

        <blockquote>至少，那张照片，替他们记得</blockquote>

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
