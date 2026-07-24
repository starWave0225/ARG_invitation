"use client";

import {useEffect,useState} from "react";
import YuanfanNav from "../YuanfanNav";

export default function YuanfanContact(){
  const [hasAccess,setHasAccess]=useState(false);
  useEffect(()=>{
    const sync=()=>setHasAccess(localStorage.getItem("jia-yuanfan-site-access")==="true");
    sync();
    window.addEventListener("storage",sync);
    return()=>window.removeEventListener("storage",sync);
  },[]);
  return <main className="route-page yuanfan-route"><div className="aid-public">
    <YuanfanNav hasAccess={hasAccess}/>
    <header className="aid-subpage-hero"><small>CONTACT & SUPPORT</small><h1>联系我们</h1><p>活动合作、校园社群与新生联络由志愿者共同维护。</p></header>
    <section className="aid-team aid-contact-page"><div><small>GENERAL CONTACT</small><h3>需要帮助？</h3><p>一般咨询：hello@yuanfan.example<br/>安全与隐私：safeguarding@yuanfan.example</p><p className="aid-contact-mail">办公时间：周一至周五 10:00—17:00<br/>紧急情况请优先联系当地紧急服务。</p></div><article><img src="/characters/han-duo.png" alt="韩铎"/><span><small>STUDENT OUTREACH LIAISON</small><b>韩铎 · Han Duo</b><p>迎新活动、校园社群与合作场地联络</p></span><strong className="aid-wechat-id"><small>微信号</small>hd_047_abroad</strong></article></section>
    <footer>Registered Student Organization · Privacy · Safeguarding · Contact</footer>
  </div></main>;
}
