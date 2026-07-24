"use client";

import {useState} from "react";
import CelebrityFollows from "../CelebrityFollows";
import WeiboSortToggle,{type WeiboSortOrder} from "../WeiboSortToggle";

const posts=[
  {date:"2025-11-30 22:16",text:"原来已经这么久过去了。蛮好的，祝福她。",note:"来自 Windows客户端"},
  {date:"2023-06-11 00:42",text:"换了工作，也换了住处。那张没走完的地图还在纸箱底下。搬了两次家，还是没舍得扔。",note:"来自 Android客户端"},
  {date:"2022-11-18 03:27",text:"不是每一件事都一定要有答案。只是偶尔还是会想，最后那封信里为什么有几个奇怪的字母。",note:"来自 Android客户端"},
  {date:"2022-08-17 18:04",text:"今天下班路过学校。艺术展的旧海报还贴在走廊尽头，已经晒得看不清日期了。",note:"来自 Android客户端"},
  {date:"2021-12-31 23:59",text:"今年依然隔着时差跨年。她那里比我晚十三个小时，所以可以说两次新年快乐。",note:"来自 iPhone客户端"},
];

export default function ShenWangWeibo(){
  const [sortOrder,setSortOrder]=useState<WeiboSortOrder>("asc");
  const visible=[...posts].sort((a,b)=>sortOrder==="asc"?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
  return <main className="wb-route zw-wb">
    <header className="wb-top"><b><i>微</i>微博</b><div className="wb-search">⌕ <input placeholder="搜他的微博"/></div><nav>首页　视频　发现　游戏</nav><span>沈望　⚙</span></header>
    <section className="wb-cover zw-cover"><div className="wb-profile"><img src="/characters/shen-wang.png" alt="沈望"/><h1>向左望，向右看</h1><p>@ZW_still_waiting　♂</p><small>软件工程师。偶尔拍照，常常忘记整理。</small></div></section>
    <nav className="wb-profile-nav"><button className="active">他的主页</button><button>他的相册</button><button>赞</button><span>关注 74　粉丝 61　微博 286</span></nav>
    <div className="wb-layout">
      <aside><section><h3>个人资料</h3><p>所在地：临海</p><p>教育信息：临川理工大学</p><p>职业信息：互联网 / 软件工程师</p><p>简介：向左看，也向前走</p></section></aside>
      <section className="wb-feed"><div className="wb-filter"><b>他的微博</b><WeiboSortToggle order={sortOrder} onChange={setSortOrder}/></div>{visible.map(post=><article key={post.date}><img src="/characters/shen-wang.png" alt="沈望"/><div><header><b>向左望，向右看</b><small>{post.date}　{post.note}</small></header><p>{post.text}</p>{post.date==="2022-08-17 18:04"&&<div className="wb-attachment">旧照片 · IMG_20181021_ARTSHOW.jpg<small>图片因原图失效暂不可查看</small></div>}<footer><span>☆ 收藏</span><span>↗ 转发</span><span>□ 评论</span><span>♡ 赞</span></footer></div></article>)}</section>
      <aside className="wb-right"><section className="wb-people-card"><h3>可能认识的人</h3><a className="wb-person-link" href="/weibo/gupan" target="_blank" rel="noopener noreferrer"><img src="/characters/gu-pan.png" alt="顾盼"/><span><b>向阳生长</b><small>共同关注 1 · 查看主页 →</small></span></a><a className="wb-person-link" href="/weibo/lh" target="_blank" rel="noopener noreferrer"><img src="/characters/liu-han.png" alt="刘涵"/><span><b>涵哥不含糊</b><small>大学同学 · 查看主页 →</small></span></a><CelebrityFollows shift={2} compact/></section><section><h3>账号近况</h3><p>该账号在2022年后很少更新，也从未公开提及分手对象的姓名。</p></section></aside>
    </div>
    <footer className="wb-footer">微博客服　意见反馈　开放平台　隐私保护　© 2009–2026</footer>
  </main>
}
