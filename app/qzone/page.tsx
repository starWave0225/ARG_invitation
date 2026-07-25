"use client";

import {useState} from "react";

type QzoneView="daily"|"message";

export default function QzonePage(){
  const [entered,setEntered]=useState(false);
  const [view,setView]=useState<QzoneView>("daily");
  const [archiveDate,setArchiveDate]=useState("");
  const [unlockError,setUnlockError]=useState(false);
  const [previewImage,setPreviewImage]=useState<{src:string;alt:string}|null>(null);

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
        <header><img src="/characters/gu-pan.png" alt="顾盼"/><div><b>顾盼</b><small>2020年10月21日</small></div></header>
        <p>两个人第一次一起做晚饭。一个人负责看菜谱，一个人负责帮倒忙。最后居然还挺好吃。</p>
        <button className="qz-daily-photo" type="button" onClick={()=>setPreviewImage({src:"/qzone/cooking-together.png",alt:"第一次diy晚餐"})}>
          <img src="/qzone/cooking-together.png" alt="第一次diy晚餐"/>
        </button>
      </article>
      <article>
        <header><img src="/characters/shen-wang.png" alt="沈望"/><div><b>沈望</b><small>2021年4月4日</small></div></header>
        <p>路线是她画的路线，而我负责挑选野餐的食材。<br/>下一站还没决定，但地图上已经太阳密布了，天气真好！</p>
        <button className="qz-daily-photo" type="button" onClick={()=>setPreviewImage({src:"/qzone/lakeside-map-picnic.png",alt:"在湖边"})}>
          <img src="/qzone/lakeside-map-picnic.png" alt="在湖边"/>
        </button>
      </article>
      <article>
        <header><img src="/characters/gu-pan.png" alt="顾盼"/><div><b>顾盼</b><small>2021年8月17日</small></div></header>
        <p>散步到很晚。他买了两杯热饮，还是只空出一只手给我挽着。<br/>我俩天下第一最最好：）</p>
        <button className="qz-daily-photo" type="button" onClick={()=>setPreviewImage({src:"/qzone/campus-night-walk.png",alt:"散步才是正经事。"})}>
          <img src="/qzone/campus-night-walk.png" alt="散步才是正经事。"/>
        </button>
      </article>
      <article>
        <header><img src="/characters/shen-wang.png" alt="沈望"/><div><b>沈望</b><small>2021年12月31日</small></div></header>
        <p>屏幕有点小，幸好想念没有距离限制。<br/>还是不想只和你视频，你一个人真的辛苦了。</p>
        <button className="qz-daily-photo" type="button" onClick={()=>setPreviewImage({src:"/qzone/long-distance-video-call.png",alt:"爱能克服远距离"})}>
          <img src="/qzone/long-distance-video-call.png" alt="爱能克服远距离"/>
        </button>
      </article>
    </section>:<section className="qz-board qz-archive-board">
      <header><div><h2>留言板</h2><p>共 19 条留言</p></div></header>
      <article className="qz-urgent">
        <div className="qz-anon">?</div>
        <div>
          <b>匿名访客</b>
          <small>2025年11月29日 02:47 · · 来自手机网页</small>
          <p>沈望，救我。我被锁在……<br/>临川……17号<br/>……4栋 一单...402室</p>
          <span>该留言可能因网络异常未完整提交，异常 IP：183.214.76.119</span>
        </div>
      </article>
      <article>
        <div className="qz-anon old">L</div>
        <div><b>刘涵</b><small>2020年6月9日</small><p>你俩什么时候回来请吃饭？</p></div>
      </article>
    </section>}
    {previewImage&&<div className="qz-photo-lightbox" role="dialog" aria-modal="true" aria-label="照片预览" onClick={()=>setPreviewImage(null)}>
      <button type="button" aria-label="关闭照片预览" onClick={()=>setPreviewImage(null)}>×</button>
      <img src={previewImage.src} alt={previewImage.alt} onClick={event=>event.stopPropagation()}/>
      <p>{previewImage.alt}</p>
    </div>}
  </main>;
}
