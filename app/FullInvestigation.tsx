"use client";

import { useEffect, useState } from "react";

const evidenceNames = ["顾盼的高风险标记", "酒吧后台照片", "境外网站结算", "顾父中断报警", "恒慕转运单", "郝倩完整证词"];
const sceneMeta = [
  ["学生社区", "身份注册", "PORTAL"], ["微信", "韩铎朋友圈", "WECHAT"], ["CorpusLens", "黑话语料", "TERMINAL"], ["远帆旧站", "HengMu", "WEB"],
  ["当面对质", "郝倩", "DIALOGUE"], ["第一结局", "终于放手", "ENDING"], ["协作桌面", "匿名访客", "SPLIT"], ["现场勘查", "晴川公寓", "FORENSIC"],
  ["浏览器", "原婚约", "SEARCH"], ["文档检验", "摩斯封边", "DOCUMENT"], ["企业微信", "圆满方案", "SERVICE"], ["案件系统", "接警时间轴", "POLICE"],
  ["联合行动", "证据链", "COUNTDOWN"], ["证人讯问", "郝倩自首", "TESTIMONY"], ["未迟画廊", "向阳而生", "GALLERY"]
];
const portraits: Record<number, {src:string;name:string;note:string}> = {
  1:{src:"/characters/han-duo.png",name:"韩铎",note:"远帆互助会负责人"},
  3:{src:"/characters/gu-pan.png",name:"顾盼 / HM-2217",note:"高风险目标"},
  4:{src:"/characters/hao-qian.png",name:"郝倩",note:"拒绝正式作证"},
  6:{src:"/characters/liu-han.png",name:"刘涵",note:"国内调查端"},
  8:{src:"/characters/shao-minghui.png",name:"邵明辉",note:"原婚约新郎"},
  10:{src:"/characters/hengmu-case-manager.svg",name:"恒慕特别委托组",note:"圆满方案企业服务账号"},
  11:{src:"/characters/chen-fang.png",name:"陈放",note:"临川公安"},
  13:{src:"/characters/hao-qian.png",name:"郝倩",note:"关键证人"},
  14:{src:"/characters/gu-pan.png",name:"顾盼",note:"《向阳处》作者"}
};

