"use client";

import { useEffect,useState } from "react";

type View = "home" | "services" | "status";

export default function HengmuSite() {
  const [view,setView]=useState<View>("home");
  const [order,setOrder]=useState("");
  const [code,setCode]=useState("");
  const [state,setState]=useState<"idle"|"error"|"unlocked">("idle");
  const [contactAdded,setContactAdded]=useState(false);
  useEffect(()=>setContactAdded(localStorage.getItem("jia-hengmu-contact")==="true"),[]);
  const check=()=>{
    const normalizedCode=code.trim().toUpperCase().replaceAll("-","");
    if(order.toUpperCase()==="HM-W-251206-117"&&normalizedCode==="YQ730419"){
      setState("unlocked");localStorage.setItem("jia-hengmu-unlocked","true");
    } else setState("error");
  };
  const addCaseManager=()=>{
    localStorage.setItem("jia-hengmu-contact","true");
    setContactAdded(true);
    window.dispatchEvent(new Event("jia-progress"));
    window.dispatchEvent(new Event("jia-wechat-notification"));
    window.location.assign("/computer/liuhan?app=wechat&chat=hengmu-plan");
  };
  return <main className={`route-page hengmu-route ${state==="unlocked"?"hm-unlocked":""}`}>
    <div className="hm-utility"><span>全国服务热线　400-716-0520</span><span>门店查询　合作加盟　人才招聘　集团官网</span></div>
    <header className="hm-header">
      <button className="hm-brand" onClick={()=>setView("home")}><i>恒</i><span><b>恒慕</b><small>HENGMU FAMILY SERVICES</small></span></button>
      <nav><button onClick={()=>setView("home")}>首页</button><button onClick={()=>setView("services")}>婚恋服务</button><button>家庭顾问</button><button>幸福研究院</button><button>品牌故事</button><button>新闻中心</button></nav>
      <button className="hm-order-button" onClick={()=>setView("status")}>服务进度查询</button>
    </header>

    {view==="home"&&<div className="hm-home">
      <section className="hm-hero"><div><small>HENGMU · SINCE 2008</small><h1>让幸福，<br/>如期而至。</h1><p>从相识、成家到长期家庭关系维护，恒慕为每一位会员提供专属、审慎、可信赖的家庭服务。</p><div><button onClick={()=>setView("services")}>了解恒慕服务</button><button className="outline" onClick={()=>setView("status")}>查询服务进度</button></div></div><span>恒慕臻选 · 私人家庭顾问</span></section>
      <section className="hm-numbers"><span><b>18</b>年家庭服务经验</span><span><b>42</b>城市服务中心</span><span><b>320,000+</b>会员家庭</span><span><b>96.7%</b>会员满意度</span></section>
      <section className="hm-intro"><div><p className="hm-kicker">A LIFELONG PARTNERSHIP</p><h2>不止于婚恋，<br/>更懂家庭的长期需要</h2><p>恒慕以专业红娘、家庭顾问、法律及心理支持团队组成多学科服务网络。我们相信，每段关系都值得被认真对待。</p><button onClick={()=>setView("services")}>探索服务体系 →</button></div><div className="hm-intro-photo"><span>全国第37家恒慕家庭服务中心开业</span></div></section>
      <section className="hm-cards"><p className="hm-kicker">OUR SERVICES</p><h2>为人生的重要阶段提供支持</h2><div><article><i>01</i><h3>臻选婚恋</h3><p>实名会员审核、专属顾问匹配与全程约见陪同。</p></article><article><i>02</i><h3>家庭礼遇</h3><p>婚礼协同、家庭沟通和重要纪念日管理。</p></article><article><i>03</i><h3>关系顾问</h3><p>长期关系维护、家庭心理与法律资源转介。</p></article><article><i>04</i><h3>特别委托</h3><p>为复杂家庭需求提供严格保密的定制方案。</p></article></div></section>
      <section className="hm-trust"><div><small>隐私保护</small><b>分级信息权限与专属档案保管</b></div><div><small>服务透明</small><b>关键节点可在线查询</b></div><div><small>全国协同</small><b>跨城市家庭顾问网络</b></div></section>
    </div>}

    {view==="services"&&<div className="hm-inner">
      <section className="hm-page-title"><small>HENGMU SERVICES</small><h1>婚恋与家庭服务</h1><p>以会员真实需求为起点，提供从关系建立到家庭生活的全周期支持。</p></section>
      <div className="hm-service-grid"><aside><b>服务分类</b><button className="active">臻选婚恋</button><button>家庭礼遇</button><button>关系顾问</button><button>特别委托</button></aside><section><h2>恒慕臻选会员服务</h2><p>专属顾问会在完成身份、家庭情况与服务偏好核验后，建立匹配档案。所有正式方案均使用唯一合同号进行追踪。</p><div className="hm-process"><span><b>01</b>需求访谈</span><span><b>02</b>资料审核</span><span><b>03</b>方案匹配</span><span><b>04</b>家庭协同</span><span><b>05</b>长期回访</span></div><div className="hm-notice"><b>已经签约？</b><p>扫描请柬上的二维码可进入专属服务页面；合同号与服务码请以纸质婚介合同为准。</p><button onClick={()=>setView("status")}>进入服务进度查询</button></div></section></div>
    </div>}

    {view==="status"&&<div className={`hm-portal ${state==="unlocked"?"hm-special-mode":""}`}>
      <div className="hm-portal-top"><div><small>MEMBER SERVICE CENTER</small><h1>专属服务中心</h1></div><button onClick={()=>setView("home")}>返回集团官网</button></div>
      {state!=="unlocked"?<section className="hm-query"><div className="hm-query-copy"><p className="hm-kicker">服务进度查询</p><h2>查看您的专属方案</h2><p>为保护会员及家庭隐私，请同时输入合同号与专属服务码。两项信息均印在婚介合同残页上，服务码位于底部封边。</p><ul><li>查询当前服务节点</li><li>下载变更文件与付款凭证</li><li>联系您的专属家庭顾问</li></ul></div><div className="hm-query-form"><span>🔒 加密会员通道</span><label>合同号<input value={order} onChange={e=>setOrder(e.target.value.toUpperCase())} placeholder="HM-…"/></label><label>专属服务码<input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="请输入8位服务码"/></label>{state==="error"&&<p>合同号或服务码不匹配，请核对纸质材料。</p>}<button onClick={check}>验证并查询</button><small>恒慕工作人员不会通过电话索取完整服务码。</small></div></section>:
      <><section className="hm-special-hero"><div><small>HENGMU · PRIVATE FAMILY PLAN</small><h2>笑容之外，<br/>仍须圆满。</h2><p>高隐私等级服务区域 · 所有访问已被记录</p></div><span>特殊家庭委托</span></section><section className="hm-case">
        <aside><b>恒慕会员中心</b><small>订单 HM-W-251206-117</small><button className="active">方案概览</button><button>变更记录 <i>1</i></button><button>付款与结算</button><button>文件中心 <i>3</i></button><button>专属顾问</button><hr/><span>服务状态<br/><strong>特殊变更处理中</strong></span></aside>
        <div className="hm-case-main"><header><div><small>PRIVATE FAMILY PLAN</small><h2>圆满方案</h2><p>最近更新：2025-11-29 12:26</p></div><b>高隐私等级</b></header><div className="hm-warning">本方案已从「婚礼协同」转入「家庭特殊委托」，公开婚宴及原匹配对象已取消。</div>
        <div className="hm-case-meta"><span><small>委托家庭</small>顾氏家庭</span><span><small>原计划日期</small>2025-12-06</span><span><small>原承办地点</small>云庭酒店 · 锦华厅</span><span><small>方案负责人</small>恒慕特别委托组</span></div>
        <h3>方案变更时间线 · 2025-11-29</h3><div className="hm-timeline"><article><time>11:48</time><div><b>家属提出特殊变更</b><p>现场处置结束后，原婚约取消，要求评估其他家庭方案。</p></div></article><article><time>12:06</time><div><b>委托标的接收</b><p>接收地点：晴川公寓；状态：无自主确认。</p></div></article><article><time>12:26</time><div><b>跨部门转运已安排</b><p>恒温保存，接收地：永安礼仪园。新匹配家庭待完成仪式。</p></div></article></div>
        <div className="hm-finance"><h3>内部结算摘要</h3><div><span><small>新匹配家庭付款</small><b>¥600,000</b></span><span><small>委托家庭分成</small><b>50%</b></span><span><small>恒慕服务分成</small><b>50%</b></span></div><p>备注：委托物交接后不支持撤回。相关表述不得出现在公开会员记录中。</p></div>
        <div className="hm-contact"><div><b>圆满方案负责人</b><p>恒慕特别委托组 · 官方企业服务账号</p></div><button onClick={addCaseManager}>{contactAdded?"打开企业微信":"添加企业微信"}</button></div>
        </div>
      </section></>}
    </div>}
    <footer className="hm-footer"><div><b>恒慕婚姻家庭服务集团</b><p>让每一份家庭期待，都得到专业回应。</p></div><span>关于恒慕　服务协议　隐私政策　投诉建议<br/>© 2008–2026 HengMu Family Services</span></footer>
  </main>;
}
