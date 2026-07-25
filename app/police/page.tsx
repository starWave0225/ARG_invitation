"use client";

import {useEffect,useState} from "react";

type PortalView="network"|"archive";
type RecordView="none"|"call"|"scene";
type ArchiveError="not-found"|null;

const ARCHIVE_ID="LC-QH-1129-402";

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
  const [archiveId,setArchiveId]=useState("");
  const [archiveSearched,setArchiveSearched]=useState(false);
  const [archiveError,setArchiveError]=useState<ArchiveError>(null);
  const [record,setRecord]=useState<RecordView>("none");

  useEffect(()=>{
    if(localStorage.getItem("jia-ip-node-report-downloaded")!=="true"){
      localStorage.setItem("jia-ip-node-report-downloaded","true");
      window.dispatchEvent(new Event("jia-progress"));
    }
  },[]);

  const searchArchive=()=>{
    setArchiveSearched(true);
    setRecord("none");
    if(archiveId.toUpperCase().replace(/\s/g,"")!==ARCHIVE_ID){
      setArchiveError("not-found");
      return;
    }
    setArchiveError(null);
  };
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
        <button className={view==="archive"?"active":""} onClick={()=>setView("archive")}>警情档案检索</button>
        <div className="police-access-state"><span>公共网络权限已开放</span><p>节点表可直接查看；警情档案须按现场附件中的档案编号检索。</p></div>
        <hr/>
        <span>档案权限<br/><strong>脱敏只读</strong></span>
      </aside>
      <section className="police-main">
        <header><div><small>{view==="network"?"PUBLIC NETWORK NODE LOOKUP":"CASE-RELATED RECORD SEARCH"}</small><h1>{view==="network"?"公共网络节点查询":"警情档案检索"}</h1></div><span>权限：脱敏只读</span></header>
        <div className="police-notice">本页面不是公安内网。仅显示与本次公众协查直接相关的脱敏信息，无法查询无关公民或终端身份。</div>

        {view==="network"?<section className="police-network-panel">
          <div className="police-network-results">
            <header><div><small>LC-NET-20251129-047</small><h2>青槐区公共网络节点一览表</h2></div><span>协查时段：2025-11-29 00:00—05:59</span></header>
            <div className="police-network-warning"><b>核验规则：</b>只比对完整IP和留言发生时段。登记地址是网络出口位置，不等于发信人的精确位置。</div>
            <div className="police-network-table-wrap"><table className="police-network-table"><thead><tr><th>序号</th><th>出口IP</th><th>记录时段</th><th>节点编号</th><th>登记地址</th><th>覆盖场所</th></tr></thead><tbody>{networkRows.map(row=><tr key={row[0]}>{row.map((cell,index)=><td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>
          </div>
        </section>:<section className="police-archive-panel">
          <div className="police-archive-gate"><small>CASE ARCHIVE LOOKUP</small><h2>按档案编号检索</h2><p>请输入现场物品登记表下载附件的完整文件名编号。编号验证成功后，将直接返回本案关联警情。</p><label>档案编号<input value={archiveId} onChange={event=>{setArchiveId(event.target.value);setArchiveSearched(false);setArchiveError(null)}} onKeyDown={event=>event.key==="Enter"&&searchArchive()} placeholder="LC-…"/></label>{archiveError==="not-found"&&<p className="error">没有找到该编号对应的可公开档案，请核对附件文件名。</p>}<button onClick={searchArchive}>查询档案</button><em>公共网络节点一览不受档案检索条件限制。</em></div>
          {archiveSearched&&!archiveError&&<div className="police-results"><div className="police-result-head"><b>档案 {ARCHIVE_ID} · 找到 2 条关联记录</b><small>结果已经脱敏，仅限本次协查使用</small></div><button onClick={()=>openRecord("call")}><time>2025-11-29<br/>07:46:18</time><span><b>110死亡警情受理记录</b><small>青槐区 · 晴川公寓 · 非正常死亡现场核查</small></span><em>查看详情 →</em></button><button onClick={()=>openRecord("scene")}><time>2025-11-29<br/>08:03:27</time><span><b>现场处置与遗体移交记录</b><small>警方到场确认死亡 · 初步排除他人直接暴力</small></span><em>查看详情 →</em></button></div>}
        </section>}

        {record!=="none"&&<div className="police-modal" onClick={()=>setRecord("none")}><article onClick={e=>e.stopPropagation()}><button onClick={()=>setRecord("none")}>×</button>{record==="call"?<><small>警情编号 LC110-20251129-074618</small><h2>110死亡警情受理记录</h2><dl><dt>报警时间</dt><dd>2025-11-29 07:46:18</dd><dt>报警人</dt><dd>周某兰（女性，顾盼之母）</dd><dt>事发地点</dt><dd>临川市青槐区长宁路117号 · 晴川公寓4栋1单元402室</dd><dt>初始事由</dt><dd>开门后发现女儿悬吊、失去反应。接警员同时调派民警与急救人员。</dd><dt>接警摘要</dt><dd>报警人哭泣并承认卧室此前从外侧上锁。通话中一名男性试图终止报警，称“是她自己想不开，家里会处理”。接警员明确告知非正常死亡必须保护现场，不得移动遗体。</dd></dl><blockquote>录音转写片段：<br/>女声：“她没有呼吸了……门是我们锁的。”<br/>男声：“别乱说，警察不用来，我们自己送走。”<br/>女声（远处）：“那彩礼和公司那边怎么办？”</blockquote><p>07:49，辖区民警与120同时出发。家属无权取消死亡警情，出警流程继续。</p></>:<><small>警情编号 LC110-20251129-074618 · 现场记录</small><h2>现场处置与遗体移交</h2><div className="police-statusline"><span className="done">08:03<br/><b>警方到场</b></span><span className="done">08:11<br/><b>确认死亡</b></span><span className="done">09:26<br/><b>现场勘验</b></span><span className="cancel">11:42<br/><b>家属接管</b></span></div><dl><dt>死者</dt><dd>顾盼，女性，27岁。家属及证件确认身份。</dd><dt>初步结论</dt><dd>现场呈自缢形态，未发现他人直接暴力致死的明显体表证据；正式登记为非正常死亡，死因意见待归档。</dd><dt>家属陈述</dt><dd>顾某国称女儿因婚约反悔“把自己锁在房里”。未提及房门实际由外侧上锁，也未说明持续三日的限制自由。</dd><dt>现场疑点</dt><dd>门框存在外锁痕迹；室内局部已被清理。家属解释为“准备婚礼时整理房间”，当时缺少相反证据。</dd><dt>遗体去向</dt><dd>家属持死亡处理文书，委托“恒慕家庭礼仪协办单位”转送青槐殡仪服务中心暂存。</dd><dt>系统回执</dt><dd>目的机构未上传到达确认；承运方于当日17:20补录纸质签收扫描件。</dd></dl><div className="police-warning">警方知道顾盼已经死亡，但当时并不知道她曾遭非法拘禁。新取得的QQ求救、外锁证据与恒慕内部转运单，足以推翻家属陈述并重新核查遗体去向。</div></>}</article></div>}
      </section>
    </div>
    <footer className="police-footer">临川公安 · 服务人民　公正执法　© 2026<br/><small>本页面、机构与档案均为虚构，仅用于《嫁》网页叙事游戏。</small></footer>
  </main>;
}
