"use client";

import {useEffect,useState} from "react";

type PortalView="network"|"archive";
type RecordView="none"|"call"|"scene";

const networkRows=[
  ["01","183.214.75.018","11/29 00:00–05:59","QC-BS-02","青槐区安平路8号","城北客运站候车厅"],
  ["02","183.214.75.062","11/29 00:00–05:59","QC-HX-11","青槐区河西路29号","河西家园公共网络"],
  ["03","183.214.75.104","11/29 00:00–05:59","QC-CN-03","青槐区长宁路86号","长宁商厦"],
  ["04","183.214.75.139","11/29 00:00–05:59","QC-WH-07","青槐区文华街41号","文华里青年公寓"],
  ["05","183.214.75.207","11/29 00:00–05:59","QC-XH-09","青槐区新河路16号","新河社区服务中心"],
  ["06","183.214.76.009","11/29 00:00–05:59","QC-CN-06","青槐区长宁路107号","清河公寓公共无线"],
  ["07","183.214.76.041","11/29 00:00–05:59","QC-DQ-12","青槐区东桥街52号","东桥快捷酒店"],
  ["08","183.214.76.076","11/29 00:00–05:59","QC-SY-04","青槐区松园路19号","松园里小区会所"],
  ["09","183.214.76.091","11/29 00:00–05:59","QC-CN-08","青槐区长宁路171号","长宁花园物业网络"],
  ["10","183.214.76.109","11/29 00:00–05:59","QC-YA-05","青槐区沿安街33号","沿安公寓公共出口"],
  ["11","183.214.76.113","11/29 00:00–05:59","QC-CN-09","青槐区长宁路111号","宁安旅店"],
  ["12","183.214.76.119","11/29 00:00–05:59","QC-CN-10","青槐区长宁路117号","晴川公寓公共无线网络"],
  ["13","183.214.76.126","11/29 00:00–05:59","QC-CN-11","青槐区长宁路127号","长宁公寓二期"],
  ["14","183.214.76.154","11/29 00:00–05:59","QC-RM-02","青槐区人民北路44号","如家广场公共出口"],
  ["15","183.214.76.191","11/29 00:00–05:59","QC-CN-14","青槐区长宁路17号","长宁旧街便民网络"],
  ["16","183.214.77.023","11/29 00:00–05:59","QC-JF-05","青槐区解放巷73号","金风青年旅舍"],
  ["17","183.214.77.088","11/29 00:00–05:59","QC-NH-03","青槐区南湖路20号","南湖社区图书室"],
  ["18","183.214.77.142","11/29 00:00–05:59","QC-BH-06","青槐区北环路218号","北环综合市场"],
];

