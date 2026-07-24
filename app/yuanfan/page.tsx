"use client";

import {FormEvent,useEffect,useState} from "react";
import YuanfanNav from "./YuanfanNav";

export default function YuanfanSite(){
  const [hasAccess,setHasAccess]=useState(false);
  const [query,setQuery]=useState("");
  const [searchError,setSearchError]=useState(false);
  const [searchAttempts,setSearchAttempts]=useState(0);

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
    }else{
      setSearchError(true);
      setSearchAttempts(value=>value+1);
    }
  };

  return <main className="route-page yuanfan-route"><div className="aid-public">
    <YuanfanNav hasAccess={hasAccess}/>
    <div className="aid-hero"><div><small>YUANFAN COMMUNITY SUPPORT</small><h2>异乡不必独行。</h2><p>由留学生发起的非营利互助网络，为新生提供接机、临时住宿、心理支持转介与同伴陪伴。</p><button onClick={()=>window.open("/yuanfan/contact","_blank","noopener,noreferrer")}>寻求帮助</button></div><div className="aid-photo"><span>远帆秋季迎新 · 2025</span></div></div>
    <div className="aid-stats"><span><b>1,280+</b>累计服务学生</span><span><b>46</b>认证志愿者</span><span><b>24/7</b>紧急同伴热线</span><span><b>12</b>合作校园组织</span></div>
    <section className="aid-programs"><p className="aid-eyebrow">PROGRAMS & REFERRALS</p><h3>我们能提供什么</h3><div><article><b>落地安顿</b><p>接机、短期住宿信息和生活手续指引。</p></article><article><b>健康转介</b><p>连接经过审核的医疗与心理健康资源。远帆不直接提供医疗服务。</p></article><article><b>同伴支持</b><p>保密倾听与危机后的陪伴，不替代专业医疗。</p></article></div></section>
    <section className="aid-home-updates"><header><small>COMMUNITY UPDATES</small><h3>社区近况</h3><p>来自远帆志愿者与合作校园的近期消息</p></header><div><article><time>2025.11.28</time><span>冬季支持</span><h4>年末机场接送登记开放</h4><p>假期抵达 North Harbor 的学生可提交航班与校区信息，由认证志愿者统一协调接送。</p></article><article><time>2025.11.12</time><span>生活支持</span><h4>冬季临时住宿资源更新</h4><p>新增三处经过核验的短期住宿点，并更新了租房合同、押金与供暖费用说明。</p></article><article><time>2025.10.30</time><span>健康资源</span><h4>心理健康转介名录完成季度复核</h4><p>合作机构的服务语言、预约周期与费用范围已经更新，转介前请先联系值班志愿者。</p></article></div></section>
    <section className="aid-arrival-guide"><div><small>NEW STUDENT CHECKLIST</small><h3>抵达北港后的第一周</h3><p>把陌生城市拆成几个可以完成的小步骤。</p></div><ol><li><b>抵达前</b><span>保存学校、住宿方与本地紧急服务的联系方式，确认保险与接机信息。</span></li><li><b>第一天</b><span>完成入住登记、电话卡激活和校园身份核验，不向陌生人提供护照原件。</span></li><li><b>第一周</b><span>熟悉夜间交通、医院门户和校园支持渠道，遇到问题及时留下书面记录。</span></li></ol></section>
    <section className="aid-faq"><header><small>FREQUENTLY ASKED QUESTIONS</small><h3>常见问题</h3></header><div><details><summary>远帆的服务收费吗？</summary><p>信息咨询、同伴陪伴与校园转介不收取费用。医疗、住宿和交通产生的第三方费用由服务提供方说明。</p></details><details><summary>紧急情况下应该先联系谁？</summary><p>如有人身危险，请优先联系当地紧急服务。远帆志愿者可以协助语言沟通和后续资源转介，但不能替代警方或医疗机构。</p></details><details><summary>提交的信息会被如何保存？</summary><p>公开网站不收集完整病历。活动所需的联系方式应仅由经授权的联络人处理，并在用途结束后按规范清理。</p></details></div></section>
    <section className={`aid-site-tools ${hasAccess?"unlocked":"locked"}`}>
      <div><small>MEMBER SITE ACCESS</small><h3>{hasAccess?"学生网站权限已开通":"此区域仅对已核验学生开放"}</h3><p>{hasAccess?"成员公告、活动日历、新生指南与站内搜索已经启用。":"请通过远帆联络人完成学生身份核验。"}</p></div>
      <form onSubmit={search}><label htmlFor="yuanfan-search">站内搜索</label><div><input id="yuanfan-search" value={query} disabled={!hasAccess} onChange={event=>{setQuery(event.target.value);setSearchError(false)}} placeholder={hasAccess?"搜索公告、项目或关键词":"需要学生网站权限"}/><button disabled={!hasAccess}>搜索</button></div>{searchError&&<p>没有找到与“{query}”匹配的公开内容。</p>}{searchAttempts>=3&&<p className="aid-search-warning">你到底是谁？你想知道什么？</p>}</form>
    </section>
    <section className="aid-transparency"><b>隐私与档案说明</b><p>医疗机构仅向远帆返回转介完成状态。成员档案不应包含完整病历。若您认为资料被不当访问，请联系 safeguarding@yuanfan.example。</p></section>
    <footer>Registered Student Organization · Privacy · Safeguarding · Contact</footer>
  </div></main>;
}
