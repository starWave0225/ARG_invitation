"use client";

import {useEffect,useState} from "react";
import YuanfanNav from "../YuanfanNav";

export default function YuanfanNotices(){
  const [hasAccess,setHasAccess]=useState(false);
  useEffect(()=>{
    const sync=()=>setHasAccess(localStorage.getItem("jia-yuanfan-site-access")==="true");
    sync();
    window.addEventListener("storage",sync);
    window.addEventListener("jia-progress",sync);
    return()=>{window.removeEventListener("storage",sync);window.removeEventListener("jia-progress",sync)};
  },[]);
  return <main className="route-page yuanfan-route"><div className="aid-public">
    <YuanfanNav hasAccess={hasAccess}/>
    <header className="aid-subpage-hero"><small>MEMBER SERVICES · CURRENT NOTICE</small><h1>成员公告</h1><p>认证学生、志愿者与合作校园的现行工作规范。</p></header>
    {!hasAccess?<section className="aid-subpage-locked"><span>🔒</span><h2>需要学生网站权限</h2><p>请联系远帆联络人完成学生身份核验。</p></section>:<article className="aid-notice-document"><header><small>YF-NOTICE-2025-091 · 志愿者工作公告</small><h2>2025 秋季夜间互助临时群使用规范</h2><p>发布：远帆社区互助会志愿者协调组　2025-09-01</p></header><section><p><b>一、安全离场</b><br/>活动结束后，负责接送的志愿者须确认每位参与者均已安全离场。遇到落单或情绪不稳定的新生，请先陪同至公共区域，避免其陷入<span className="aid-notice-clue">孤</span>立无援的处境。</p><p><b>二、同行原则</b><br/>夜间返程必须两人同行。任何成员不得<span className="aid-notice-clue">独</span>自改变路线，也不得带参与者前往未登记地点。</p><p><b>三、群内用语</b><br/>群内只讨论接送安排，不以外貌、性别或感情状态招募成员，也不要使用“美女”“<span className="aid-notice-clue">帅</span><span className="aid-notice-clue">哥</span>”等标签。</p><p><b>四、成员核验</b><br/>临时成员须由当日负责人核验身份后加入。未经确认，不得转发群二维码、成员名单或接送地址。</p></section><footer>本公告自2025年9月1日起执行。违反规定者将被移出当季志愿者群。</footer></article>}
    <footer>Registered Student Organization · Privacy · Safeguarding · Contact</footer>
  </div></main>;
}
