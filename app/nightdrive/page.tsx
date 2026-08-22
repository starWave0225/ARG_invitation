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
    if(!normalized){
      setResult("idle");
      return;
    }
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

    <section className="nightdrive-contraband-ad" aria-label="剧情中的虚构违禁品广告">
      <small>SPONSORED · FICTIONAL IN-WORLD LISTING</small>
      <strong><b>NIGHT OIL</b><span>“加油”专用</span></strong>
      <p>SLEEP FAST · MEMORY OFF · PRIVATE DROP</p>
      <em>仅为剧情中的虚构犯罪广告，不对应任何真实产品</em>
    </section>

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

        {result==="empty"&&<div className="nightdrive-empty"><small>SEARCH COMPLETE</small><h1>0 RESULTS</h1><p>没有与“{query}”匹配的公开索引。请根据转介记录或汇款单的 ID 进行检索。</p><button onClick={()=>{setQuery("");setResult("idle")}}>BACK TO INDEX</button></div>}

        {result==="gp"&&<section className="nightdrive-case">
          <header><div><small>1 HIDDEN RESULT · ARCHIVED 2022-11-02</small><h1>HM-2217 · GU PAN</h1><p>Uploader: <b>HD_047</b>　Category: NEW CAR / PRIVATE DROP</p></div><em>ARCHIVED</em></header>

          <div className="nightdrive-case-hero">
            <div className="nightdrive-video-stub"><img src="/moments/han-duo/party-1.webp" alt="被遮挡的偷拍视频索引画面"/><span>PUBLIC MIRROR · CENSORED</span><small>ORIGINAL MEDIA RETAINED · PLAYER PREVIEW DISABLED</small></div>
            <dl>
              <dt>对象编号</dt><dd>HM-2217</dd>
              <dt>本票编号</dt><dd>SD-8845127</dd>
              <dt>关联姓名</dt><dd>GU PAN</dd>
              <dt>关联档案</dt><dd>YF-GP-0214-A</dd>
              <dt>事件时间</dt><dd>2022-10-27 23:48—2022-10-28 04:11</dd>
              <dt>来源账号</dt><dd>HD-047 / VERIFIED UPLOADER</dd>
              <dt>补偿本票</dt><dd>2022-11-02 · USD 20,000 · VOID</dd>
            </dl>
          </div>

          <article className="nightdrive-case-narrative">
            <small>INTERNAL EVENT SUMMARY · STAFF ONLY</small>
            <h2>HM-2217：顾盼</h2>
            <p>2022年2月14日凌晨，顾盼强行将状态异常的郝倩带离聚会地点，并把她送往港湾康复中心。远帆通过康复转介和付款资料，确认了顾盼的姓名以及她与郝倩的关系。</p>
            <p>2022年9月19日，组织以照片、视频和病历胁迫郝倩获得了顾盼的住址，且她持有顾盼房间的备用钥匙。随后将这些信息并入远帆关联表，并把顾盼标记为 <b>HM-2217</b>。</p>
            <p>2022年10月27日晚，顾盼抵达了为她专门安排的留学生结业聚会。服务器保留了可公开播放的原始画面。</p>
            <p>10月28日03:57，胁迫郝倩同我们一起将顾盼送回其住处。</p>
            <p>10月30日，远帆账目向H.Q.关联账户支付了 <b>USD 12,000</b>，备注为“最终协作 / 保密”。</p>
            <p>11月2日，组织另行准备了一张金额为 <b>USD 20,000</b> 的补偿本票，由H.Q.转交顾盼。本票编号为 <b>SD-8845127</b>，备注 <b>HM-2217</b>，最终没有兑现，顾盼疑似离开北港。</p>
          </article>

          <div className="nightdrive-file-index">
            <h2>PRIVATE FILE INDEX</h2>
            <article><span>09/19</span><b>YF_GP_CONTACT_EXPORT.csv</b><em>胁迫H.Q.取得住址与备用钥匙</em><i>TEXT ONLY</i></article>
            <article><span>23:48</span><b>HM2217_CAM01.mp4</b><em>记录仪开启</em><i>SERVER COPY</i></article>
            <article><span>00:36</span><b>HM2217_CAM02.mp4</b><em>“加油完成”</em><i>SERVER COPY</i></article>
            <article><span>03:57</span><b>HM2217_GARAGE.mp4</b><em>胁迫H.Q.共同送回住处</em><i>SERVER COPY</i></article>
            <article><span>11/02</span><b>SD-8845127.pdf</b><em>USD 20,000 · 补偿本票 · 未兑现</em><i>VOID</i></article>
          </div>

          <article className="nightdrive-moderator-note"><small>PINNED MODERATOR NOTE</small><p>“新车”已送回原位。三份原始画面保留在站内公开镜像；真实姓名仍禁止出现在评论区。11月2日本票未兑现，目标疑似离开北港。</p></article>
        </section>}

        {result==="hq"&&<section className="nightdrive-case">
          <header><div><small>1 HIDDEN RESULT · ARCHIVED 2022-02-15</small><h1>YF-HQ-0214 · NORTH HARBOR</h1><p>Source: <b>HD_047</b>　Category: REFERRAL / PRIVATE DROP</p></div><em>ARCHIVED</em></header>

          <div className="nightdrive-case-hero">
            <div className="nightdrive-video-stub"><img src="/moments/han-duo/party-3.webp" alt="被遮挡的偷拍视频索引画面"/><span>ENCRYPTED MIRROR</span><small>CENSORED PREVIEW · ORIGINAL BACKUP LOCKED</small></div>
            <dl>
              <dt>对象编号</dt><dd>YF-HQ-0214</dd>
              <dt>关联姓名</dt><dd>H. QIAN</dd>
              <dt>关联救助人</dt><dd>GU PAN</dd>
              <dt>事件时间</dt><dd>2022-02-13 22:16—2022-02-14 03:20</dd>
              <dt>来源账号</dt><dd>HD-047 / YF REFERRAL LIAISON</dd>
              <dt>医疗关联</dt><dd>HQ-220214 / HARBORWELL</dd>
              <dt>最终结算</dt><dd>USD 12,000 · SETTLED</dd>
            </dl>
          </div>

          <article className="nightdrive-case-narrative">
            <small>INTERNAL EVENT SUMMARY · STAFF ONLY</small>
            <h2>YF-HQ-0214：郝倩</h2>
            <p>郝倩最初因留学生互助和活动介绍加入远帆。组织以“提神”和“放松”为名持续向她提供药物，并逐步令她产生依赖。</p>
            <p>2022年2月13日晚，郝倩再次出现意识异常。现场人员担心闹出人命，使用她的手机联系了紧急联系人顾盼。顾盼赶到后，不顾管理员阻拦，将她带离现场，并独自承担了后续治疗费用。</p>
            <p>郝倩结束治疗后，组织开始密切观察这名施救者。通过康复转介和付款资料，我们确认了顾盼的姓名与学校。她的照片被发进群里后，有成员为她开出了不低的价格。</p>
            <p>2022年9月19日，组织以照片、视频和病历相威胁，迫使郝倩重新参加活动，并再次向她提供药物。意识不清期间，她说出了顾盼的住址，也承认自己仍持有顾盼房间的备用钥匙。</p>
            <p>10月27日，郝倩将“毕业前聚会”的邀请转发给顾盼。我们替换了邀请中的地址，将集合地点改到夜航群使用的私人场所。</p>
            <p>顾盼抵达后，聚会正式变成夜航群的“欢聚时刻”。郝倩一直坐在摄像机后方，浑身发抖，却没有离开。这场成功的双女主演出点燃了在场每一名群友的热情。</p>
            <p>10月30日，H.Q.关联账户收到 <b>USD 12,000</b>。结算备注：最终协作 / 保密。</p>
            <p>另有一张金额为 <b>USD 20,000</b> 的银行本票，由组织经H.Q.转交顾盼，作为事件补偿。该本票最终未兑现。</p>
          </article>

          <div className="nightdrive-file-index">
            <h2>PRIVATE FILE INDEX</h2>
            <article><span>22:16</span><b>YFHQ0214_CAM01.txt</b><em>目标离开公开区域</em><i>TEXT ONLY</i></article>
            <article><span>23:52</span><b>YFHQ0214_CAM02.mp4</b><em>意识状态异常</em><i>MIRROR LOCKED</i></article>
            <article><span>02:41</span><b>YFHQ0214_PICKUP.log</b><em>顾盼将目标接走</em><i>TEXT ONLY</i></article>
            <article><span>03:20</span><b>YFHQ0214_REWRITE.txt</b><em>改写为普通康复转介</em><i>TEXT ONLY</i></article>
            <article><span>09/19</span><b>YFHQ0214_ACCESS.log</b><em>记录顾盼住址与备用钥匙信息</em><i>TEXT ONLY</i></article>
            <article><span>10/30</span><b>YFHQ0214_SETTLEMENT.log</b><em>最终协作 / 保密：USD 12,000</em><i>PAID</i></article>
            <article><span>00:36</span><b>HM2217_FACE_MATCH.txt</b><em>H.Q.出现在拍摄位置后方</em><i>92% MATCH</i></article>
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
