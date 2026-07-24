"use client";

import {FormEvent,useState} from "react";

const previewTiles=[
  {src:"/moments/han-duo/party-3.webp",title:"NORTH HARBOR · AFTER PARTY",views:"18.4K"},
  {src:"/moments/han-duo/party-7.webp",title:"PRIVATE BOAT · MEMBERS CUT",views:"9.7K"},
  {src:"/moments/han-duo/party-1.webp",title:"MIDNIGHT BAR · NEW UPLOAD",views:"31.2K"},
  {src:"/moments/han-duo/party-8.webp",title:"CARD ROOM · FULL RECORD",views:"12.1K"},
  {src:"/moments/han-duo/party-4.webp",title:"NORTHBRIDGE · WEEKEND",views:"26.6K"},
  {src:"/moments/han-duo/party-9.webp",title:"LAST ROUND · ARCHIVED",views:"7.3K"}
];

export default function NightDrivePage(){
  const [query,setQuery]=useState("");
  const [result,setResult]=useState<"idle"|"gp"|"hq"|"empty">("idle");

  const recordOpenedEvidence=(subject:"gp"|"hq")=>{
    const key=subject==="gp"?"jia-nightdrive-gp-evidence-opened":"jia-nightdrive-hq-evidence-opened";
    localStorage.setItem(key,"true");
    const gpOpened=subject==="gp"||localStorage.getItem("jia-nightdrive-gp-evidence-opened")==="true"||localStorage.getItem("jia-nightdrive-evidence-saved")==="true";
    const hqOpened=subject==="hq"||localStorage.getItem("jia-nightdrive-hq-evidence-opened")==="true";
    if(gpOpened&&hqOpened)localStorage.setItem("jia-sealed-evidence-unlocked","true");
    window.dispatchEvent(new Event("jia-progress"));
  };
  const search=(event:FormEvent)=>{
    event.preventDefault();
    const normalized=query.toUpperCase().replace(/[\s_-]/g,"");
    const match=normalized==="YFHQ0214"?"hq":["SD8845127","HM2217"].includes(normalized)?"gp":null;
    setResult(match||"empty");
    if(match)recordOpenedEvidence(match);
  };

  return <main className="nightdrive-route">
    <header className="nightdrive-header">
      <a href="/nightdrive"><b>NIGHT</b><em>DRIVE</em><small>PRIVATE VIDEO INDEX</small></a>
      <form onSubmit={search}><input aria-label="搜索编号" value={query} onChange={event=>{setQuery(event.target.value);setResult("idle")}} placeholder="SEARCH ID / TAG"/><button>SEARCH</button></form>
      <span><i>18+</i> MEMBERS ONLY</span>
    </header>

    <div className="nightdrive-ticker"><b>4,817 MEMBERS ONLINE</b><span>NEW MIRROR ONLINE</span><span>NO REAL NAMES IN COMMENTS</span><span>UPLOADS ARE FINAL</span></div>

    <div className="nightdrive-layout">
      <aside>
        <nav><b>CATEGORIES</b><a>NEW UPLOADS</a><a>NORTH HARBOR</a><a>INTERNATIONAL</a><a>PRIVATE PARTY</a><a>MEMBER REQUESTS</a></nav>
        <div className="nightdrive-ad"><small>LIVE NOW</small><b>LOCAL MEMBERS<br/>NEAR YOU</b><button>ENTER ROOM</button></div>
        <div className="nightdrive-warning"><b>EVIDENCE WARNING</b><p>该页面以低俗网站伪装，包含性暴力犯罪的文字记录，但不展示原始影像。</p></div>
      </aside>

      <section className="nightdrive-main">
        {result==="idle"&&<>
          <header><div><small>TRENDING / RECENT</small><h1>MEMBER UPLOADS</h1></div><span>PAGE 1 OF 184</span></header>
          <div className="nightdrive-grid">{previewTiles.map((tile,index)=><article key={tile.title}><div><img src={tile.src} alt="模糊的夜间聚会缩略图"/><span>0{index+1}:2{index}</span><i>PREVIEW</i></div><b>{tile.title}</b><small>{tile.views} VIEWS · VERIFIED MEMBER</small></article>)}</div>
          <div className="nightdrive-search-callout"><b>LOOKING FOR A PRIVATE DROP?</b><p>Use the referral ID or bank draft number printed on the matching record.</p></div>
        </>}

        {result==="empty"&&<div className="nightdrive-empty"><small>SEARCH COMPLETE</small><h1>0 RESULTS</h1><p>没有与“{query}”匹配的公开索引。编号必须与转介记录或汇款单完全一致。</p><button onClick={()=>{setQuery("");setResult("idle")}}>BACK TO INDEX</button></div>}

        {result==="gp"&&<section className="nightdrive-case">
          <header><div><small>1 HIDDEN RESULT · ARCHIVED 2022-10-28</small><h1>SD-8845127 · HM-2217</h1><p>Uploader: <b>HD_047</b>　Category: NEW CAR / PRIVATE DROP</p></div><em>ARCHIVED</em></header>

          <div className="nightdrive-case-hero">
            <div className="nightdrive-video-stub"><img src="/moments/han-duo/party-1.webp" alt="被遮挡的偷拍视频索引画面"/><span>SOURCE REMOVED</span><small>ORIGINAL MEDIA UNAVAILABLE · METADATA PRESERVED</small></div>
            <dl>
              <dt>对象编号</dt><dd>HM-2217</dd>
              <dt>汇款单编号</dt><dd>SD-8845127</dd>
              <dt>关联姓名</dt><dd>GU PAN</dd>
              <dt>关联档案</dt><dd>YF-GP-0214-A</dd>
              <dt>事件时间</dt><dd>2022-10-27 23:48—2022-10-28 04:11</dd>
              <dt>来源账号</dt><dd>HD-047 / VERIFIED UPLOADER</dd>
              <dt>外部结算</dt><dd>USD 20,000 · VOID</dd>
            </dl>
          </div>

          <div className="nightdrive-file-index">
            <h2>PRIVATE FILE INDEX</h2>
            <article><span>23:48</span><b>HM2217_CAM01.mp4</b><em>记录仪开启</em><i>REMOVED</i></article>
            <article><span>00:36</span><b>HM2217_CAM02.mp4</b><em>“加油完成”</em><i>REMOVED</i></article>
            <article><span>03:57</span><b>HM2217_GARAGE.mp4</b><em>送回住处</em><i>REMOVED</i></article>
            <article><span>04:11</span><b>HM2217_CLOSE.txt</b><em>地址与钥匙已确认</em><i>TEXT ONLY</i></article>
          </div>

          <article className="nightdrive-moderator-note"><small>PINNED MODERATOR NOTE</small><p>“新车”已送回原位。住址来自远帆关联协助人导出表；三份源文件转入离线库，公开页仅保留编号和结算标签。不要在评论区写真实姓名。</p></article>
        </section>}

        {result==="hq"&&<section className="nightdrive-case">
          <header><div><small>1 HIDDEN RESULT · ARCHIVED 2022-02-15</small><h1>YF-HQ-0214 · NORTH HARBOR</h1><p>Source: <b>HD_047</b>　Category: REFERRAL / PRIVATE DROP</p></div><em>ARCHIVED</em></header>

          <div className="nightdrive-case-hero">
            <div className="nightdrive-video-stub"><img src="/moments/han-duo/party-3.webp" alt="被遮挡的偷拍视频索引画面"/><span>SOURCE REMOVED</span><small>ORIGINAL MEDIA UNAVAILABLE · METADATA PRESERVED</small></div>
            <dl>
              <dt>对象编号</dt><dd>YF-HQ-0214</dd>
              <dt>关联姓名</dt><dd>H. QIAN</dd>
              <dt>关联救助人</dt><dd>GU PAN</dd>
              <dt>事件时间</dt><dd>2022-02-13 22:16—2022-02-14 03:20</dd>
              <dt>来源账号</dt><dd>HD-047 / YF REFERRAL LIAISON</dd>
              <dt>医疗关联</dt><dd>HQ-220214 / HARBORWELL</dd>
            </dl>
          </div>

          <div className="nightdrive-file-index">
            <h2>PRIVATE FILE INDEX</h2>
            <article><span>22:16</span><b>YFHQ0214_CAM01.txt</b><em>目标离开公开区域</em><i>TEXT ONLY</i></article>
            <article><span>23:52</span><b>YFHQ0214_CAM02.mp4</b><em>意识状态异常</em><i>REMOVED</i></article>
            <article><span>02:41</span><b>YFHQ0214_PICKUP.log</b><em>顾盼将目标接走</em><i>TEXT ONLY</i></article>
            <article><span>03:20</span><b>YFHQ0214_REWRITE.txt</b><em>改写为普通康复转介</em><i>TEXT ONLY</i></article>
          </div>

          <article className="nightdrive-moderator-note"><small>PINNED MODERATOR NOTE</small><p>原始索引沿用远帆转介编号。顾盼在未通知管理员的情况下接走目标；随后公开描述被改写为普通康复项目，原始文件转入离线库。</p></article>
        </section>}
      </section>

      <aside className="nightdrive-right">
        <div className="nightdrive-ad hot"><small>TOP RATED</small><b>PRIVATE<br/>COLLECTION</b><span>UPDATED DAILY</span></div>
        <section><b>POPULAR TAGS</b><p>#nightdrive　#newcar　#northharbor　#student　#private</p></section>
        <section><b>MIRROR STATUS</b><p><i/> ONLINE<br/>Certificate: unverified<br/>Last sync: 03:42</p></section>
      </aside>
    </div>
    <footer>© NIGHTDRIVE PRIVATE INDEX · REPORT / DMCA / MIRROR STATUS · ALL VISITORS LOGGED</footer>
  </main>;
}
