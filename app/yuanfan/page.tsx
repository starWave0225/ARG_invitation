"use client";

import {useState} from "react";

type View="public"|"login"|"archive";

export default function YuanfanSite(){
  const [view,setView]=useState<View>("public");
  const [user,setUser]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(false);
  const [archiveTab,setArchiveTab]=useState<"cases"|"document"|"sealed">("cases");
  const [archiveQuery,setArchiveQuery]=useState("");
  const [archiveSearchError,setArchiveSearchError]=useState(false);
  const [evidenceUnlocked,setEvidenceUnlocked]=useState(false);
  const openWechat=()=>{localStorage.setItem("jia-hd-added","true");window.open("/computer/shen","_blank","noopener,noreferrer")};
  const login=()=>{if(user.toLowerCase()==="hq.volunteer"&&password.toUpperCase()==="YF-0214-GP"){setView("archive");setError(false)}else setError(true)};
  const searchArchive=()=>{
    const permitted=localStorage.getItem("jia-olddriver-group")==="true";
    if(archiveQuery.replace(/\s/g,"").toLowerCase()==="womandriver"&&permitted){
      setEvidenceUnlocked(true);setArchiveSearchError(false);setArchiveTab("sealed");
      localStorage.setItem("jia-sealed-evidence-unlocked","true");
    }else setArchiveSearchError(true);
  };
  return <main className="route-page yuanfan-route">
    {view==="public"&&<div className="aid-public">
      <nav><strong><i>远</i> 远帆社区互助会</strong><span>关于我们</span><span>支持项目</span><span>新生指南</span><span>活动日历</span><button onClick={()=>setView("login")}>成员登录</button></nav>
      <div className="aid-hero"><div><small>YUANFAN COMMUNITY SUPPORT</small><h2>异乡不必独行。</h2><p>由留学生发起的非营利互助网络，为新生提供接机、临时住宿、心理支持转介与同伴陪伴。</p><button>寻求帮助</button></div><div className="aid-photo"><span>远帆秋季迎新 · 2022</span></div></div>
      <div className="aid-stats"><span><b>1,280+</b>累计服务学生</span><span><b>46</b>认证志愿者</span><span><b>24/7</b>紧急同伴热线</span><span><b>12</b>合作校园组织</span></div>
      <section className="aid-programs"><p className="aid-eyebrow">PROGRAMS & REFERRALS</p><h3>我们能提供什么</h3><div><article><b>落地安顿</b><p>接机、短期住宿信息和生活手续指引。</p></article><article><b>健康转介</b><p>连接经过审核的医疗与心理健康资源。远帆不直接提供医疗服务。</p></article><article><b>同伴支持</b><p>保密倾听与危机后的陪伴，不替代专业医疗。</p></article></div></section>
      <section className="aid-team"><div><small>COMMUNITY TEAM</small><h3>认识我们的联络团队</h3><p>活动合作、校园社群与新生联络由志愿者共同维护。</p></div><article><img src="/characters/han-duo.png" alt="韩铎"/><span><small>STUDENT OUTREACH LIAISON</small><b>韩铎 · Han Duo</b><p>迎新活动、校园社群与合作场地联络</p><em>个人微信：hd_047_abroad</em></span><button onClick={openWechat}>通过微信联系 ↗</button></article></section>
      <section className="aid-transparency"><b>隐私与档案说明</b><p>医疗机构仅向远帆返回转介完成状态。成员档案不应包含完整病历。若您认为资料被不当访问，请联系 safeguarding@yuanfan.example。</p></section>
      <footer>Registered Student Organization · Privacy · Safeguarding · Contact</footer>
    </div>}

    {view==="login"&&<div className="aid-login-page"><header><button onClick={()=>setView("public")}>远帆社区互助会</button><span>YF CONNECT · MEMBER ACCESS</span></header><div className="aid-login-shell"><section><small>MEMBERS & VOLUNTEERS</small><h1>成员工作台</h1><p>该入口供已登记的工作人员与志愿者访问本人参与的转介记录。登录不会开放其他成员的医疗信息。</p><div className="aid-login-warning">连续失败的登录会触发账号保护。若您已离开远帆，请联系现任负责人恢复历史档案权限。</div></section><form onSubmit={e=>{e.preventDefault();login()}}><h2>登录 YF Connect</h2><label>成员账号<input value={user} onChange={e=>setUser(e.target.value)} placeholder="name.role"/></label><label>访问口令<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••••"/></label>{error&&<p>账号、口令或历史档案权限不匹配。</p>}<button>验证并继续</button><small>需要旧志愿者账号？请由档案相关人发起恢复。</small></form></div></div>}

    {view==="archive"&&<div className="aid-admin limited">
      <aside>
        <b>YF Connect</b><small>HISTORICAL VOLUNTEER VIEW</small>
        <button className={archiveTab==="cases"?"active":""} onClick={()=>setArchiveTab("cases")}>我的关联档案</button>
        <button>转介回执</button><button>访问记录</button>
        <button className={archiveTab==="document"?"active":""} onClick={()=>setArchiveTab("document")}>内部文档 <em>1</em></button>
        {evidenceUnlocked&&<button className={archiveTab==="sealed"?"active":""} onClick={()=>setArchiveTab("sealed")}>封存证据 <em>!</em></button>}
        <button>安全举报</button><hr/><span>HQ.VOLUNTEER　● 只读</span>
      </aside>
      <section>
        <header><div><small>ARCHIVED CASE ACCESS</small><h2>{archiveTab==="cases"?"关联档案 · YF-HQ-0214":archiveTab==="document"?"内部文档 · 历史共享副本":"封存证据 · WOMAN DRIVER"}</h2></div><button onClick={()=>setView("public")}>退出并查看官网</button></header>
        <div className="admin-alert">只读恢复会话：该账号只能查看本人作为受助者或志愿者参与的历史记录。</div>
        <form className={`aid-archive-search ${archiveSearchError?"error":""}`} onSubmit={e=>{e.preventDefault();searchArchive()}}>
          <label htmlFor="archive-search">全局档案搜索</label><div><input id="archive-search" value={archiveQuery} onChange={e=>{setArchiveQuery(e.target.value);setArchiveSearchError(false)}} placeholder="输入档案编号、姓名或检索词"/><button>搜索</button></div>
          {archiveSearchError&&<p>没有匹配记录，或当前会话不具备该检索词的解密凭据。</p>}
        </form>
        {archiveTab==="cases"?<>
          <div className="admin-metrics"><span><b>1</b>本人转介</span><span><b>1</b>关联协助人</span><span><b>3</b>异常访问</span></div>
          <div className="admin-table"><div className="thead"><b>档案编号</b><b>主体</b><b>类型</b><b>最后更新</b><b>权限</b></div><div><span>YF-HQ-0214</span><strong>H. QIAN</strong><span>康复治疗转介</span><span>2022-10-19</span><span>本人</span></div><div><span>YF-GP-0214-A</span><strong>GU PAN</strong><span className="risk">关联协助人</span><span>2022-10-29</span><span>恢复开放</span></div></div>
          <h3>关联协助记录</h3><div className="evidence-wall"><article className="case-card"><b>紧急接回</b><p>登记人顾盼独自找到H.Q.并送至安全地点。现场附近发现不明人员拍摄。</p></article><article className="case-card"><b>费用承担</b><p>港湾康复中心订单由顾盼全额支付。对应回执：HW-220214-HQ。</p></article><article className="case-card"><b>随访中断</b><p>2022-10-18起H.Q.失联；次日工作人员账号HD-047访问并导出关联人资料。</p></article><article className="case-card"><b>外部导出</b><p>导出任务标记：HM-2217。目标系统未登记在远帆授权合作方中。</p></article></div>
          <div className="aid-access-log"><h3>访问日志</h3><p><time>2022-10-19 02:13</time><b>HD-047</b>查看 H.Q. 转介档案</p><p><time>2022-10-19 02:18</time><b>HD-047</b>导出关联协助人 GU PAN 的住址与紧急联系人</p><p><time>2022-10-19 02:21</time><b>HD-047</b>创建外部标签 HM-2217</p></div>
        </>:archiveTab==="document"?<article className="aid-internal-document">
          <header><span>PDF</span><div><small>YF-INTERNAL / SAFETY / 2022-FALL</small><h3>《夜路安全与接送群值班手册》</h3><p>最后编辑：2022-09-01 · 共享给：活动联络、夜间接送志愿者</p></div></header>
          <div className="aid-document-warning">历史共享副本。该文件后来被移出公开志愿者资料库，但 H.Q. 的旧账号仍保留只读权限。</div>
          <h4>4. 群聊与人员核验</h4>
          <p>夜间接送群不得直接使用学生姓名核验身份。遇到新账号申请加入时，管理员应询问当季备用识别语，并在通过后删除验证记录。</p>
          <dl><dt>工作群入口</dt><dd>wx: olddriver</dd><dt>2022 秋季备用识别语</dt><dd><strong>风从北岸来</strong></dd><dt>轮换日期</dt><dd>2022-12-01</dd></dl>
          <blockquote>异常备注：韩铎曾要求继续沿用该识别语，并将群名称改为“老司机夜航群”。这不符合远帆的隐私与群组管理规范。</blockquote>
        </article>:<section className="aid-sealed-evidence">
          <header><span>SEALED EXPORT</span><b>匹配到 4 组隐藏记录 · 解密凭据 WOMAN DRIVER</b><small>这些文件被伪装成夜间接送、健康转介和活动报销资料。</small></header>
          <div className="aid-evidence-summary"><span><b>4</b>关联女性</span><span><b>3</b>异常药检</span><span><b>7</b>偷拍视频索引</span><span><b>2</b>封口转账</span></div>
          <article><header><b>HM-2217 · GU PAN</b><em>证据链完整</em></header><dl><dt>事件时间</dt><dd>2022-10-27 23:48—次日04:11</dd><dt>医疗佐证</dt><dd>事后检查陈述、异常筛查与复检建议；时间与酒吧记录吻合。</dd><dt>数字证据</dt><dd>HD-047提前导出住址；群聊出现“加油”“记录仪”“送回原位”；偷拍视频索引共3项。</dd><dt>资金记录</dt><dd>外部标签HM-2217关联一张未兑现的20,000美元本票，备注为“settlement”。</dd></dl></article>
          <article><header><b>YF-HQ-0214 · H. QIAN</b><em>关联档案遭篡改</em></header><dl><dt>事件时间</dt><dd>2022-02-13—02-14</dd><dt>医疗佐证</dt><dd>港湾康复中心接诊记录保留意识障碍、记忆缺失与疑似非自愿接触陈述。</dd><dt>数字证据</dt><dd>原始紧急转介被改写为普通康复项目；顾盼的接回记录证明她在现场附近找到H.Q.。</dd><dt>异常访问</dt><dd>HD-047在结案后持续查看该档案，并借此导出顾盼的关联人资料。</dd></dl></article>
          <article><header><b>WD-019 · 身份已脱敏</b><em>重复手法</em></header><dl><dt>事件时间</dt><dd>2022-06-12</dd><dt>医疗佐证</dt><dd>急诊记录载明记忆断片及疑似非自愿接触；血液筛查检出与本人用药史不符的镇静成分。</dd><dt>数字证据</dt><dd>群文件中的接送路线与就诊时间重合；偷拍视频索引2项。</dd><dt>后续处理</dt><dd>以“活动补助”名义转账8,000美元，安全举报随后被管理员关闭。</dd></dl></article>
          <article><header><b>WD-024 · 身份已脱敏</b><em>投诉被压下</em></header><dl><dt>事件时间</dt><dd>2022-09-03</dd><dt>医疗佐证</dt><dd>校园诊所保留伤情照片编号与非自愿接触陈述。</dd><dt>数字证据</dt><dd>偷拍视频索引2项；元数据中的设备编号与HM-2217文件相同。</dd><dt>后续处理</dt><dd>举报邮件被转发至HD-047后删除；当事人一周后退出远帆。</dd></dl></article>
          <div className="aid-chain-conclusion"><b>系统性侵害证据</b><p>四组记录共享管理员、设备编号、药物控制用语、偷拍视频目录与封口资金路径，已不是孤立事件。顾盼的遭遇与此前受害者构成同一条重复作案链。</p></div>
        </section>}
      </section>
    </div>}
  </main>
}
