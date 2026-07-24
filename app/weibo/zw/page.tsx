"use client";

import {useState} from "react";
import CelebrityFollows from "../CelebrityFollows";
import WeiboImage from "../WeiboImage";
import WeiboSortToggle,{type WeiboSortOrder} from "../WeiboSortToggle";

const posts=[
  {date:"2023-06-11 00:42",text:"换了工作，也换了住处。新的开始，只是旧地图还舍不得扔。",note:"来自 Android客户端",photo:{src:"/weibo/shen-moving-map-2023.webp",label:"搬家纸箱里的旧地图"}},
  {date:"2022-11-18 03:27",text:"不是每一件事都一定要有答案。只是偶尔还是会想，都怪时间不念旧，",note:"来自 Android客户端"},
  {date:"2022-08-17 18:04",text:"今天下班路过学校。艺术展的旧海报还贴在走廊尽头，已经晒得看不清日期了。",note:"来自 Android客户端",photo:{src:"/weibo/shen-artshow-poster-2022.webp",label:"旧教学楼走廊尽头的艺术展海报"}},
  {date:"2021-12-31 23:59",text:"今年依然隔着时差跨年。她那里比我晚十三个小时，所以可以说两次新年快乐。",note:"来自 iPhone客户端"},
];

export default function ShenWangWeibo(){
  const [sortOrder,setSortOrder]=useState<WeiboSortOrder>("asc");
  const visible=[...posts].sort((a,b)=>sortOrder==="asc"?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
  return <main className="wb-route zw-wb">
    <header className="wb-top"><b><i>微</i>微博</b><div className="wb-search">⌕ <input placeholder="搜他的微博"/></div><nav>首页　视频　发现　游戏</nav><span>沈望　⚙</span></header>
    <section className="wb-cover zw-cover"><div className="wb-profile"><img src="/characters/shen-wang.png" alt="沈望"/><h1>向左望，向右看</h1><p>@ZW_still_waiting　♂</p><small>软件工程师。爱拍照，爱游戏，爱顾盼。</small></div></section>
    <nav className="wb-profile-nav"><button className="active">他的主页</button><button>他的相册</button><button>赞</button><span>关注 74　粉丝 61　微博 286</span></nav>
    <div className="wb-layout">
      <aside><section><h3>个人资料</h3><p>所在地：临海</p><p>教育信息：临川理工大学</p><p>职业信息：互联网 / 软件工程师</p><p>简介：向左看，也向前走</p></section></aside>
      <section className="wb-feed"><div className="wb-filter"><b>他的微博</b><WeiboSortToggle order={sortOrder} onChange={setSortOrder}/></div>{visible.map(post=><article key={post.date}><img src="/characters/shen-wang.png" alt="沈望"/><div><header><b>向左望，向右看</b><small>{post.date}　{post.note}</small></header><p>{post.text}</p>{post.photo&&<WeiboImage kind="photo" label={post.photo.label} src={post.photo.src}/>}<footer><span>☆ 收藏</span><span>↗ 转发</span><span>□ 评论</span><span>♡ 赞</span></footer></div></article>)}</section>
      <aside className="wb-right"><section className="wb-people-card"><h3>可能认识的人</h3><a className="wb-person-link" href="/weibo/gupan" target="_blank" rel="noopener noreferrer"><img src="/characters/gu-pan.png" alt="顾盼"/><span><b>向阳生长</b><small>共同关注 1 · 查看主页 →</small></span></a><a className="wb-person-link" href="/weibo/lh" target="_blank" rel="noopener noreferrer"><img src="/characters/liu-han.png" alt="刘涵"/><span><b>涵哥不含糊</b><small>大学同学 · 查看主页 →</small></span></a><CelebrityFollows shift={2} compact/></section></aside>
    </div>
    <footer className="wb-footer">微博客服　意见反馈　开放平台　隐私保护　© 2009–2026</footer>
  </main>
}
