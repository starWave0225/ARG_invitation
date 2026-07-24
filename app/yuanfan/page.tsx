"use client";

import {FormEvent,useEffect,useState} from "react";

export default function YuanfanSite(){
  const [hasAccess,setHasAccess]=useState(false);
  const [query,setQuery]=useState("");
  const [searchError,setSearchError]=useState(false);
  const [noticeOpen,setNoticeOpen]=useState(false);

  useEffect(()=>{
    const sync=()=>{
      setHasAccess(localStorage.getItem("jia-yuanfan-site-access")==="true");
    };
    sync();
    window.addEventListener("storage",sync);
    window.addEventListener("jia-progress",sync);
    return()=>{window.removeEventListener("storage",sync);window.removeEventListener("jia-progress",sync)};
  },[]);

  const search=(event:FormEvent)=>{
    event.preventDefault();
    if(!hasAccess)return;
    if(query.replace(/\s/g,"").toLowerCase()==="womandriver"){
      localStorage.setItem("jia-womandriver-site-found","true");
      window.dispatchEvent(new Event("jia-progress"));
      window.location.assign("/nightdrive");
    }else setSearchError(true);
  };
  const jumpTo=(id:string,requiresAccess=false)=>{
    if(requiresAccess&&!hasAccess)return;
    document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
  };

  return <main className="route-page yuanfan-route"><div className="aid-public">
    <nav><strong><i>远</i> 远帆社区互助会</strong><button type="button" disabled={!hasAccess} title={hasAccess?"查看成员公告":"需要学生网站权限"} onClick={()=>jumpTo("member-notices",true)}>成员公告</button><button type="button" disabled={!hasAccess} title={hasAccess?"查看活动日历":"需要学生网站权限"} onClick={()=>jumpTo("activity-calendar",true)}>活动日历</button><button type="button" onClick={()=>jumpTo("contact-us")}>联系我们</button><em className={hasAccess?"unlocked":""}>{hasAccess?"学生访问已开通":"访客模式"}</em></nav>
    <div className="aid-hero"><div><small>YUANFAN COMMUNITY SUPPORT</small><h2>异乡不必独行。</h2><p>由留学生发起的非营利互助网络，为新生提供接机、临时住宿、心理支持转介与同伴陪伴。</p><button>寻求帮助</button></div><div className="aid-photo"><span>远帆秋季迎新 · 2022</span></div></div>
    <div className="aid-stats"><span><b>1,280+</b>累计服务学生</span><span><b>46</b>认证志愿者</span><span><b>24/7</b>紧急同伴热线</span><span><b>12</b>合作校园组织</span></div>
    <section className="aid-programs"><p className="aid-eyebrow">PROGRAMS & REFERRALS</p><h3>我们能提供什么</h3><div><article><b>落地安顿</b><p>接机、短期住宿信息和生活手续指引。</p></article><article><b>健康转介</b><p>连接经过审核的医疗与心理健康资源。远帆不直接提供医疗服务。</p></article><article><b>同伴支持</b><p>保密倾听与危机后的陪伴，不替代专业医疗。</p></article></div></section>
    <section className="aid-home-updates"><header><small>COMMUNITY UPDATES</small><h3>社区近况</h3><p>来自远帆志愿者与合作校园的近期消息</p></header><div><article><time>2022.08.28</time><span>迎新准备</span><h4>秋季机场接送登记开放</h4><p>首次抵达 North Harbor 的新生可提交航班与校区信息，由认证志愿者统一协调接送。</p></article><article><time>2022.07.12</time><span>生活支持</span><h4>暑期临时住宿资源更新</h4><p>新增三处经过核验的短期住宿点，并整理了租房合同与押金避坑说明。</p></article><article><time>2022.05.30</time><span>健康资源</span><h4>心理健康转介名录完成复核</h4><p>合作机构的服务语言、预约周期与费用范围已经更新，转介前请先联系值班志愿者。</p></article></div></section>
    <section className="aid-arrival-guide"><div><small>NEW STUDENT CHECKLIST</small><h3>抵达北港后的第一周</h3><p>把陌生城市拆成几个可以完成的小步骤。</p></div><ol><li><b>抵达前</b><span>保存学校、住宿方与本地紧急服务的联系方式，确认保险与接机信息。</span></li><li><b>第一天</b><span>完成入住登记、电话卡激活和校园身份核验，不向陌生人提供护照原件。</span></li><li><b>第一周</b><span>熟悉夜间交通、医院门户和校园支持渠道，遇到问题及时留下书面记录。</span></li></ol></section>
    <section className="aid-faq"><header><small>FREQUENTLY ASKED QUESTIONS</small><h3>常见问题</h3></header><div><details><summary>远帆的服务收费吗？</summary><p>信息咨询、同伴陪伴与校园转介不收取费用。医疗、住宿和交通产生的第三方费用由服务提供方说明。</p></details><details><summary>紧急情况下应该先联系谁？</summary><p>如有人身危险，请优先联系当地紧急服务。远帆志愿者可以协助语言沟通和后续资源转介，但不能替代警方或医疗机构。</p></details><details><summary>提交的信息会被如何保存？</summary><p>公开网站不收集完整病历。活动所需的联系方式应仅由经授权的联络人处理，并在用途结束后按规范清理。</p></details></div></section>
    <section id="contact-us" className="aid-team aid-anchor-section"><div><small>CONTACT US</small><h3>联系我们</h3><p>活动合作、校园社群与新生联络由志愿者共同维护。</p><p className="aid-contact-mail">邮箱：hello@yuanfan.example<br/>安全与隐私：safeguarding@yuanfan.example</p></div><article><img src="/characters/han-duo.png" alt="韩铎"/><span><small>STUDENT OUTREACH LIAISON</small><b>韩铎 · Han Duo</b><p>迎新活动、校园社群与合作场地联络</p></span><strong className="aid-wechat-id"><small>微信号</small>hd_047_abroad</strong></article></section>

    <section className={`aid-site-tools ${hasAccess?"unlocked":"locked"}`}>
      <div><small>MEMBER SITE ACCESS</small><h3>{hasAccess?"学生网站权限已开通":"此区域仅对已核验学生开放"}</h3><p>{hasAccess?"公告归档与站内搜索已经恢复。":"请通过远帆联络人完成学生身份核验。"}</p></div>
      <form onSubmit={search}><label htmlFor="yuanfan-search">站内搜索</label><div><input id="yuanfan-search" value={query} disabled={!hasAccess} onChange={event=>{setQuery(event.target.value);setSearchError(false)}} placeholder={hasAccess?"搜索公告、项目或关键词":"需要学生网站权限"}/><button disabled={!hasAccess}>搜索</button></div>{searchError&&<p>没有找到与“{query}”匹配的公开内容。</p>}</form>
    </section>

    <section id="activity-calendar" className={`aid-calendar aid-anchor-section ${hasAccess?"unlocked":"locked"}`}><div><small>ACTIVITY CALENDAR</small><h3>活动日历</h3><p>{hasAccess?"学生与志愿者活动安排":"完成学生身份核验后查看活动安排。"}</p></div>{hasAccess?<div className="aid-calendar-list"><article><time>09 / 03</time><span><b>秋季迎新说明会</b><small>新生报到、生活手续与校园安全说明</small></span><em>已结束</em></article><article><time>09 / 17</time><span><b>社区夜间安全培训</b><small>仅限认证志愿者与校园联络人</small></span><em>已结束</em></article><article><time>10 / 27</time><span><b>学期结束交流会</b><small>留学生求职分享与同伴交流</small></span><em>已结束</em></article></div>:<div className="aid-calendar-locked"><span>🔒</span><b>需要学生网站权限</b><small>请联系远帆联络人完成核验</small></div>}</section>
    <section id="member-notices" className={`aid-notice-archive aid-anchor-section ${hasAccess?"unlocked":"locked"}`}><div><small>MEMBER NOTICE</small><h3>成员公告</h3><p>面向认证学生、志愿者与合作校园的历史工作规范。</p></div><article><span><small>2022-09-01</small><b>志愿者工作公告</b></span><div><h4>2022 秋季夜间互助临时群使用规范</h4><p>安全接送、临时成员及群内信息管理说明</p></div><button disabled={!hasAccess} onClick={()=>hasAccess&&setNoticeOpen(true)}>{hasAccess?"查看公告":"需要网站权限"}</button></article></section>
    <section className="aid-transparency"><b>隐私与档案说明</b><p>医疗机构仅向远帆返回转介完成状态。成员档案不应包含完整病历。若您认为资料被不当访问，请联系 safeguarding@yuanfan.example。</p></section>
    <footer>Registered Student Organization · Privacy · Safeguarding · Contact</footer>

    {noticeOpen&&<div className="aid-notice-modal" role="dialog" aria-modal="true" aria-label="2022秋季夜间互助临时群使用规范" onClick={()=>setNoticeOpen(false)}><article onClick={event=>event.stopPropagation()}><button className="aid-notice-close" aria-label="关闭公告" onClick={()=>setNoticeOpen(false)}>×</button><header><small>YF-NOTICE-2022-091 · 志愿者工作公告</small><h2>2022 秋季夜间互助临时群使用规范</h2><p>发布：远帆社区互助会志愿者协调组　2022-09-01</p></header><section><p><b>一、安全离场</b><br/>活动结束后，负责接送的志愿者须确认每位参与者均已安全离场。遇到落单或情绪不稳定的新生，请先陪同至公共区域，避免其陷入<span className="aid-notice-clue">孤</span>立无援的处境。</p><p><b>二、同行原则</b><br/>夜间返程必须两人同行。任何成员不得<span className="aid-notice-clue">独</span>自改变路线，也不得带参与者前往未登记地点。</p><p><b>三、群内用语</b><br/>群内只讨论接送安排，不以外貌、性别或感情状态招募成员，也不要使用“美女”“<span className="aid-notice-clue">帅</span><span className="aid-notice-clue">哥</span>”等标签。</p><p><b>四、成员核验</b><br/>临时成员须由当日负责人核验身份后加入。未经确认，不得转发群二维码、成员名单或接送地址。</p></section><footer>本公告自2022年9月1日起执行。违反规定者将被移出当季志愿者群。</footer></article></div>}
  </div></main>;
}
