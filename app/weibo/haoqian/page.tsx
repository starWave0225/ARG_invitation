import CelebrityFollows from "../CelebrityFollows";

export default function HaoQianWeibo(){
  return <main className="wb-route hq-wb">
    <header className="wb-top"><b><i>微</i>微博</b><div className="wb-search">⌕ <input placeholder="搜微博"/></div><nav>首页　视频　发现　游戏</nav><span>沈望　⚙</span></header>
    <section className="wb-cover hq-cover"><div className="wb-profile"><img src="/characters/hao-qian.png" alt="郝倩"/><h1>H_Qian17</h1><p>@HQ_abroad　♀</p><small>生活要向前看。旧事不必反复解释。</small></div></section>
    <nav className="wb-profile-nav"><button className="active">她的主页</button><button>她的相册</button><button>赞</button><span>关注 206　粉丝 127　微博 384</span></nav>
    <div className="wb-layout hq-layout">
      <aside><section><h3>个人资料</h3><p>所在地：海外</p><p>教育信息：Northbridge University</p><p>感情状况：已婚</p><p>曾用昵称：倩影向西</p></section><section className="hq-contact"><h3>其他账号</h3><p>微信：<b>hqian_17</b></p><small>“校友和熟人请备注姓名。”</small></section></aside>
      <section className="wb-feed">
        <div className="wb-filter"><b>她的微博</b><span>按时间排序</span></div>
        <HqPost date="2025-10-18 13:26" text="终于把婚礼照片整理完。谢谢所有从不同城市赶来的朋友。日子会继续，过去的就留在过去吧。" image/>
        <HqPost date="2024-06-07 00:14" text="有些信寄出去以后就不应该再等回复。道歉的人已经尽力，原不原谅是另一回事。"/>
        <HqPost date="2023-02-15 22:09" text="戒掉一种依赖比想象中难。不是所有选择都是清醒的时候做出的，但人总要允许自己重新开始。"/>
        <HqPost date="2022-12-02 04:37" text="换了号码。以前认识的人如果还有必要联系，可以加新的微信。备注学校和姓名。" contact/>
        <HqPost date="2022-11-01 01:52" text="我也很痛苦。我当时根本走不了。为什么所有人都觉得只有一种受害者？" deleted/>
      </section>
      <aside className="wb-right"><section className="wb-people-card"><h3>可能认识的人</h3><div><img src="/characters/gu-pan.png" alt="顾盼"/><span><b>向阳处没有窗</b><small>共同关注 2</small></span></div><CelebrityFollows shift={1} compact/></section><section><h3>关系线索</h3><p>她在事发后更换了手机号和微信号；2024年之后的动态反复强调“不再解释”。</p></section></aside>
    </div>
    <footer className="wb-footer">微博客服　意见反馈　开放平台　隐私保护　© 2009–2026</footer>
  </main>
}

function HqPost({date,text,image,contact,deleted}:{date:string;text:string;image?:boolean;contact?:boolean;deleted?:boolean}){
  return <article className={deleted?"deleted-post":""}><img src="/characters/hao-qian.png" alt="郝倩"/><div><header><b>H_Qian17</b><small>{date}　来自 iPhone客户端　IP属地：海外</small></header><p>{text}</p>{image&&<div className="hq-wedding-photo">WEDDING · 2025<br/><small>婚礼照片预览</small></div>}{contact&&<div className="wb-attachment">微信号更新：<b>hqian_17</b><small>此账号与手机号均已更换</small></div>}{deleted&&<small className="hq-deleted">该微博后来被作者删除 · 网页缓存仍可见</small>}<footer><span>☆ 收藏</span><span>↗ 转发</span><span>□ 评论</span><span>♡ 赞</span></footer></div></article>
}