export function FullInvestigation({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [proof, setProof] = useState<number[]>([]);
  useEffect(()=>{ const n=Math.min(Number(localStorage.getItem("jia-full-step")||0),14); const timer=window.setTimeout(()=>setStep(n),0); return ()=>window.clearTimeout(timer); },[]);
  const go=(n:number)=>{setStep(n);setAnswer("");localStorage.setItem("jia-full-step",String(n));};
  const addProof=(n:number)=>setProof(p=>p.includes(n)?p:[...p,n]);

  const meta=sceneMeta[step];
  const actor=portraits[step];
  return <div className={`full-investigation step-${step}`}>
    <header><button onClick={onClose}>← 返回桌面</button><div><b>{meta[0]}</b><span>{meta[1]} · {meta[2]}</span></div><small>证据 {proof.length}/6</small></header>
    <div className="investigation-layout">
      <nav className="case-rail" aria-label="调查进度">{sceneMeta.map((item,i)=><button key={i} className={i===step?"active":i<step?"done":""} disabled={i>step} onClick={()=>i<=step&&go(i)}><b>{String(i+1).padStart(2,"0")}</b><span>{item[0]}</span></button>)}</nav>
      <main>
      <div className="template-chrome"><span>{meta[2]}</span><i/><i/><i/></div>
      {actor && <aside className="actor-card"><img src={actor.src} alt={actor.name}/><div><b>{actor.name}</b><span>{actor.note}</span></div></aside>}
      {step===0 && <Scene eyebrow="远帆学生社区" title="创建一个不存在的学生">
        <p>韩铎只接受本校学生。沈望需要进入学校官网，从专业目录、公开学生名单和国际生待处理档案中推导一个能够通过旧社区验证的身份。</p>
        <div className="route-launcher"><small>搜索结果 · northbridge.edu</small><h2>Northbridge University</h2><p>Academic catalog, campus directory and student services.</p><a href="/university" target="_blank" rel="noopener noreferrer">在新标签页打开学校官网 ↗</a></div>
        <p>目标身份：林川 / Lin Chuan。请先在学校网站完成社区账号激活，再把完整学号带回这里。</p>
        <label>输入完整学号</label><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="2025-DS-LC-184206"/>
        <button disabled={answer.toUpperCase()!=="2025-DS-LC-184206"} onClick={()=>go(1)}>注册学生社区账号</button>
      </Scene>}
      {step===1 && <Scene eyebrow="韩铎 · 微信朋友圈" title="进入他的圈子">
        <p>韩铎的朋友圈充满豪车、酒吧定位和远帆迎新合照。玩家使用刚注册的虚构交换生身份回答盘问，并含糊表示对“特殊聚会”感兴趣。</p>
        <div className="dialogue"><p><b>韩铎：</b>DS新生？住哪片宿舍？</p><p><b>林川：</b>North Hall。迎新页面上看到远帆的。</p><p><b>韩铎：</b>学号发来我看看。</p><p><b>系统：</b>学校社区主页验证通过。</p><p><b>韩铎：</b>行，资料能对上。远帆旧站的学生权限给你开了。</p></div>
        <button onClick={()=>go(2)}>打开远帆官网</button>
      </Scene>}
      {step===2 && <Scene eyebrow="CorpusLens 0.8" title="破译汽车黑话">
        <p>沈望将1,746条聊天导入语料工具。结合医院时间、酒吧预约与文件编号，为高频词建立字典。</p>
        <div className="codebook"><span>“新车”</span><b>目标</b><span>“路线”</span><b>个人资料</b><span>“加油”</span><b>药物控制</b><span>“记录仪”</span><b>偷拍设备</b><span>“车库”</span><b>非法网站</b><span>“修理费”</span><b>封口费</b></div>
        <label>“今晚给2217加油，路书传回车库”中的2217是谁？</label><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="姓名"/>
        <button disabled={answer!=="顾盼"} onClick={()=>go(3)}>确认字典</button>
      </Scene>}
      {step===3 && <Scene eyebrow="郝倩 · 微信对质" title="她愿意给出一个方向">
        <p>沈望用港湾康复记录证明自己已经接近真相。郝倩没有交出任何账号或口令，只发送了远帆官网。</p>
        <div className="dialogue"><p><b>沈望：</b>我查到了港湾康复中心的记录。</p><p><b>郝倩：</b>你要的答案都在这里。</p><p><b>郝倩：</b>我只知道这么多了。</p></div>
        <div className="route-launcher"><small>微信 · 郝倩</small><h2>沿远帆链接继续调查</h2><p>使用韩铎开通的学生网站权限查看成员栏目与站内搜索。</p><a href="/computer/shen" target="_blank" rel="noopener noreferrer">打开沈望电脑与微信 ↗</a></div>
        <button onClick={()=>go(4)}>打开远帆官网</button>
      </Scene>}
      {step===4 && <Scene eyebrow="远帆 · 学生网站" title="HM-2217">
        <p>韩铎置顶朋友圈的九张照片给出老司机群入口；远帆“成员公告”中排版异常的四个字组成入群识别语。右键点击“新生指南”会下载司机黑话词典，用来理解群聊内容。随后根据群聊提示查看“活动日历”：按活动序号1至11读取圈选日期，再以A=1、Z=26换算，得到 <code>womandriver</code>。在远帆官网搜索会直接进入一个未登记的成人视频索引站。</p>
        <div className="route-launcher"><small>yuanfancommunity.org · STUDENT ACCESS</small><h2>远帆社区互助会</h2><p>韩铎核验学生资料后，成员栏目与站内搜索会自动解锁。</p><a href="/yuanfan" target="_blank" rel="noopener noreferrer">打开远帆官网 ↗</a></div>
        <p>在隐藏站输入 <code>HM-2217</code>，偷拍视频索引、事件时间、地址导出与两万美元结算标签把顾盼的遭遇拼成完整记录。与此同时，刘涵发现顾盼回国无人知晓，也根本不在家乡。</p>
        <button onClick={()=>{addProof(0);addProof(1);go(5)}}>返回郝倩微信，作出选择</button>
      </Scene>}
      {step===5 && <Scene eyebrow="第一结局 · 终于放手" title="在坚持之外，他做了另一种选择">
        <p>两组隐藏记录齐全后，沈望再次要求郝倩出庭。她害怕过去毁掉现在的生活。如果玩家选择不再要求她作证，沈望会保留全部证据，并决定用自己的方式惩罚伤害过顾盼的人。随后进入可滚动的结局阅读页，《太阳与地球》从进入结局时自动播放。</p>
        <blockquote>至少，那张照片，替他们记得。</blockquote>
        <div className="route-launcher"><small>第二结局 · 明日黄花</small><h2>如果继续要求郝倩出庭</h2><p>郝倩答应作证后，刘涵突然联系沈望，表示顾盼的情况不对。沈望返回临川，两人在一处暂时以“XX公寓”标记的地点看到被撕掉的封条；刘涵只能确认顾盼已经失联，可能已经不在了。结局结束后，玩家可选择扮演刘涵；封门与落花画面快速回放，屏幕全黑显示“三天前”，再进入倒叙调查。真实公寓名称仍要在后续调查中解出。</p></div>
        <button onClick={()=>go(6)}>第二结局后，扮演刘涵继续调查</button>
      </Scene>}
      {step===6 && <Scene eyebrow="左右分屏开启" title="匿名访客">
        <p>左侧沈望快速重取国外原始证据；右侧刘涵找到QQ情侣空间。匿名留言正文残破，但异常记录保留完整IP。刘涵在浏览器搜索临川公安档案查询网站，用IP调出公共网络节点一览。</p>
        <pre>匿名访客 · 2025年11月29日 02:47\n沈望，救我。我被锁在……\n临川……17号\n……4栋 一单...402室\n异常 IP：183.214.76.119\n节点登记：青槐区长宁路117号</pre>
        <div className="route-launcher"><small>临川公安 · 公众线索协查端</small><h2>公共网络节点查询</h2><p>页面直接展示18条同期节点记录，不提供输入框、结果提示或目标行高亮；玩家需要自行比对完整IP与时段。</p><a href="/police" target="_blank" rel="noopener noreferrer">在新标签页打开档案查询网站 ↗</a></div>
        <label>结合工作地点与候选地址，输入准确住址</label><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="晴川公寓4栋1单元402室"/>
        <button disabled={answer!=="晴川公寓4栋1单元402室"} onClick={()=>go(7)}>前往拘禁现场</button>
      </Scene>}
      {step===7 && <Scene eyebrow="晴川公寓 · 4栋1单元402" title="这里发生过什么">
        <div className="evidence-wall"><Card title="突然离开" text="护照、工作证、日常衣物和复学申请全部留下"/><Card title="非法拘禁" text="门框残留外锁孔洞；三天失败网络连接"/><Card title="明确拒绝" text="撕碎合同一角：我不同意"/><Card title="紧急清理" text="局部清洁；警方完成处置后恒慕车辆进入"/><Card title="旧手机" text="匿名求救成功；后续消息上传失败"/><Card title="旧请柬" text="顾盼 × 邵明辉\n云庭酒店·锦华厅"/></div>
        <button onClick={()=>go(8)}>调查请柬</button>
      </Scene>}
      {step===8 && <Scene eyebrow="旧请柬" title="原来的新郎">
        <p>搜索显示邵明辉是邵氏实业创始人独子。2019年事故后，他长期接受康复照护，此后很少公开露面；旧采访说他性格安静，喜欢园艺和老电影，近年的生活与婚姻安排多由父母代为处理。邵家曾公开寻找“温顺、能够照顾家庭”的伴侣，云庭酒店则确认原定宴席已经取消。</p>
        <div className="source-grid"><Card title="人物搜索" text="事故后长期康复照护\n生活与婚姻多由父母安排"/><Card title="酒店档期" text="2025.12.06 锦华厅\n原预约已取消 / 当前空档"/><Card title="二维码" text="恒慕婚姻家庭服务集团\n状态：方案变更"/></div>
        <div className="route-launcher"><small>二维码识别结果 · hengmu-family.cn</small><h2>恒慕婚姻家庭服务集团</h2><p>婚恋服务、家庭顾问与会员专属服务中心。</p><a href="/hengmu" target="_blank" rel="noopener noreferrer">在新标签页打开恒慕官网 ↗</a></div>
        <button onClick={()=>go(9)}>查看婚介合同残页</button>
      </Scene>}
      {step===9 && <Scene eyebrow="婚介合同底部封边" title="摩斯电码">
        <pre>-.--  --.-  --...  ...--  -----  ....-  .----  ----.</pre>
        <label>输入解出的专属服务码</label><input value={answer} onChange={e=>setAnswer(e.target.value.toUpperCase())} placeholder="YQ-730419"/>
        <button disabled={answer.replaceAll("-","")!=="YQ730419"} onClick={()=>go(10)}>打开圆满方案</button>
      </Scene>}
      {step===10 && <Scene eyebrow="恒慕家庭顾问" title="圆满方案">
        <p>返回恒慕官网的“服务进度查询”，同时输入合同号 <b>HM-W-251206-117</b> 与刚刚解出的服务码，取得变更时间线和内部结算摘要。</p>
        <div className="dialogue"><p><b>自动客服：</b>订单 HM-W-251206-117 已进入特殊变更流程。</p><p><b>刘涵：</b>服务码 YQ-730419。查询家属委托物。</p><p><b>恒慕特别委托组：</b>委托标的已接收，恒温保存；新匹配完成。家属分成50%。</p></div>
        <p>转运单将“委托标的”写成顾盼，接收地为永安仪式园。她已经死亡；父母正在出售她的遗体。</p>
        <button onClick={()=>{addProof(4);go(11)}}>返回警方档案查询网站</button>
      </Scene>}
      {step===11 && <Scene eyebrow="临川公安 · 档案查询网站" title="让真相进入程序">
        <p>从现场物品登记表下载附件，取得档案编号 <b>LC-QH-1129-402</b>。在公安网站输入该编号后，系统直接返回两份关联警情档案，不受其他调查材料的取得进度限制。</p>
        <pre>07:46 周秀兰拨打110\n08:03 警方到达晴川公寓\n08:11 现场确认顾盼死亡\n09:26 完成现场勘验\n11:42 家属接管后续处置\n12:06 恒慕在晴川公寓接收委托标的</pre>
        <button onClick={()=>{addProof(3);go(12)}}>锁定永安仪式园</button>
      </Scene>}
      {step===12 && <Scene eyebrow="转运倒计时 03:00:00" title="最后的证据链">
        <p>搜索结果中的死亡简讯显示，31岁的梁昱于2025年11月26日因突发心源性疾病去世，生前未婚，治丧事宜由永安仪式园承办。梁家随后支付60万元购买顾盼遗体；恒慕与顾家五五分成。选择所有必须提交的证据，再要求郝倩作证。</p>
        <div className="checklist">{evidenceNames.map((x,i)=><button key={x} disabled={i===5} className={proof.includes(i)?"selected":""} onClick={()=>i<5&&addProof(i)}>{proof.includes(i)?"✓":i===5?"锁":"○"} {x}</button>)}</div>
        {proof.filter(i=>i<5).length>=5 && <button onClick={()=>go(13)}>向郝倩展示完整证据</button>}
      </Scene>}
      {step===13 && <Scene eyebrow="郝倩的选择" title="这一次，她没有再解释">
        <blockquote>“我受过伤害，但伤害她的那一步，是我自己走的。我不请求她原谅。我会把我做过的事情全部说出来。”</blockquote>
        <p>郝倩自首并出庭。警方在转运前进入永安仪式园，阻止冥婚。顾盼父母和直接参与者被追责，韩铎的国内外犯罪链被连接。</p>
        <button onClick={()=>{addProof(5);localStorage.setItem("jia-game-cleared","true");go(14)}}>进入真结局</button>
      </Scene>}
      {step===14 && <Scene eyebrow="真结局 · 向阳而生" title="她终于以自己的名字被看见">
        <div className="asset-slot large">后续图片素材：未迟书店画展 / 《向阳处》系列 / 空着的右侧位置</div>
        <p>顾盼的画作在“未迟”展出。沈望没有替她活着，而是带着她曾经活过的证明，继续两人没有完成的旅行。`HengMu`仍有节点运行，也有人开始盯上他。</p>
        <p>完成刘涵线后会出现两条独立的结局入口：读完《希望_未寄出.txt》，从信末直接进入隐藏结局“镜花水月”；回到刘涵微信，冒充女方家属套取电子请柬，再从临川地图前往仪式地点，则进入第三结局“嫁”。</p>
      </Scene>}
      </main>
    </div>
  </div>;
}

function Scene({ eyebrow,title,children }:{eyebrow:string;title:string;children:React.ReactNode}){return <section className="investigation-scene"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children}</section>}
function Card({title,text}:{title:string;text:string}){return <article className="case-card"><b>{title}</b><p>{text.split("\n").map((x,i)=><span key={i}>{x}</span>)}</p></article>}