export default function LinchuanPoliceArchive(){
  const [view,setView]=useState<PortalView>("network");
  const [networkQuery,setNetworkQuery]=useState("");
  const [networkSearched,setNetworkSearched]=useState(false);
  const [networkMatch,setNetworkMatch]=useState(false);
  const [archiveAvailable,setArchiveAvailable]=useState(false);
  const [keyword,setKeyword]=useState("");
  const [date,setDate]=useState("");
  const [searched,setSearched]=useState(false);
  const [record,setRecord]=useState<RecordView>("none");
  const matches=(keyword.includes("顾盼")||keyword.includes("晴川公寓")||keyword.includes("长宁路117号"))&&(date===""||date==="2025-11-29");

  useEffect(()=>{
    const sync=()=>{
      const checked=localStorage.getItem("jia-ip-node-report-downloaded")==="true";
      setArchiveAvailable(localStorage.getItem("jia-hengmu-unlocked")==="true");
      if(checked){
        setNetworkQuery("183.214.76.119");
        setNetworkSearched(true);
        setNetworkMatch(true);
      }
    };
    sync();
    window.addEventListener("storage",sync);
    window.addEventListener("jia-progress",sync);
    return()=>{window.removeEventListener("storage",sync);window.removeEventListener("jia-progress",sync)};
  },[]);

  const lookupNetwork=()=>{
    const found=networkQuery.trim()==="183.214.76.119";
    setNetworkSearched(true);
    setNetworkMatch(found);
    if(!found)return;
    localStorage.setItem("jia-ip-node-report-downloaded","true");
    window.dispatchEvent(new Event("jia-progress"));
  };
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
    <div className="police-classified">公众线索协查端　·　访问、检索及导出行为均被记录　·　禁止向无关人员披露</div>
    <header className="police-header"><div className="police-emblem">警</div><div><b>临川市公安局</b><small>综合警务协作平台 · 公众线索协查端</small></div><nav>协查工作台　网络节点　警情档案　安全退出</nav></header>
    <div className="police-workbench">
      <aside>
        <b>协查工作台</b>
        <small>访问人：刘涵 / 已登记线索提供人</small>
        <button className={view==="network"?"active":""} onClick={()=>setView("network")}>公共网络节点查询</button>
        <button className={view==="archive"?"active":""} disabled={!archiveAvailable} onClick={()=>archiveAvailable&&setView("archive")}>警情档案检索</button>
        <div className={`police-access-state ${archiveAvailable?"ready":""}`}><span>{archiveAvailable?"关联材料已同步":"档案权限待更新"}</span><p>{archiveAvailable?"死亡警情与现场记录已开放。":"先完成现场与恒慕证据核验；新材料同步后自动开放。"}</p></div>
        <hr/>
        <span>协查编号<br/><strong>LC-XZ-251203-17</strong></span>
      </aside>
      <section className="police-main">
        <header><div><small>{view==="network"?"PUBLIC NETWORK NODE LOOKUP":"CASE-RELATED RECORD SEARCH"}</small><h1>{view==="network"?"公共网络节点查询":"警情档案检索"}</h1></div><span>权限：脱敏只读</span></header>
        <div className="police-notice">本页面不是公安内网。仅显示与本次协查直接相关的脱敏信息，无法查询无关公民或终端身份。</div>

        {view==="network"?<section className="police-network-panel">
          <div className="police-network-search">
            <div><small>NETWORK EXIT LOOKUP</small><h2>输入原始出口 IP</h2><p>请使用原始页面显示的完整IP。查询结果只能用于定位网络登记节点，不能证明具体使用人。</p></div>
            <label>出口IP地址<input value={networkQuery} onChange={event=>{setNetworkQuery(event.target.value);setNetworkSearched(false)}} onKeyDown={event=>event.key==="Enter"&&lookupNetwork()} placeholder="例如：183.214.xx.xxx" inputMode="decimal" autoFocus/></label>
            <button type="button" onClick={lookupNetwork}>查询节点一览</button>
          </div>
          {networkSearched&&!networkMatch&&<div className="police-empty compact"><b>没有找到与该IP对应的开放记录</b><p>请回到原始留言页面，核对完整IP与标点。</p></div>}
          {networkMatch&&<div className="police-network-results">
            <header><div><small>LC-NET-20251129-047</small><h2>青槐区公共网络节点一览表</h2></div><span>协查时段：2025-11-29 00:00—05:59</span></header>
            <div className="police-network-warning"><b>核验规则：</b>只比对完整IP和留言发生时段。登记地址是网络出口位置，不等于发信人的精确位置。</div>
            <div className="police-network-table-wrap"><table className="police-network-table"><thead><tr><th>序号</th><th>出口IP</th><th>记录时段</th><th>节点编号</th><th>登记地址</th><th>覆盖场所</th></tr></thead><tbody>{networkRows.map(row=><tr key={row[0]} className={row[1]==="183.214.76.119"?"matched":""}>{row.map((cell,index)=><td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>
            <footer><span>18 条开放节点记录</span><b>目标IP对应：青槐区长宁路117号 · 晴川公寓公共无线网络</b></footer>
          </div>}
        </section>:<section className="police-archive-panel">
          <div className="police-session-banner"><span>协查材料已更新</span><p>匿名求救原始页、晴川公寓现场照片与恒慕内部单据已由陈放审核并加入本次协查。</p></div>
          <div className="police-search"><label>姓名、地址或警情关键词<input value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={event=>event.key==="Enter"&&search()} placeholder="例如：姓名 / 小区 / 道路"/></label><label>发生日期<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><button onClick={search}>检索档案</button></div>
          {!searched?<div className="police-empty"><b>请输入与本次协查相关的信息</b><p>系统已开放 2025年11月26日至12月3日、青槐区范围内的关联警情。</p></div>:!matches?<div className="police-empty"><b>没有找到可显示的关联记录</b><p>尝试使用当事人姓名、完整道路名或放宽日期条件。</p></div>:<div className="police-results"><div className="police-result-head"><b>找到 2 条关联记录</b><small>结果已经脱敏，仅限本次协查使用</small></div><button onClick={()=>openRecord("call")}><time>2025-11-29<br/>07:46:18</time><span><b>110死亡警情受理记录</b><small>青槐区 · 晴川公寓 · 非正常死亡现场核查</small></span><em>查看详情 →</em></button><button onClick={()=>openRecord("scene")}><time>2025-11-29<br/>08:03:27</time><span><b>现场处置与遗体移交记录</b><small>警方到场确认死亡 · 初步排除他人直接暴力</small></span><em>查看详情 →</em></button></div>}
        </section>}

        {record!=="none"&&<div className="police-modal" onClick={()=>setRecord("none")}><article onClick={e=>e.stopPropagation()}><button onClick={()=>setRecord("none")}>×</button>{record==="call"?<><small>警情编号 LC110-20251129-074618</small><h2>110死亡警情受理记录</h2><dl><dt>报警时间</dt><dd>2025-11-29 07:46:18</dd><dt>报警人</dt><dd>周某兰（女性，顾盼之母）</dd><dt>事发地点</dt><dd>临川市青槐区长宁路117号 · 晴川公寓4栋602室</dd><dt>初始事由</dt><dd>开门后发现女儿悬吊、失去反应。接警员同时调派民警与急救人员。</dd><dt>接警摘要</dt><dd>报警人哭泣并承认卧室此前从外侧上锁。通话中一名男性试图终止报警，称“是她自己想不开，家里会处理”。接警员明确告知非正常死亡必须保护现场，不得移动遗体。</dd></dl><blockquote>录音转写片段：<br/>女声：“她没有呼吸了……门是我们锁的。”<br/>男声：“别乱说，警察不用来，我们自己送走。”<br/>女声（远处）：“那彩礼和公司那边怎么办？”</blockquote><p>07:49，辖区民警与120同时出发。家属无权取消死亡警情，出警流程继续。</p></>:<><small>警情编号 LC110-20251129-074618 · 现场记录</small><h2>现场处置与遗体移交</h2><div className="police-statusline"><span className="done">08:03<br/><b>警方到场</b></span><span className="done">08:11<br/><b>确认死亡</b></span><span className="done">09:26<br/><b>现场勘验</b></span><span className="cancel">11:42<br/><b>家属接管</b></span></div><dl><dt>死者</dt><dd>顾盼，女性，27岁。家属及证件确认身份。</dd><dt>初步结论</dt><dd>现场呈自缢形态，未发现他人直接暴力致死的明显体表证据；正式登记为非正常死亡，死因意见待归档。</dd><dt>家属陈述</dt><dd>顾某国称女儿因婚约反悔“把自己锁在房里”。未提及房门实际由外侧上锁，也未说明持续三日的限制自由。</dd><dt>现场疑点</dt><dd>门框存在外锁痕迹；室内局部已被清理。家属解释为“准备婚礼时整理房间”，当时缺少相反证据。</dd><dt>遗体去向</dt><dd>家属持死亡处理文书，委托“恒慕家庭礼仪协办单位”转送青槐殡仪服务中心暂存。</dd><dt>系统回执</dt><dd>目的机构未上传到达确认；承运方于当日17:20补录纸质签收扫描件。</dd></dl><div className="police-warning">警方知道顾盼已经死亡，但当时并不知道她曾遭非法拘禁。新取得的QQ求救、外锁证据与恒慕内部转运单，足以推翻家属陈述并重新核查遗体去向。</div></>}</article></div>}
      </section>
    </div>
    <footer className="police-footer">临川公安 · 服务人民　公正执法　© 2026<br/><small>本页面、机构与档案均为虚构，仅用于《嫁》网页叙事游戏。</small></footer>
  </main>;
}
