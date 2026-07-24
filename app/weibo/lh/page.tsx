"use client";

import {useState,type ReactNode} from "react";
import CelebrityFollows from "../CelebrityFollows";
import WeiboSortToggle,{type WeiboSortOrder} from "../WeiboSortToggle";

const mentionStyle={color:"#5f7fa6",fontWeight:600,textDecoration:"none"};
const posts:{date:string;text:ReactNode;place:string}[]=[
  {date:"2025-11-23 12:35",text:"老城区又在修路。长宁路那边新装了一排蓝色招牌，晚上亮得像白天。",place:"临川"},
  {date:"2022-12-10 18:44",text:<>毕业以后大家散得太快。沈望最近都不上线了，问了也只说工作忙。<br/>忙，忙点好啊</>,place:"临海"},
  {date:"2020-06-09 13:02",text:<>给望盼cp留言：你俩什么时候回来请吃饭？这顿饭我记账上了。<br/><a href="/weibo/zw" target="_blank" rel="noopener noreferrer" style={mentionStyle}>@向左望，向右看</a> <a href="/weibo/gupan" target="_blank" rel="noopener noreferrer" style={mentionStyle}>@向阳生长</a></>,place:"临川"},
];

export default function LiuHanWeibo(){
  const [sortOrder,setSortOrder]=useState<WeiboSortOrder>("asc");
  const visible=[...posts].sort((a,b)=>sortOrder==="asc"?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
  return <main className="wb-route lh-wb">
    <header className="wb-top"><b><i>微</i>微博</b><div className="wb-search">⌕ <input placeholder="搜他的微博"/></div><nav>首页　视频　发现　游戏</nav><span>刘涵　⚙</span></header>
    <section className="wb-cover lh-cover"><div className="wb-profile"><img src="/characters/liu-han.png" alt="刘涵"/><h1>涵哥不含糊</h1><p>@LH_linchuan　♂</p><small>本地生活、球赛和偶尔靠谱的消息。</small></div></section>
    <nav className="wb-profile-nav"><button className="active">他的主页</button><button>他的相册</button><button>赞</button><span>关注 319　粉丝 184　微博 1,027</span></nav>
    <div className="wb-layout">
      <aside><section><h3>个人资料</h3><p>所在地：临川</p><p>教育信息：临川理工大学</p><p>简介：不传谣，有事最好当面说</p></section></aside>
      <section className="wb-feed"><div className="wb-filter"><b>他的微博</b><WeiboSortToggle order={sortOrder} onChange={setSortOrder}/></div>{visible.map(post=><article key={post.date}><img src="/characters/liu-han.png" alt="刘涵"/><div><header><b>涵哥不含糊</b><small>{post.date}　来自 Android客户端　IP属地：{post.place}</small></header><p>{post.text}</p><footer><span>☆ 收藏</span><span>↗ 转发</span><span>□ 评论</span><span>♡ 赞</span></footer></div></article>)}</section>
      <aside className="wb-right"><section className="wb-people-card"><h3>可能认识的人</h3><a className="wb-person-link" href="/weibo/zw" target="_blank" rel="noopener noreferrer"><img src="/characters/shen-wang.png" alt="沈望"/><span><b>向左望，向右看</b><small>大学同学 · 查看主页 →</small></span></a><CelebrityFollows shift={3} compact/></section><section><h3>常用话题</h3><p>#临川本地生活#</p><p>#老小区改造#</p><p>#周末球赛#</p></section></aside>
    </div>
    <footer className="wb-footer">微博客服　意见反馈　开放平台　隐私保护　© 2009–2026</footer>
  </main>
}
