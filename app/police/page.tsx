"use client";

import {useState} from "react";

type RecordView="none"|"call"|"scene";

export default function LinchuanPoliceArchive(){
  const [code,setCode]=useState("");
  const [authorized,setAuthorized]=useState(false);
  const [keyword,setKeyword]=useState("");
  const [date,setDate]=useState("");
  const [searched,setSearched]=useState(false);
  const [record,setRecord]=useState<RecordView>("none");
  const matches=(keyword.includes("顾盼")||keyword.includes("晴川公寓")||keyword.includes("长宁路117号"))&&(date===""||date==="2025-11-29");
  const search=()=>{setSearched(true);setRecord("none")};
  const openRecord=(next:Exclude<RecordView,"none">)=>{
    setRecord(next);
    localStorage.setItem(`jia-police-${next}-read`,"true");
    if(localStorage.getItem("jia-police-call-read")==="true"&&localStorage.getItem("jia-police-scene-read")==="true"){
      localStorage.setItem("jia-liuhan-line-complete","true");
      window.dispatchEvent(new Event("jia-progress"));
    }
  };
  return <main className="police-route">
    <div className="police-classified">内部线索协作系统　·　访问、检索及导出行为均被记录　·　禁止向无关人员披露</div>
    <header className="police-header"><div className="police-emblem">警</div><div><b>临川市公安局</b><small>综合警务协作平台 · 公众线索协查端</small></div><nav>工作台　警情检索　协查反馈　安全退出</nav></header>
    {!authorized?<section className="police-login"><div><small>LINCHUAN PUBLIC SECURITY</small><h1>线索协查授权</h1><p>该入口仅供已登记的案件相关人查看经脱敏处理的警情信息。授权由承办民警发起，并在限定时间后失效。</p><ul><li>仅显示与当前协查事项直接相关的记录</li><li>不得据此自行接触涉事人员</li><li>发现现实人身危险请立即拨打110</li></ul></div><form onSubmit={e=>{e.preventDefault();setAuthorized(code.toUpperCase()==="CF-1203-LH")}}><span>一次性协查入口</span><label>协查授权码<input value={code} onChange={e=>setCode(e.target.value)} placeholder="请输入承办民警提供的授权码"/></label><label>访问人<input value="刘涵（已登记线索提供人）" readOnly/></label><button>验证身份并进入</button>{code&&code.toUpperCase()!=="CF-1203-LH"&&<p>授权码无效或尚未生效。</p>}<small>授权有效期：2025-12-03 21:30—23:30</small></form></section>:
    <div className="police-workbench"><aside><b>协查工作台</b><small>授权人：陈放 / 027431</small><button className="active">警情档案检索</button><button>本次协查说明</button><button>已查看记录</button><button>提交补充线索</button><hr/><span>协查编号<br/><strong>LC-XZ-251203-17</strong></span></aside><section className="police-main"><header><div><small>CASE-RELATED RECORD SEARCH</small><h1>警情档案检索</h1></div><span>权限：脱敏只读</span></header><div className="police-notice">本页面不是公安内网。仅可查看承办民警审核后开放的脱敏记录，无法查询无关公民信息。</div><div className="police-search"><label>姓名、地址或警情关键词<input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="例如：姓名 / 小区 / 道路"/></label><label>发生日期<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><button onClick={search}>检索档案</button></div>
      {!searched?<div className="police-empty"><b>请输入与本次协查相关的信息</b><p>陈放已开放 2025年11月26日至12月3日、青槐区范围内的关联警情。</p></div>:!matches?<div className="police-empty"><b>没有找到可显示的关联记录</b><p>尝试使用当事人姓名、完整道路名或放宽日期条件。</p></div>:<div className="police-results"><div className="police-result-head"><b>找到 2 条关联记录</b><small>结果已经脱敏，仅限本次协查使用</small></div><button onClick={()=>openRecord("call")}><time>2025-11-29<br/>07:46:18</time><span><b>110死亡警情受理记录</b><small>青槐区 · 晴川公寓 · 非正常死亡现场核查</small></span><em>查看详情 →</em></button><button onClick={()=>openRecord("scene")}><time>2025-11-29<br/>08:03:27</time><span><b>现场处置与遗体移交记录</b><small>警方到场确认死亡 · 初步排除他人直接暴力</small></span><em>查看详情 →</em></button></div>}
      {record!=="none"&&<div className="police-modal" onClick={()=>setRecord("none")}><article onClick={e=>e.stopPropagation()}><button onClick={()=>setRecord("none")}>×</button>{record==="call"?<><small>警情编号 LC110-20251129-074618</small><h2>110死亡警情受理记录</h2><dl><dt>报警时间</dt><dd>2025-11-29 07:46:18</dd><dt>报警人</dt><dd>周某兰（女性，顾盼之母）</dd><dt>事发地点</dt><dd>临川市青槐区长宁路117号 · 晴川公寓4栋602室</dd><dt>初始事由</dt><dd>开门后发现女儿悬吊、失去反应。接警员同时调派民警与急救人员。</dd><dt>接警摘要</dt><dd>报警人哭泣并承认卧室此前从外侧上锁。通话中一名男性试图终止报警，称“是她自己想不开，家里会处理”。接警员明确告知非正常死亡必须保护现场，不得移动遗体。</dd></dl><blockquote>录音转写片段：<br/>女声：“她没有呼吸了……门是我们锁的。”<br/>男声：“别乱说，警察不用来，我们自己送走。”<br/>女声（远处）：“那彩礼和公司那边怎么办？”</blockquote><p>07:49，辖区民警与120同时出发。家属无权取消死亡警情，出警流程继续。</p></>:<><small>警情编号 LC110-20251129-074618 · 现场记录</small><h2>现场处置与遗体移交</h2><div className="police-statusline"><span className="done">08:03<br/><b>警方到场</b></span><span className="done">08:11<br/><b>确认死亡</b></span><span className="done">09:26<br/><b>现场勘验</b></span><span className="cancel">11:42<br/><b>家属接管</b></span></div><dl><dt>死者</dt><dd>顾盼，女性，27岁。家属及证件确认身份。</dd><dt>初步结论</dt><dd>现场呈自缢形态，未发现他人直接暴力致死的明显体表证据；正式登记为非正常死亡，死因意见待归档。</dd><dt>家属陈述</dt><dd>顾某国称女儿因婚约反悔“把自己锁在房里”。未提及房门实际由外侧上锁，也未说明持续三日的限制自由。</dd><dt>现场疑点</dt><dd>门框存在外锁痕迹；室内局部已被清理。家属解释为“准备婚礼时整理房间”，当时缺少相反证据。</dd><dt>遗体去向</dt><dd>家属持死亡处理文书，委托“恒慕家庭礼仪协办单位”转送青槐殡仪服务中心暂存。</dd><dt>系统回执</dt><dd>目的机构未上传到达确认；承运方于当日17:20补录纸质签收扫描件。</dd></dl><div className="police-warning">警方知道顾盼已经死亡，但当时并不知道她曾遭非法拘禁。新取得的QQ求救、外锁证据与恒慕内部转运单，足以推翻家属陈述并重新核查遗体去向。</div></>}</article></div>}
    </section></div>}
    <footer className="police-footer">临川公安 · 服务人民　公正执法　© 2026<br/><small>本页面、机构与档案均为虚构，仅用于《嫁》网页叙事游戏。</small></footer>
  </main>
}
