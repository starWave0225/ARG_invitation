"use client";

import { useEffect, useState } from "react";

const evidenceNames = ["顾盼的高风险标记", "酒吧后台照片", "境外网站结算", "顾父中断报警", "恒慕转运单", "郝倩完整证词"];

export function FullInvestigation({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [proof, setProof] = useState<number[]>([]);
  const [mementos, setMementos] = useState(1);
  useEffect(()=>{ const n=Number(localStorage.getItem("jia-full-step")||0); const timer=window.setTimeout(()=>setStep(n),0); return ()=>window.clearTimeout(timer); },[]);
  const go=(n:number)=>{setStep(n);setAnswer("");localStorage.setItem("jia-full-step",String(n));};
  const addProof=(n:number)=>setProof(p=>p.includes(n)?p:[...p,n]);

  return <div className="full-investigation">
    <header><button onClick={onClose}>← 返回桌面</button><div><b>案件 HM-2217</b><span>{step < 5 ? "第一周目 · 国外" : "第二周目 · 左望右盼"}</span></div><small>证据 {proof.length}/6 · 信物 {mementos}/10</small></header>
    <main>
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
        <p>置顶消息经黑话翻译后给出共享后台凭据。后台没有展示侵害视频，只保留足以举证的索引、日志和照片。</p>
        <div className="evidence-wall"><Card title="HM-2217" text="GU PAN\n非成员 / 干扰者 / 高风险"/><Card title="营救记录" text="顾盼独自带走 H.Q.\n监控正脸已入库"/><Card title="现场照片" text="[图片素材槽]\n郝倩瘫坐在摄像机后方"/><Card title="钥匙记录" text="H.Q.随车返回\n使用备用钥匙开门"/></div>
        <button onClick={()=>{addProof(0);addProof(1);go(4)}}>导出日志并寻找郝倩</button>
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
  </div>;
}

function Scene({ eyebrow,title,children }:{eyebrow:string;title:string;children:React.ReactNode}){return <section className="investigation-scene"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children}</section>}
function Card({title,text}:{title:string;text:string}){return <article className="case-card"><b>{title}</b><p>{text.split("\n").map((x,i)=><span key={i}>{x}</span>)}</p></article>}
