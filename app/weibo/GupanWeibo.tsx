"use client";

import {useMemo,useState} from "react";
import CelebrityFollows from "./CelebrityFollows";

type Post={id:number;date:string;year:string;place:string;text:React.ReactNode;plain:string;tag?:string;image?:string;file?:string;private?:boolean};
const posts:Post[]=[
  {id:1,date:"2021-09-03 08:16",year:"2021",place:"海外",plain:"开学第一周。",text:<>开学第一周。课很难，时差也很难，但有人每天在地球另一端陪我吃早餐。<br/>好在地图是圆的，总会有走到一起的地方。</>,tag:"留学生活",image:"map"},
  {id:2,date:"2021-12-19 23:41",year:"2021",place:"海外",plain:"在异国遇见一个聊得来的朋友。",text:<>在异国遇见一个聊得来的朋友，是一种幸福。她最近状态不太好，希望我没有多管闲事。</>,tag:"H.Q.",image:"snow"},
  {id:3,date:"2022-02-15 01:07",year:"2022",place:"海外",plain:"我没想过会遇上这样的事。",text:<>我没想过会遇上这样的事，希望她一切平安。</>,tag:"Harborwell"},
  {id:4,date:"2022-10-26 19:22",year:"2022",place:"海外",plain:"明晚是学期结束聚会的日子。",text:<>明晚是学期结束聚会的日子。她说最近认识了一些新朋友，大家可以一起喝点东西、听音乐、也分享下毕业求职的经验。<br/>她看起来终于好一些了，戒断反应很严重的那一阵子，真的很担心她，希望以后一切都好。<br/>好想念望望啊。</>,tag:"留学日常"},
  {id:5,date:"2022-10-29 04:18",year:"2022",place:"海外",plain:"我记不得昨晚。",text:<>我记不得昨晚。灯很暗，好像一直有人笑。我记得郝倩在镜头后面，又不确定那是不是梦。<br/>这段不能发。我甚至不知道该怎么描述。</>,tag:"未发送草稿",private:true},
  {id:6,date:"2022-10-29 09:46",year:"2022",place:"海外",plain:"她说自己提前走了。",text:<>她说自己提前走了，说是酒吧的人把我送回来的。可他们为什么知道准确地址？为什么门没有被撬，钥匙还在原来的位置？<br/>除了她，没有别人有我的钥匙。</>,tag:"未发送草稿",private:true},
  {id:7,date:"2022-10-30 02:12",year:"2022",place:"海外",plain:"我是不是看见了闪光。",text:<>我一直想起一次闪光，像相机，又像酒吧的灯。有人把手机举得很低。<br/>如果真的有录像，我该去哪里找？如果没有，我是不是在冤枉人？</>,tag:"未发送草稿",private:true},
  {id:8,date:"2022-11-01 21:08",year:"2022",place:"海外",plain:"医院说取证需要自费。",text:<>医院说取证和后续检查需要自费。我向家里开口，他们问我为什么去酒吧，妈妈说是我的生活作风有问题。<br/>我只是想知道到底发生了什么。</>,tag:"未发送草稿",private:true},
  {id:9,date:"2022-11-03 00:37",year:"2022",place:"海外",plain:"我给他打了电话。",text:<>我给他打了电话，只说了酒吧和昏过去的事。他正在熬试用期，也问我为什么要去那种地方，为什么不能等他一起。<br/>我知道他是在担心我。可那一刻我只觉得自己哪里都回不去了。</>,tag:"未发送草稿",private:true},
  {id:10,date:"2022-11-09 16:32",year:"2022",place:"海外",plain:"报告上的词我一个都不想查。",text:<>报告上的词我一个都不想查。异常、复检、病毒标记。<br/>我保存了编号和检验码，可我没有一个能陪我去的人。</>,tag:"未发送草稿",file:"lab_7304.png",private:true},
  {id:11,date:"2022-11-12 03:05",year:"2022",place:"海外",plain:"我把能想到的都写下来了。",text:<>酒吧、那群人的名字、郝倩说过的话、陌生汇款、模糊的闪光。我把能想到的都写下来了。<br/>证据太散了。一个人好像什么也证明不了。</>,tag:"未发送草稿",private:true},
  {id:12,date:"2022-11-17 03:42",year:"2022",place:"海外",plain:"不知道还能向谁求救。",text:<>我不知道还能向谁求救。告诉他，就会让他也被拖进来；不告诉他，我连最后一个相信我的人也没有。<br/>先停下来吧。等我能面对这一切，再想以后。</>,tag:"未发送草稿",private:true},
];

