"use client";

import {useState} from "react";

export default function QzonePage(){
  const [view,setView]=useState<"home"|"message"|"admin">("home");
  const [verified,setVerified]=useState(false);
  const [relationshipDays,setRelationshipDays]=useState("");
  const [verifyError,setVerifyError]=useState(false);
  const verifyOwner=()=>{
    if(relationshipDays.replace(/\D/g,"")==="1488"){
      setVerified(true);
      setVerifyError(false);
      return;
    }
    setVerifyError(true);
  };
  return <main className="qz-route">
    <div className="qz-top"><b>Qzone</b><nav>个人中心　我的主页　好友　应用</nav><span>沈望　设置　退出</span></div>
    <section className="qz-cover"><div className="qz-cover-copy"><small>COUPLE SPACE · SINCE 2018.10.21</small><h1>左望右盼</h1><p>沈望与顾盼的情侣空间</p></div><div className="qz-couple"><figure><img src="/characters/shen-wang.png" alt="沈望"/><figcaption>沈望</figcaption></figure><i>♥</i><figure><img src="/characters/gu-pan.png" alt="顾盼"/><figcaption>顾盼</figcaption></figure></div></section>
    <nav className="qz-nav"><button className={view==="home"?"active":""} onClick={()=>setView("home")}>主页</button><button>说说</button><button>相册</button><button className={view==="message"?"active":""} onClick={()=>setView("message")}>留言板</button><button>纪念日</button><button className={view==="admin"?"active":""} onClick={()=>setView("admin")}>主人管理</button></nav>
    {view==="home"&&<div className="qz-layout"><aside><section><h3>情侣空间</h3><b>相伴天数：••••</b><p>开始于 2018年10月21日</p><small className="qz-days-hint">结束日期需要从两人的最后记录中确认</small></section><section><h3>最近访客</h3><div className="qz-visitors"><span>匿名访客</span><span>刘涵</span><span>一位朋友</span></div></section></aside><div className="qz-feed"><article><header><img src="/characters/gu-pan.png" alt="顾盼"/><div><b>顾盼</b><small>2021年8月17日</small></div></header><p>下一站还没决定，但地图已经画好了。等我们都忙完，就从海边开始。</p><div className="qz-memory">照片已无法从服务器载入<br/><small>IMG_20210817_旅行地图.jpg</small></div><footer>浏览 17　赞 2　评论</footer></article><article><header><img src="/characters/shen-wang.png" alt="沈望"/><div><b>沈望</b><small>2020年10月21日</small></div></header><p>左边的人继续等，右边的人记得回头。</p><footer>浏览 31　赞 1　评论</footer></article></div><aside className="qz-side"><section><h3>留言板</h3><p>有一条来自匿名访客的新留言。</p><button onClick={()=>setView("message")}>查看留言</button></section><section><h3>共同纪念</h3><p>校园艺术展<br/><small>2018.10.21</small></p><p>第一次远行<br/><small>2019.05.03</small></p></section></aside></div>}
    {view==="message"&&<div className="qz-board"><header><div><h2>留言板</h2><p>共 19 条留言 · 仅主人可查看访客详细信息</p></div><button onClick={()=>setView("admin")}>管理留言</button></header><article className="qz-urgent"><div className="qz-anon">?</div><div><b>匿名访客</b><small>2025年11月29日 02:47 · 来自手机网页</small><p>沈望，救我。我被锁在……<br/>临川……青槐区长宁路……17号<br/>……4栋……02室</p><span>该留言可能因网络异常未完整提交</span></div></article><article><div className="qz-anon old">L</div><div><b>刘涵</b><small>2020年6月9日</small><p>你俩什么时候回来请吃饭？</p></div></article></div>}
    {view==="admin"&&<div className="qz-admin"><aside><b>空间管理</b><button>基础设置</button><button className="active">留言管理</button><button>访客记录</button><button>数据备份</button></aside><section><header><small>OWNER CONSOLE</small><h2>留言详情与访问记录</h2></header>{!verified?<div className="qz-verify"><h3>主人身份确认</h3><p>请根据两人确定关系的纪念日，以及分手信最后停留的日期，计算这段恋爱持续了多少天。</p><label>他们相伴了多少天？<input inputMode="numeric" value={relationshipDays} onChange={event=>{setRelationshipDays(event.target.value);setVerifyError(false)}} onKeyDown={event=>event.key==="Enter"&&verifyOwner()} placeholder="输入计算结果"/></label><button onClick={verifyOwner}>确认并查看原始记录</button>{verifyError&&<p className="qz-verify-error">天数不正确。确认恋爱纪念日与分手信日期后重新计算。</p>}</div>:<><div className="qz-admin-alert">原留言发生一次提交中断；访客端显示残缺内容，服务器仍保存原始连接记录。</div><div className="qz-log"><span><small>留言编号</small>MSG-20251129-0247</span><span><small>提交状态</small>Interrupted / Retry failed</span><span><small>原始IP</small><b>183.214.76.119</b></span><span><small>IP节点</small><b>临川市青槐区北部</b></span><span><small>网络</small>公共无线网络 / 弱信号</span><span><small>设备</small>旧版 Android WebView</span></div><div className="qz-raw"><small>服务器原始正文</small><pre>沈望，救我。我被锁在晴川公寓。{"\n"}临川市青槐区长宁路117号，4栋602室。{"\n"}他们拿走了我的手机，这台旧手机只能蹭到楼下的网……</pre></div><a className="qz-export" href="/computer/liuhan" target="_blank" rel="noopener noreferrer">返回刘涵电脑 ↗</a></>}</section></div>}
    <footer className="qz-footer">QQ空间 · 分享生活，留住感动　|　帮助中心　客服　隐私保护</footer>
  </main>
}
