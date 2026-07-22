"use client";

import { useEffect, useState } from "react";

const evidenceNames = ["顾盼的高风险标记", "酒吧后台照片", "境外网站结算", "顾父中断报警", "恒慕转运单", "郝倩完整证词"];
const sceneMeta = [
  ["学生社区", "身份注册", "PORTAL"], ["微信", "韩铎朋友圈", "WECHAT"], ["CorpusLens", "黑话语料", "TERMINAL"], ["远帆后台", "HengMu", "ADMIN"],
  ["当面对质", "郝倩", "DIALOGUE"], ["第一结局", "迟来的回望", "ENDING"], ["协作桌面", "匿名访客", "SPLIT"], ["现场勘查", "晴川公寓", "FORENSIC"],
  ["浏览器", "原婚约", "SEARCH"], ["文档检验", "摩斯封边", "DOCUMENT"], ["企业微信", "圆满方案", "SERVICE"], ["案件系统", "接警时间轴", "POLICE"],
  ["联合行动", "证据链", "COUNTDOWN"], ["证人讯问", "郝倩自首", "TESTIMONY"], ["未迟画廊", "向阳而生", "GALLERY"], ["梦境", "镜花水月", "DREAM"]
];
const portraits: Record<number, {src:string;name:string;note:string}> = {
  1:{src:"/characters/han-duo.png",name:"韩铎",note:"远帆互助会负责人"},
  3:{src:"/characters/gu-pan.png",name:"顾盼 / HM-2217",note:"高风险目标"},
  4:{src:"/characters/hao-qian.png",name:"郝倩",note:"拒绝正式作证"},
  6:{src:"/characters/liu-han.png",name:"刘涵",note:"国内调查端"},
  8:{src:"/characters/shao-minghui.png",name:"邵明辉",note:"原婚约新郎"},
  10:{src:"/characters/han-duo.png",name:"专属顾问：韩铎",note:"圆满方案负责人"},
  11:{src:"/characters/chen-fang.png",name:"陈放",note:"临川公安"},
  13:{src:"/characters/hao-qian.png",name:"郝倩",note:"关键证人"},
  14:{src:"/characters/gu-pan.png",name:"顾盼",note:"《向阳处》作者"},
  15:{src:"/characters/shen-wang.png",name:"沈望",note:"梦醒之后"}
};

