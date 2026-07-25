"use client";

import {useMemo,useState} from "react";
import CelebrityFollows from "./CelebrityFollows";
import WeiboImage from "./WeiboImage";
import WeiboSortToggle,{type WeiboSortOrder} from "./WeiboSortToggle";

type Post={id:number;date:string;year:string;place:string;text:React.ReactNode;plain:string;tag?:string;image?:string;photo?:{src:string;caption:string};file?:string;private?:boolean};
const posts:Post[]=[
  {id:1,date:"2021-09-03 08:16",year:"2021",place:"海外",plain:"开学第一周。爱能克服远距离。",text:<>开学第一周。课很难，时差也很难，但有人每天在地球另一端陪我吃早餐。<br/>好在地图是圆的，总会有走到一起的那天。<br/>爱能克服远距离。</>,tag:"留学生活",image:"map"},
  {id:13,date:"2021-10-09 06:38",year:"2021",place:"海外",plain:"第一次一个人坐最早班的火车去陌生城市。谢谢你给我的爱。",text:<>第一次一个人坐最早班的火车去陌生城市。有人问我，一个女生为什么非要自己去。<br/>我觉得我不止是女生，我也是一个20+的成年人，不能因为我是女生我就失去了独自去做一些事的权力。<br/>谢谢你给我的爱，让我能一次又一次地出发<a href="/weibo/zw" target="_blank" rel="noopener noreferrer" style={{color:"#5f7fa6",fontWeight:600,textDecoration:"none"}}>@向左望，向右看</a></>,tag:"一个人出发",photo:{src:"/weibo/gupan-independent-journey.webp",caption:"清晨的站台、速写本和一张折过很多次的地图"}},
  {id:2,date:"2021-12-19 23:41",year:"2021",place:"海外",plain:"在异国遇见一个聊得来的朋友，是一种幸福。",text:<>在异国遇见一个聊得来的朋友，是一种幸福。</>,tag:"H.Q.",image:"snow"},
  {id:14,date:"2022-01-23 16:52",year:"2022",place:"海外",plain:"学校后巷的小猫以后会是咖啡屋的前台迎宾猫。",text:<>学校后巷那只总躲人的小猫，今天终于肯靠近新搭的防雨箱。学校担心她伤人，要求送去救助站，我找了附近的咖啡店店主，总算商量好了，以后她会是这间咖啡屋的前台迎宾猫啦。<br/>小家伙，再委屈你在这里暂住几天。</>,tag:"城市动物",photo:{src:"/weibo/gupan-stray-cat-shelter.webp",caption:"咖啡店后巷的临时猫屋"}},
  {id:3,date:"2022-02-15 01:07",year:"2022",place:"海外",plain:"希望她一切平安。大家都要好好的。",text:<>我没想过会遇上这样的事，希望她一切平安🙏。<br/>所有出门在外的女孩们，保护好自己！<br/>PS：没有说男孩们不用保护好自己的意思，大家都要好好的！</>,tag:"Harborwell"},
  {id:15,date:"2022-04-18 14:07",year:"2022",place:"海外",plain:"为学生中心提交无障碍通道方案。",text:<>只有受伤了才发现生活里其实有很多不公平的地方，比如学生中心门口只有三层台阶，可对一些行动不便的人来说，那简直是天堑呐。<br/>说干就干！托着受伤的腿，招呼了几个小伙伴一起量完尺寸，把无障碍通道方案交到学校管理部门了。<br/>虽然轮椅只会陪我一阵子，但这个小滑坡可是会陪这个学校很久很久呢。呵，我可真棒！</>,tag:"无障碍",photo:{src:"/weibo/gupan-accessibility-action.webp",caption:"学生中心门前的坡道测量现场"}},
  {id:16,date:"2022-07-09 22:31",year:"2022",place:"海外",plain:"第一次在夜间补给站值班。",text:<>第一次在夜间补给站值班，发放一些热水啊、泡面啊什么的。不得不说国外的生活成本真的很高，有人说流浪者应该靠自己的双手重新开始，可他们很多人一顿饭、一个饱觉都睡不上。<br/>唉</>,tag:"社区志愿",photo:{src:"/weibo/gupan-outreach-night.webp",caption:"雨夜里的社区补给站"}},
  {id:4,date:"2022-10-26 19:22",year:"2022",place:"海外",plain:"明晚是学期结束聚会的日子。",text:<>明晚是学期结束聚会的日子。她说最近认识了一些新朋友，大家可以一起喝点东西、听音乐、也分享下毕业求职的经验。<br/>她看起来终于好一些了，戒断反应很严重的那一阵子，真的很担心她，希望以后一切都好。<br/>好想念望望啊。</>,tag:"留学日常"},
  {id:5,date:"2022-10-28 04:18",year:"2022",place:"海外",plain:"我记不得昨晚，我什么都不记得了。",text:<>我记不得昨晚，我什么都不记得了，如果这一切是梦就好了，我不明白为什么她要这么做，我不明白为什么我救了她她却对这一切袖手旁观。<br/>我甚至不知道该怎么描述，我可能是太累了。<br/>望望，我很希望你来救我，可是我..</>,tag:"未发送草稿",private:true},
  {id:6,date:"2022-10-29 09:46",year:"2022",place:"海外",plain:"她说自己提前走了。我该怎么办。",text:<>她说自己提前走了，说是酒吧的人把我送回来的。可他们为什么知道准确地址？<br/>除了她，没有别人有我的钥匙。<br/>我该怎么办</>,tag:"未发送草稿",private:true},
  {id:8,date:"2022-11-01 21:08",year:"2022",place:"海外",plain:"这是我留学以来第一次向家里开口要钱。",text:<>医院说取证和后续检查需要自己承担一部分费用，这是我留学以来第一次向家里开口要钱，可他们根本不关心我的身体，他们只是问我为什么去酒吧，他们真的是我的家人吗，一直以来，从弟弟出生的那一天起...而我只是想知道那晚到底发生了什么。</>,tag:"未发送草稿",private:true},
  {id:9,date:"2022-11-03 00:37",year:"2022",place:"海外",plain:"望，你最近好忙好忙。",text:<>望，你最近好忙好忙，我知道你在换工作，我看着你，有好多话想说，可是我该怎么开口，我觉得好恶心，好脏，我恨我自己，我也许真的是有问题，才会遇人不淑，才会招惹这样的麻烦。</>,tag:"未发送草稿",private:true},
  {id:17,date:"2022-11-05 03:37",year:"2022",place:"海外",plain:"失眠的不知道多少天。",text:<>失眠的不知道多少天，我终于失去了对睡眠的渴望，上天惩罚像我这样的人。所以连我最珍贵的未来都要夺走吗..我不想和家里人联络，好窒息。</>,tag:"未发送草稿",private:true},
  {id:10,date:"2022-11-09 16:32",year:"2022",place:"海外",plain:"回不去了。",text:<>回不去了。 我觉得我的人生被彻底地摧毁了</>,tag:"未发送草稿",private:true},
  {id:12,date:"2022-11-17 03:41",year:"2022",place:"海外",plain:"请原谅我。",text:<>请原谅我，请原谅我。<br/>请<br/>原谅我</>,tag:"未发送草稿",private:true},
];

