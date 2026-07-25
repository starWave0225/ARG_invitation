"use client";

import {useState} from "react";

type QzoneView="daily"|"message";

export default function QzonePage(){
  const [entered,setEntered]=useState(false);
  const [view,setView]=useState<QzoneView>("daily");
  const [archiveDate,setArchiveDate]=useState("");
  const [unlockError,setUnlockError]=useState(false);

  const recordAnonymousIp=()=>{
    localStorage.setItem("jia-qzone-message-read","true");
    localStorage.setItem("jia-qzone-ip-found","true");
    window.dispatchEvent(new Event("jia-progress"));
  };

  const openView=(next:QzoneView)=>{
    setView(next);
    if(next==="message")recordAnonymousIp();
  };

  const enterArchive=()=>{
    if(archiveDate.replace(/\D/g,"")==="20221118"){
      localStorage.setItem("jia-qzone-secret-unlocked","true");
      setUnlockError(false);
      setEntered(true);
      setView("daily");
      window.dispatchEvent(new Event("jia-progress"));
      return;
    }
    setUnlockError(true);
  };

  if(!entered)return <main className="qz-route qz-archive-gate">
    <header className="qz-archive-brand"><b>Qzone</b><span>左望右盼 · 情侣空间</span><small>空间访问验证</small></header>
    <section>
      <i>封</i>
      <small>QQ SPACE · ARCHIVED</small>
      <h1>空间已封存</h1>
      <p>请输入封存的日期。</p>
      <label>
        <span>封存日期</span>
        <input
          value={archiveDate}
          onChange={event=>{setArchiveDate(event.target.value);setUnlockError(false)}}
          onKeyDown={event=>event.key==="Enter"&&enterArchive()}
          placeholder="YYYY/MM/DD"
          inputMode="numeric"
          autoFocus
        />
      </label>
      <button type="button" onClick={enterArchive}>进入空间</button>
      {unlockError&&<p className="qz-unlock-error">日期不正确。</p>}
    </section>
    <footer>QQ空间 · 分享生活，留住感动　|　空间内容已封存</footer>
  </main>;

  return <main className="qz-route qz-archive">
    <header>
      <div><small>ARCHIVED COUPLE SPACE</small><h1>左望右盼</h1></div>
      <span>封存于 2022.11.18</span>
    </header>
    <nav aria-label="情侣空间栏目">
      <button type="button" className={view==="daily"?"active":""} onClick={()=>openView("daily")}>日常</button>
      <button type="button" className={view==="message"?"active":""} onClick={()=>openView("message")}>留言板</button>
    </nav>

    {view==="daily"?<section className="qz-archive-daily">
      <article>
        <header><img src="/characters/gu-pan.png" alt="顾盼"/><div><b>顾盼</b><small>2021年8月17日</small></div></header>
        <p>下一站还没决定，但地图已经画好了。等我们都忙完，就从海边开始。</p>
        <div className="qz-memory">照片已无法从服务器载入<br/><small>IMG_20210817_旅行地图.jpg</small></div>
      </article>
      <article>
        <header><img src="/characters/shen-wang.png" alt="沈望"/><div><b>沈望</b><small>2020年10月21日</small></div></header>
        <p>左边的人继续等，右边的人记得回头。</p>
      </article>
    </section>:<section className="qz-board qz-archive-board">
      <header><div><h2>留言板</h2><p>共 19 条留言</p></div></header>
      <article className="qz-urgent">
        <div className="qz-anon">?</div>
        <div>
          <b>匿名访客</b>
          <small>2025年11月29日 02:47 · · 来自手机网页</small>
          <p>沈望，救我。我被锁在……<br/>临川……17号<br/>……4栋……02室</p>
          <span>该留言可能因网络异常未完整提交，异常 IP：183.214.76.119</span>
        </div>
      </article>
      <article>
        <div className="qz-anon old">L</div>
        <div><b>刘涵</b><small>2020年6月9日</small><p>你俩什么时候回来请吃饭？</p></div>
      </article>
    </section>}
  </main>;
}