export function FullInvestigation({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [proof, setProof] = useState<number[]>([]);
  const [mementos, setMementos] = useState(1);
  const [aidView, setAidView] = useState<"public"|"admin">("public");
  useEffect(()=>{ const n=Number(localStorage.getItem("jia-full-step")||0); const timer=window.setTimeout(()=>setStep(n),0); return ()=>window.clearTimeout(timer); },[]);
  const go=(n:number)=>{setStep(n);setAnswer("");localStorage.setItem("jia-full-step",String(n));};
  const addProof=(n:number)=>setProof(p=>p.includes(n)?p:[...p,n]);

  const meta=sceneMeta[step];
  const actor=portraits[step];
  return <div className={`full-investigation step-${step}`}>
    <header><button onClick={onClose}>← 返回桌面</button><div><b>{meta[0]}</b><span>{meta[1]} · {meta[2]}</span></div><small>证据 {proof.length}/6 · 信物 {mementos}/10</small></header>
    <div className="investigation-layout">
      <nav className="case-rail" aria-label="调查进度">{sceneMeta.map((item,i)=><button key={i} className={i===step?"active":i<step?"done":""} disabled={i>step} onClick={()=>i<=step&&go(i)}><b>{String(i+1).padStart(2,"0")}</b><span>{item[0]}</span></button>)}</nav>
      <main>
      <div className="template-chrome"><span>{meta[2]}</span><i/><i/><i/></div>
      {actor && <aside className="actor-card"><img src={actor.src} alt={actor.name}/><div><b>{actor.name}</b><span>{actor.note}</span></div></aside>}
      {step===0 && <Scene eyebrow="远帆学生社区" title="创建一个不存在的学生">
        <p>公开名单揭示了学号结构：入学年份＋专业代码＋姓名首字母＋尚未占用的六位数字。学校旧社区只核验格式，没有连接教务系统。</p>
        <div className="source-grid"><Card title="专业目录" text="Computer Science — CS\nData Science — DS\nVisual Communication — VC"/><Card title="姓名" text="林川 / Lin Chuan\n首字母：LC"/><Card title="可用序号" text="184206 — 未占用"/></div>
        <label>输入完整学号</label><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="2025-DS-LC-184206"/>
        <button disabled={answer.toUpperCase()!=="2025-DS-LC-184206"} onClick={()=>go(1)}>注册学生社区账号</button>
      </Scene>}
      {step===1 && <Scene eyebrow="韩铎 · 微信朋友圈" title="进入他的圈子">
        <p>韩铎的朋友圈充满豪车、酒吧定位和远帆迎新合照。玩家使用刚注册的虚构交换生身份回答盘问，并含糊表示对“特殊聚会”感兴趣。</p>
        <div className="dialogue"><p><b>韩铎：</b>DS新生？住哪片宿舍？</p><p><b>林川：</b>North Hall。迎新页面上看到远帆的。</p><p><b>韩铎：</b>学号发来我看看。</p><p><b>系统：</b>学校社区主页验证通过。</p><p><b>韩铎：</b>行。普通群没意思，给你个老司机群入口。</p></div>
        <button onClick={()=>go(2)}>接受群邀请</button>
      </Scene>}
      {step===2 && <Scene eyebrow="CorpusLens 0.8" title="破译汽车黑话">
        <p>沈望将1,746条聊天导入语料工具。结合医院时间、酒吧预约与文件编号，为高频词建立字典。</p>
        <div className="codebook"><span>“新车”</span><b>目标</b><span>“路线”</span><b>个人资料</b><span>“加油”</span><b>药物控制</b><span>“记录仪”</span><b>偷拍设备</b><span>“车库”</span><b>非法网站</b><span>“修理费”</span><b>封口费</b></div>
        <label>“今晚给2217加油，路书传回车库”中的2217是谁？</label><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="姓名"/>
        <button disabled={answer!=="顾盼"} onClick={()=>go(3)}>确认字典</button>
      </Scene>}
      {step===3 && <Scene eyebrow="互助会管理员后台" title="HengMu">
        <div className="aid-browser">
          <div className="aid-address"><span>↻</span><span>🔒</span><b>yuanfancommunity.org</b><small>EN　中文</small></div>
          {aidView==="public" ? <div className="aid-public">
            <nav><strong><i>远</i> 远帆社区互助会</strong><span>关于我们</span><span>支持项目</span><span>新生指南</span><span>活动日历</span><button>寻求帮助</button></nav>
            <div className="aid-hero"><div><small>YUANFAN COMMUNITY SUPPORT</small><h2>异乡不必独行。</h2><p>由留学生发起的非营利互助网络，为新生提供接机、临时住宿、心理支持转介与同伴陪伴。</p><button onClick={()=>setAidView("admin")}>成员登录</button></div><div className="aid-photo"><span>远帆秋季迎新 · 2022</span></div></div>
            <div className="aid-stats"><span><b>1,280+</b>累计服务学生</span><span><b>46</b>认证志愿者</span><span><b>24/7</b>紧急同伴热线</span><span><b>12</b>合作校园组织</span></div>
            <section className="aid-programs"><h3>我们能提供什么</h3><div><article><b>落地安顿</b><p>接机、短期住宿信息和生活手续指引。</p></article><article><b>健康转介</b><p>连接经过审核的医疗与心理健康资源。</p></article><article><b>同伴支持</b><p>保密倾听与危机后的陪伴，不替代专业医疗。</p></article></div></section>
            <footer>Registered Student Organization · Privacy · Safeguarding · Contact</footer>
          </div> : <div className="aid-admin">
            <aside><b>YF Connect</b><small>STAFF CONSOLE</small><button className="active">概览</button><button>个案队列</button><button>成员档案</button><button>车辆排班</button><button>报销与结算</button><button>文件中心</button><hr/><span>HD-ADMIN　● 在线</span></aside>
            <section><header><div><small>CASE OPERATIONS</small><h2>个案与外联工作台</h2></div><button onClick={()=>setAidView("public")}>查看公开网站</button></header><div className="admin-alert">⚠ 共享账号已连续 917 天未更改密码　·　最后登录：2025-12-03 18:42</div><div className="admin-metrics"><span><b>18</b>进行中</span><span><b>7</b>待回访</span><span><b>4</b>高风险标记</span></div><div className="admin-table"><div className="thead"><b>个案编号</b><b>姓名</b><b>分类</b><b>最后更新</b><b>权限</b></div><div><span>HM-2217</span><strong>GU PAN</strong><span className="risk">非成员 / 高风险</span><span>2022-10-29</span><span>受限</span></div><div><span>HQ-2184</span><strong>H. Q.</strong><span>住院转介</span><span>2022-11-03</span><span>普通</span></div></div><h3>HM-2217 · 附件与行动日志</h3><div className="evidence-wall"><Card title="营救记录" text="顾盼独自带走 H.Q.\n监控正脸已入库"/><Card title="现场照片" text="[证物缩略图待补]\n郝倩位于摄像机后方"/><Card title="钥匙记录" text="H.Q.随车返回\n使用备用钥匙开门"/><Card title="外部标签" text="HengMu / 路线已建档\n等待结算"/></div></section>
          </div>}
        </div>
        {aidView==="admin" && <button onClick={()=>{addProof(0);addProof(1);go(4)}}>导出日志并寻找郝倩</button>}
      </Scene>}
      {step===4 && <Scene eyebrow="郝倩 · 现在使用婚后姓名" title="她选择关门">
        <div className="dialogue"><p><b>沈望：</b>门是你打开的。你就在摄像机后面。</p><p><b>郝倩：</b>他们不让我走。我也是受害者。</p><p><b>沈望：</b>顾盼替你付了治疗费，也救过你。</p><p><b>郝倩：</b>我已经写信道歉了。她没收到，不是我的错。你为什么一定要毁掉两个活着的人？</p></div>
        <p>证据仍不足以迫使她正式作证。与此同时，刘涵发现顾盼回国无人知晓，也根本不在家乡。</p>
        <button onClick={()=>go(5)}>结束第一周目：迟来的回望</button>
      </Scene>}
      {step===5 && <Scene eyebrow="第一次结局" title="你知道得太晚了">
        <p>沈望回国时，仪式已经完成。顾盼遗体不知所踪。屏幕熄灭前，备忘录出现一行不属于任何角色的文字：</p>
        <blockquote>如果时间回到那封邮件出现的时候，你愿意把已经知道的一切告诉他们吗？</blockquote>
        <button onClick={()=>go(6)}>我愿意 · 开启第二周目</button>
      </Scene>}
      {step===6 && <Scene eyebrow="左右分屏开启" title="匿名访客">
        <p>左侧沈望快速重取国外原始证据；右侧刘涵找到公开的QQ情侣空间。匿名留言残破，但所有者后台保留完整IP。</p>
        <pre>沈望，救我。我被锁在……\n临川……青槐区长宁路……17号\n……4栋……02室\nIP归属节点：青槐区北部</pre>
        <label>结合工作地点与候选地址，输入准确住址</label><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="晴川公寓4栋602室"/>
        <button disabled={answer!=="晴川公寓4栋602室"} onClick={()=>go(7)}>前往拘禁现场</button>
      </Scene>}
      {step===7 && <Scene eyebrow="晴川公寓 · 4栋602" title="这里发生过什么">
        <div className="evidence-wall"><Card title="突然离开" text="护照、工作证、日常衣物和复学申请全部留下"/><Card title="非法拘禁" text="门框残留外锁孔洞；三天失败网络连接"/><Card title="明确拒绝" text="撕碎合同一角：我不同意"/><Card title="紧急清理" text="局部清洁；恒慕车辆凌晨进入"/><Card title="旧手机" text="匿名求救成功；后续消息上传失败"/><Card title="旧请柬" text="顾盼 × 邵明辉\n云庭酒店·锦华厅"/></div>
        <button onClick={()=>go(8)}>调查请柬</button>
      </Scene>}
      {step===8 && <Scene eyebrow="旧请柬" title="原来的新郎">
        <p>搜索显示邵明辉是当地富豪独子，长期需要照护；邵家公开寻找“温顺、能够照顾家庭”的伴侣。云庭酒店则确认原定宴席已经取消。</p>
        <div className="source-grid"><Card title="搜索结果" text="邵家愿支付高额彩礼\n本人很少公开露面"/><Card title="酒店档期" text="2025.12.06 锦华厅\n原预约已取消 / 当前空档"/><Card title="二维码" text="恒慕婚姻家庭服务集团\n状态：方案变更"/></div>
        <button onClick={()=>go(9)}>拼合婚约变更单</button>
      </Scene>}
      {step===9 && <Scene eyebrow="变更单底部封边" title="摩斯电码">
        <pre>-.--  --.-  --...  ...--  -----  ....-  .----  ----.</pre>
        <label>输入解出的专属服务码</label><input value={answer} onChange={e=>setAnswer(e.target.value.toUpperCase())} placeholder="YQ-730419"/>
        <button disabled={answer!=="YQ-730419"} onClick={()=>go(10)}>添加恒慕企业微信</button>
      </Scene>}
      {step===10 && <Scene eyebrow="恒慕家庭顾问" title="圆满方案">
        <div className="dialogue"><p><b>自动客服：</b>订单 HM-W-251206-117 已进入特殊变更流程。</p><p><b>刘涵：</b>服务码 YQ-730419。查询家属委托物。</p><p><b>私人顾问：</b>委托标的已接收，恒温保存；新匹配完成。家属分成50%。</p></div>
        <p>转运单将“委托标的”写成顾盼，接收地为永安礼仪园。她已经死亡；父母正在出售她的遗体。</p>
        <button onClick={()=>{addProof(4);go(11)}}>联系微信列表里的陈放</button>
      </Scene>}
      {step===11 && <Scene eyebrow="陈放 · 临川公安" title="让真相进入程序">
        <p>陈放不私下泄露数据库。他根据QQ求救、拘禁现场和恒慕转运单正式登记线索，查到死亡当晚的时间轴。</p>
        <pre>02:13 周秀兰拨打报警电话\n02:14 通话中断\n02:16 顾建国回拨称误触\n02:19 顾建国联系韩铎\n02:31 恒慕车辆进入小区</pre>
        <button onClick={()=>{addProof(3);go(12)}}>锁定永安礼仪园</button>
      </Scene>}
      {step===12 && <Scene eyebrow="转运倒计时 03:00:00" title="最后的证据链">
        <p>梁家支付60万元购买顾盼遗体；恒慕与顾家五五分成。选择所有必须提交的证据，再要求郝倩作证。</p>
        <div className="checklist">{evidenceNames.map((x,i)=><button key={x} disabled={i===5} className={proof.includes(i)?"selected":""} onClick={()=>i<5&&addProof(i)}>{proof.includes(i)?"✓":i===5?"锁":"○"} {x}</button>)}</div>
        {proof.filter(i=>i<5).length>=5 && <button onClick={()=>go(13)}>向郝倩展示完整证据</button>}
      </Scene>}
      {step===13 && <Scene eyebrow="郝倩的选择" title="这一次，她没有再解释">
        <blockquote>“我受过伤害，但伤害她的那一步，是我自己走的。我不请求她原谅。我会把我做过的事情全部说出来。”</blockquote>
        <p>郝倩自首并出庭。警方在转运前进入永安礼仪园，阻止冥婚。顾盼父母和直接参与者被追责，韩铎的国内外犯罪链被连接。</p>
        <button onClick={()=>{addProof(5);go(14)}}>进入真结局</button>
      </Scene>}
      {step===14 && <Scene eyebrow="真结局 · 向阳而生" title="她终于以自己的名字被看见">
        <div className="asset-slot large">后续图片素材：未迟书店画展 / 《向阳处》系列 / 空着的右侧位置</div>
        <p>顾盼的画作在“未迟”展出。沈望没有替她活着，而是带着她曾经活过的证明，继续两人没有完成的旅行。`HengMu`仍有节点运行，也有人开始盯上他。</p>
        <p>本次原型默认已获得1件信物。后续所有支线接入后，集齐10件可开启《镜花水月》。</p>
        <button onClick={()=>{setMementos(10);go(15)}}>原型预览：补齐全部信物</button>
      </Scene>}
      {step===15 && <Scene eyebrow="隐藏结局 · 镜花水月" title="在梦里，他们拥有完整的一生">
        <div className="asset-slot large">后续图片素材：2026年婚礼 / 镜面倒影 / 永远停在清晨的窗</div>
        <blockquote>“这一次，你等到我回头了吗？”<br/>“没有。这一次，我走到了你身边。”</blockquote>
        <p>梦中的沈望在事发前一晚抵达国外，顾盼完成学业，两人在2026年结婚。钟表最终停住，顾盼让他醒来，替她去看那些没见过的地方。</p>
        <footer>死亡没有被改写。<br/>但在无人能够夺走的梦里，他们曾有过完整的一生。</footer>
      </Scene>}
      </main>
    </div>
  </div>;
}

function Scene({ eyebrow,title,children }:{eyebrow:string;title:string;children:React.ReactNode}){return <section className="investigation-scene"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children}</section>}
function Card({title,text}:{title:string;text:string}){return <article className="case-card"><b>{title}</b><p>{text.split("\n").map((x,i)=><span key={i}>{x}</span>)}</p></article>}