export default function GupanWeibo({embedded=false,viewer="沈望"}:{embedded?:boolean;viewer?:string}){
  const [year,setYear]=useState("全部");
  const [query,setQuery]=useState("");
  const [privateOpen,setPrivateOpen]=useState(false);
  const [code,setCode]=useState("");
  const [sortOrder,setSortOrder]=useState<WeiboSortOrder>("asc");
  const visible=useMemo(()=>posts
    .filter(p=>(privateOpen||!p.private)&&(year==="全部"||p.year===year)&&(!query||p.plain.includes(query)||p.tag?.toLowerCase().includes(query.toLowerCase())))
    .sort((a,b)=>{
      if(Boolean(a.private)!==Boolean(b.private))return a.private?1:-1;
      return sortOrder==="asc"?a.date.localeCompare(b.date):b.date.localeCompare(a.date);
    }),[year,query,privateOpen,sortOrder]);
  const showDraftLock=!privateOpen&&(year==="全部"||year==="2022")&&!query;
  const draftPassword="zuowangyoupan";
  const unlockDrafts=()=>{if(code.trim().toLowerCase()===draftPassword)setPrivateOpen(true)};
  return <main className={`wb-route gp-wb-dark ${embedded?"pc-weibo-app":""}`}>
    <header className="wb-top"><b><i>微</i>微博</b><div className="wb-search">⌕ <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={embedded?"搜索我的微博":"搜她的微博"}/></div><nav>首页　视频　发现　游戏</nav><span>{viewer}　⚙</span></header>
    <section className="wb-cover"><div className="wb-profile"><img src="/characters/gu-pan.png" alt="顾盼"/><h1>向阳生长</h1><p>@GP_looking_right　♀</p><small>走走停停看看。</small></div></section>
    <nav className="wb-profile-nav"><button className="active">她的主页</button><button>她的相册</button><button>赞</button><span>关注 17　粉丝 3　微博 {posts.filter(p=>!p.private).length}</span></nav>
    <div className="wb-layout">
      <aside><section><h3>个人资料</h3><p>所在地：海外</p><p>教育信息：Northbridge University</p><p>简介：画画、植物、旅行</p></section><section><h3>微博归档</h3>{["全部","2022","2021"].map(x=><button key={x} className={year===x?"active":""} onClick={()=>setYear(x)}>{x}年</button>)}</section><section className="wb-clue"><h3>账号状态</h3><p>最后公开更新：2022-10-26</p><p>此后没有发布新微博</p>{privateOpen&&<p>已在本地时间线中显示未发送草稿</p>}</section></aside>
      <section className="wb-feed"><div className="wb-filter"><b>她的微博</b><div style={{display:"flex",alignItems:"center",gap:"10px"}}><span>{visible.length} 条公开记录{privateOpen?` · ${posts.filter(p=>p.private).length} 条本地草稿`:""}</span><WeiboSortToggle order={sortOrder} onChange={setSortOrder}/></div></div>{visible.map(post=><article key={post.id} className={post.private?"private":""}><img src="/characters/gu-pan.png" alt="顾盼"/><div><header><b>向阳生长</b>{post.private&&<em>未发送草稿</em>}<small>{post.date}　来自 Android客户端　IP属地：{post.place}</small></header><p>{post.text}</p>{post.image&&<WeiboImage kind={post.image as "map"|"snow"} label={post.image==="map"?"一张画满线路的世界地图":"冬夜里的车站"}/>} {post.photo&&<WeiboImage kind="photo" src={post.photo.src} label={post.photo.caption}/>} {post.file&&<WeiboImage kind="lab" label={post.file}/>}<footer><span>☆ 收藏</span><span>↗ 转发 0</span><span>□ 评论 0</span><span>♡ 赞 {post.id%3}</span></footer></div></article>)}{showDraftLock&&<article className="wb-draft-lock"><img src="/characters/gu-pan.png" alt="顾盼"/><div><header><b>向阳生长</b><em>未发送草稿 · 已加密</em><small>2022-10-29 04:18　保存于 Android客户端</small></header><p>这里缓存着一组没有发送的草稿。</p><form onSubmit={event=>{event.preventDefault();unlockDrafts()}}><label>请输入密码（提示：爱情暗号）<input type="password" value={code} onChange={event=>setCode(event.target.value)} placeholder="请输入密码" autoComplete="off"/></label><button disabled={code.trim().toLowerCase()!==draftPassword}>显示这段时间的草稿</button>{code&&code.trim().toLowerCase()!==draftPassword&&<small className="wb-error">密码不正确</small>}</form><footer><span>本地缓存</span><span>不会发布这些内容</span><span>创建于 04:18</span></footer></div></article>}</section>
      <aside className="wb-right"><section className="wb-people-card"><h3>可能认识的人</h3><a className="wb-person-link" href="/weibo/zw" target="_blank" rel="noopener noreferrer"><img src="/characters/shen-wang.png" alt="沈望"/><span><b>向左望，向右看</b><small>共同关注 1 · 查看主页 →</small></span></a><a className="wb-person-link" href="/weibo/haoqian" target="_blank" rel="noopener noreferrer"><img src="/characters/hao-qian.png" alt="郝倩"/><span><b>H.Q.</b><small>海外校友 · 查看主页 →</small></span></a><CelebrityFollows compact/></section></aside>
    </div>
    <footer className="wb-footer">微博客服　意见反馈　开放平台　隐私保护　© 2009–2026</footer>
  </main>
}