export default function GupanWeibo({embedded=false,viewer="沈望"}:{embedded?:boolean;viewer?:string}){
  const [year,setYear]=useState("全部");
  const [query,setQuery]=useState("");
  const [privateOpen,setPrivateOpen]=useState(false);
  const [code,setCode]=useState("");
  const [selected,setSelected]=useState<number|null>(null);
  const visible=useMemo(()=>posts
    .filter(p=>(privateOpen||!p.private)&&(year==="全部"||p.year===year)&&(!query||p.plain.includes(query)||p.tag?.toLowerCase().includes(query.toLowerCase())))
    .sort((a,b)=>{
      if(Boolean(a.private)!==Boolean(b.private))return a.private?1:-1;
      return b.date.localeCompare(a.date);
    }),[year,query,privateOpen]);
  const showDraftLock=!privateOpen&&(year==="全部"||year==="2022")&&!query;
  const draftPassword="zuowangyoupan";
  const unlockDrafts=()=>{if(code.trim().toLowerCase()===draftPassword)setPrivateOpen(true)};
  return <main className={`wb-route gp-wb-dark ${embedded?"pc-weibo-app":""}`}>
    <header className="wb-top"><b><i>微</i>微博</b><div className="wb-search">⌕ <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={embedded?"搜索我的微博":"搜她的微博"}/></div><nav>首页　视频　发现　游戏</nav><span>{viewer}　⚙</span></header>
    <section className="wb-cover"><div className="wb-profile"><img src="/characters/gu-pan.png" alt="顾盼"/><h1>向阳生长</h1><p>@GP_looking_right　♀</p><small>走走停停看看。</small></div></section>
    <nav className="wb-profile-nav"><button className="active">她的主页</button><button>她的相册</button><button>赞</button><span>关注 17　粉丝 3　微博 {posts.filter(p=>!p.private).length}</span></nav>
    <div className="wb-layout">
      <aside><section><h3>个人资料</h3><p>所在地：海外</p><p>教育信息：Northbridge University</p><p>简介：画画、植物、旅行</p></section><section><h3>微博归档</h3>{["全部","2022","2021"].map(x=><button key={x} className={year===x?"active":""} onClick={()=>setYear(x)}>{x}年</button>)}</section><section className="wb-clue"><h3>账号状态</h3><p>最后公开更新：2022-10-26</p><p>此后没有发布新微博</p>{privateOpen&&<p>已在本地时间线中显示未发送草稿</p>}</section></aside>
      <section className="wb-feed"><div className="wb-filter"><b>她的微博</b><span>{visible.length} 条公开记录{privateOpen?` · ${posts.filter(p=>p.private).length} 条本地草稿`:""}</span></div>{visible.map(post=><article key={post.id} className={post.private?"private":""} onClick={()=>setSelected(post.id)}><img src="/characters/gu-pan.png" alt="顾盼"/><div><header><b>向阳生长</b>{post.private&&<em>未发送草稿</em>}<small>{post.date}　来自 Android客户端　IP属地：{post.place}</small></header><p>{post.text}</p>{post.image&&<div className={`wb-photo ${post.image}`}><span>{post.image==="map"?"一张画满线路的世界地图":post.image==="snow"?"冬夜里的车站":post.image==="plant"?"窗边植物与未完成的画":""}</span></div>}{post.file&&<div className="wb-attachment">▧　{post.file}<small>本地图片 · 点击查看原始信息</small></div>}<footer><span>☆ 收藏</span><span>↗ 转发 0</span><span>□ 评论 0</span><span>♡ 赞 {post.id%3}</span></footer></div></article>)}{showDraftLock&&<article className="wb-draft-lock"><img src="/characters/gu-pan.png" alt="顾盼"/><div><header><b>向阳生长</b><em>未发送草稿 · 已加密</em><small>2022-10-29 04:18　保存于 Android客户端</small></header><p>这里缓存着一组没有发送的草稿。</p><form onSubmit={event=>{event.preventDefault();unlockDrafts()}}><label>请输入密码（提示：爱情暗号）<input type="password" value={code} onChange={event=>setCode(event.target.value)} placeholder="请输入密码" autoComplete="off"/></label><button disabled={code.trim().toLowerCase()!==draftPassword}>显示这段时间的草稿</button>{code&&code.trim().toLowerCase()!==draftPassword&&<small className="wb-error">密码不正确</small>}</form><footer><span>本地缓存</span><span>不会发布这些内容</span><span>创建于 04:18</span></footer></div></article>}</section>
      <aside className="wb-right"><section className="wb-people-card"><h3>可能认识的人</h3><a className="wb-person-link" href="/weibo/zw" target="_blank" rel="noopener noreferrer"><img src="/characters/shen-wang.png" alt="沈望"/><span><b>向左望，向右看</b><small>共同关注 1 · 查看主页 →</small></span></a><a className="wb-person-link" href="/weibo/haoqian" target="_blank" rel="noopener noreferrer"><img src="/characters/hao-qian.png" alt="郝倩"/><span><b>H.Q.</b><small>海外校友 · 查看主页 →</small></span></a><CelebrityFollows compact/></section></aside>
    </div>
    {selected&&<div className="wb-modal" onClick={()=>setSelected(null)}><article onClick={e=>e.stopPropagation()}><button onClick={()=>setSelected(null)}>×</button><small>微博详情 · WB-{String(selected).padStart(4,"0")}</small><h2>{posts.find(p=>p.id===selected)?.date}</h2><p>{posts.find(p=>p.id===selected)?.text}</p><dl><dt>发布位置</dt><dd>{posts.find(p=>p.id===selected)?.place}</dd><dt>标签</dt><dd>{posts.find(p=>p.id===selected)?.tag||"无"}</dd><dt>原始附件</dt><dd>{posts.find(p=>p.id===selected)?.file||"无"}</dd></dl></article></div>}
    <footer className="wb-footer">微博客服　意见反馈　开放平台　隐私保护　© 2009–2026</footer>
  </main>
}
