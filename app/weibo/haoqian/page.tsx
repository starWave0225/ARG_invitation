"use client";

import {useState,type ReactNode} from "react";
import CelebrityFollows from "../CelebrityFollows";
import WeiboImage from "../WeiboImage";
import WeiboSortToggle,{type WeiboSortOrder} from "../WeiboSortToggle";

type HqPostData={date:string;text:ReactNode;image?:boolean;contact?:boolean};
const posts:HqPostData[]=[
  {date:"2025-10-18 13:26",text:"终于把婚礼照片整理完。谢谢所有从不同城市赶来的朋友。",image:true},
  {date:"2022-12-02 04:37",text:"换了号码。以前认识的人如果还有必要联系，可以加新的微信。备注学校和姓名。",contact:true},
  {date:"2022-10-24 01:52",text:"我好痛苦。为什么要我做这个恶人？"},
  {date:"2022-02-22 15:22",text:<>终于，雨过天晴，今天是我获得新生的日子！<br/>多谢好闺闺<a href="/weibo/gupan" target="_blank" rel="noopener noreferrer" style={{color:"#eb7350",fontWeight:600,textDecoration:"none"}}>@向阳而生</a><br/>以后赚了钱一定分你一半，哦不，你全拿去！</>},
];

export default function HaoQianWeibo(){
  const [sortOrder,setSortOrder]=useState<WeiboSortOrder>("asc");
  const visible=[...posts].sort((a,b)=>sortOrder==="asc"?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
  return <main className="wb-route hq-wb">
    <header className="wb-top"><b><i>微</i>微博</b><div className="wb-search">⌕ <input placeholder="搜微博"/></div><nav>首页　视频　发现　游戏</nav><span>沈望　⚙</span></header>
    <section className="wb-cover hq-cover"><div className="wb-profile"><img src="/characters/hao-qian.png" alt="郝倩"/><h1>H_Qian17</h1><p>@HQ_abroad　♀</p><small>向前看。</small></div></section>
    <nav className="wb-profile-nav"><button className="active">她的主页</button><button>她的相册</button><button>赞</button><span>关注 206　粉丝 127　微博 384</span></nav>
    <div className="wb-layout hq-layout">
      <aside><section><h3>个人资料</h3><p>真实姓名：郝倩</p><p>所在地：海外</p><p>教育信息：Northbridge University</p><p>感情状况：已婚</p></section></aside>
      <section className="wb-feed">
        <div className="wb-filter"><b>她的微博</b><WeiboSortToggle order={sortOrder} onChange={setSortOrder}/></div>
        {visible.map(post=><HqPost key={post.date} {...post}/>)}
      </section>
      <aside className="wb-right"><section className="wb-people-card"><h3>可能认识的人</h3><div><img src="/characters/gu-pan.png" alt="顾盼"/><span><b>向阳生长</b><small>共同关注 2</small></span></div><CelebrityFollows shift={1} compact/></section></aside>
    </div>
    <footer className="wb-footer">微博客服　意见反馈　开放平台　隐私保护　© 2009–2026</footer>
  </main>
}

function HqPost({date,text,image,contact}:HqPostData){
  return <article><img src="/characters/hao-qian.png" alt="郝倩"/><div><header><b>H_Qian17</b><small>{date}　来自 iPhone客户端　IP属地：海外</small></header><p>{text}</p>{image&&<WeiboImage kind="wedding" label="婚礼照片预览" src="/weibo/hao-qian-wedding-2025.png"/>}{contact&&<div className="wb-attachment">微信号更新：<b>hqian_17</b></div>}<footer><span>☆ 收藏</span><span>↗ 转发</span><span>□ 评论</span><span>♡ 赞</span></footer></div></article>
}
