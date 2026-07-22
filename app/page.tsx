"use client";

import { useEffect, useMemo, useState } from "react";

type AppId = "wechat" | "mail" | "memo" | "files" | "browser" | "archive";
type Evidence = "letter" | "draft" | "laptop" | "invoice" | "drug";

const chapters = [
  ["序", "迟到的婚讯"],
  ["一", "她为何离开"],
  ["二", "无人查收的信"],
  ["三", "HengMu"],
  ["再", "第二次机会"],
  ["四", "她去了哪里"],
  ["五", "方案变更"],
  ["终", "向阳而生"],
];

const chatLines = [
  { who: "刘涵", text: "你还记得顾盼吧？" },
  { who: "刘涵", text: "我妈今天说在小区见到她爸妈了。听他们那意思，顾盼可能回国了，好像快结婚了。" },
  { who: "沈望", text: "原来已经过去这么久了。" },
  { who: "沈望", text: "蛮好的。祝福她。" },
];

const storyMap = [
  { title: "第一周目 · 国外", body: "沈望在72小时内赶往北港寄存中心，取回顾盼的旧电脑、郝倩的破损密信与未兑现的2万美元本票。他从治疗订单、微信备份和留学生互助会后台，查明顾盼曾救助郝倩，也因此成为团伙目标。" },
  { title: "迟来的回望", body: "管理员后台将顾盼标记为 HM-2217。郝倩已经结婚，面对密信与照片仍拒绝作证。沈望终于知道顾盼为什么离开，却在回国后发现所谓婚礼已经完成，遗体不知所踪。" },
  { title: "第二周目 · 双线", body: "玩家保留第一周目的记忆。左侧沈望快速重取国外证据；右侧刘涵从QQ情侣空间的匿名留言、完整IP与残破地址交叉定位晴川公寓。双桌面从这里同步推进。" },
  { title: "方案变更", body: "刘涵在拘禁现场找到旧请柬。新郎邵明辉来自当地富豪家庭，原宴席已经取消。请柬二维码通向恒慕官网；撕碎变更单底部的摩斯封边给出服务码 YQ-730419。" },
  { title: "真相与结局", body: "合同号、服务码和付款记录解锁“圆满方案”。警方朋友陈放把中断接警、恒慕车辆与永安礼仪园纳入正式调查。证据完整则阻止冥婚、说服郝倩自首，进入《向阳而生》；集齐信物后进入《镜花水月》。" },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [phase, setPhase] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [seen, setSeen] = useState<Evidence[]>([]);
  const [password, setPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState(false);
  const [laptopOpen, setLaptopOpen] = useState(false);
  const [weekTwo, setWeekTwo] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("jia-prototype");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPhase(data.phase ?? 0);
        setSeen(data.seen ?? []);
        setLaptopOpen(data.laptopOpen ?? false);
        setWeekTwo(data.weekTwo ?? false);
      } catch {}
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("jia-prototype", JSON.stringify({ phase, seen, laptopOpen, weekTwo }));
  }, [phase, seen, laptopOpen, weekTwo]);

  const addEvidence = (item: Evidence) => {
    setSeen((old) => (old.includes(item) ? old : [...old, item]));
  };

  const objective = useMemo(() => {
    if (weekTwo) return "同步取得国内外证据，在转运前找到顾盼";
    if (laptopOpen) return "查明顾盼离开前经历了什么";
    if (phase >= 3) return "整理 B-17 寄存仓中的物品";
    if (phase >= 2) return "在72小时内前往北港寄存中心";
    return "阅读刘涵发来的消息";
  }, [phase, laptopOpen, weekTwo]);

  const open = (app: AppId) => {
    setActiveApp(app);
    if (app === "wechat" && phase === 0) {
      setPhase(1);
      window.setTimeout(() => {
        setNotice("北港寄存中心：B-17 三年保管期限即将结束");
        setPhase(2);
      }, 900);
    }
  };

  const reset = () => {
    window.localStorage.removeItem("jia-prototype");
    setPhase(0); setSeen([]); setLaptopOpen(false); setWeekTwo(false);
    setActiveApp(null); setNotice(null); setPassword("");
  };

  if (!started) {
    return (
      <main className="landing">
        <div className="grain" />
        <section className="title-card">
          <p className="eyebrow">一部双周目网页调查叙事</p>
          <h1>嫁</h1>
          <p className="tagline">左边有人等，右边有人回头。</p>
          <div className="content-note">
            本作涉及性侵、药物控制、受害者指责、非法拘禁与死亡。内容以文字和证据呈现，不展示侵害画面。
          </div>
          <button className="primary" onClick={() => setStarted(true)}>进入沈望的电脑</button>
          <button className="text-button" onClick={() => { setStarted(true); setShowMap(true); }}>查看文字逻辑初稿</button>
          <p className="desktop-note">建议使用电脑与耳机 · 进度保存在当前浏览器</p>
        </section>
      </main>
    );
  }

  return (
    <main className={`desktop ${weekTwo ? "week-two" : ""}`}>
      <div className="wallpaper-mark">望</div>
      <header className="system-bar">
        <div className="brand-mark">嫁 / JIA</div>
        <div className="chapter-label">{weekTwo ? "第二周目 · 左望右盼" : "第一周目 · 她为何离开"}</div>
        <div className="system-actions">
          <button onClick={() => setShowMap(true)}>故事图谱</button>
          <button onClick={reset}>重置</button>
          <time>2025.12.03&nbsp;&nbsp;21:18</time>
        </div>
      </header>

      {weekTwo ? (
        <div className="split-stage">
          <DesktopPane side="left" name="沈望 · 国外" task="取回原始证据 / 说服郝倩作证" />
          <div className="sync-line"><span>协作中</span></div>
          <DesktopPane side="right" name="刘涵 · 国内" task="定位晴川公寓 / 追查圆满方案" />
        </div>
      ) : (
        <>
          <section className="icon-grid" aria-label="桌面应用">
            <DesktopIcon label="微信" symbol="聊" badge={phase === 0} onClick={() => open("wechat")} />
            <DesktopIcon label="邮箱" symbol="邮" badge={phase >= 2} onClick={() => open("mail")} />
            <DesktopIcon label="备忘录" symbol="记" onClick={() => open("memo")} />
            <DesktopIcon label="B-17 寄存仓" symbol="箱" locked={phase < 3} onClick={() => phase >= 3 && open("files")} />
            <DesktopIcon label="浏览器" symbol="网" locked={!laptopOpen} onClick={() => laptopOpen && open("browser")} />
            <DesktopIcon label="调查档案" symbol="档" onClick={() => open("archive")} />
          </section>

          <aside className="memo-widget">
            <div className="paperclip" />
            <p className="widget-label">当前目标</p>
            <h2>{objective}</h2>
            <div className="rule" />
            <p className="widget-label">已确认</p>
            <ul>
              {phase >= 1 && <li>顾盼可能已经回国</li>}
              {phase >= 2 && <li>B-17 寄存仓将在72小时后清理</li>}
              {seen.includes("draft") && <li>2万美元本票从未兑现</li>}
              {seen.includes("letter") && <li>郝倩隐瞒了一件无法原谅的事</li>}
              {laptopOpen && <li>顾盼保存了加密调查资料</li>}
            </ul>
            <blockquote>{laptopOpen ? "她试着告诉过我。是我没有让她说完。" : "她已经有新的生活了。把东西收好，就回来。"}</blockquote>
          </aside>
        </>
      )}

      {notice && (
        <button className="notification" onClick={() => { setNotice(null); open("mail"); }}>
          <span>新邮件</span><strong>{notice}</strong><small>点击查看</small>
        </button>
      )}

      {activeApp && !weekTwo && (
        <div className="window-shell" role="dialog" aria-modal="true">
          <div className="window-top">
            <span>{appTitle(activeApp)}</span>
            <button aria-label="关闭窗口" onClick={() => setActiveApp(null)}>×</button>
          </div>
          <div className="window-body">
            {activeApp === "wechat" && <WeChat phase={phase} />}
            {activeApp === "mail" && <Mail onTravel={() => { setPhase(3); setActiveApp("files"); setNotice(null); }} />}
            {activeApp === "memo" && <Memo objective={objective} weekTwo={weekTwo} />}
            {activeApp === "files" && (
              <Storage
                seen={seen}
                addEvidence={addEvidence}
                onLaptop={() => { addEvidence("laptop"); }}
                password={password}
                setPassword={setPassword}
                hint={passwordHint}
                laptopOpen={laptopOpen}
                unlock={() => {
                  if (password === "20181021") { setLaptopOpen(true); setPhase(4); }
                  else setPasswordHint(true);
                }}
              />
            )}
            {activeApp === "browser" && <Browser addEvidence={addEvidence} seen={seen} />}
            {activeApp === "archive" && <Archive seen={seen} laptopOpen={laptopOpen} onWeekTwo={() => { setWeekTwo(true); setActiveApp(null); }} />}
          </div>
        </div>
      )}

      {showMap && (
        <div className="map-overlay">
          <section className="story-map">
            <button className="map-close" onClick={() => setShowMap(false)}>关闭 ×</button>
            <p className="eyebrow">逻辑与文字初稿</p>
            <h2>《嫁》叙事骨架</h2>
            <div className="chapter-strip">
              {chapters.map(([num, title]) => <div key={num}><b>{num}</b><span>{title}</span></div>)}
            </div>
            <div className="map-grid">
              {storyMap.map((item, i) => <article key={item.title}><span>0{i + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function DesktopIcon({ label, symbol, badge, locked, onClick }: { label: string; symbol: string; badge?: boolean; locked?: boolean; onClick: () => void }) {
  return <button className={`desktop-icon ${locked ? "locked" : ""}`} onDoubleClick={onClick} onClick={onClick}>
    <span className="icon-tile">{symbol}</span><span>{label}</span>{badge && <i />}
  </button>;
}

function WeChat({ phase }: { phase: number }) {
  return <div className="chat-layout">
    <aside className="chat-list"><div className="avatar">刘</div><div><b>刘涵</b><p>蛮好的。祝福她。</p></div></aside>
    <section className="conversation">
      <header>刘涵 <small>大学发小</small></header>
      <div className="messages">
        {chatLines.map((line, i) => <div className={`bubble-row ${line.who === "沈望" ? "mine" : ""}`} key={i}><span>{line.who[0]}</span><p>{line.text}</p></div>)}
        {phase >= 2 && <div className="bubble-row"><span>刘</span><p>当年那个寄存仓？去一趟吧，把该收的都收回来。也算和过去告个别。</p></div>}
      </div>
    </section>
  </div>;
}

function Mail({ onTravel }: { onTravel: () => void }) {
  return <div className="mail-view">
    <p className="mail-meta">北港寄存中心 &lt;notice@northharbor-storage.example&gt;</p>
    <h2>B-17号寄存仓最终到期通知</h2>
    <div className="countdown"><span>剩余时间</span><strong>71 : 42 : 18</strong></div>
    <p>三年保管期限即将结束。登记人：顾盼；授权取件人：沈望。逾期物品将按照协议统一清理。</p>
    <div className="mail-quote">“你又不是去找她。你是去处理你自己的东西。”——刘涵</div>
    <button className="primary dark" onClick={onTravel}>确认行程 · 前往北港</button>
  </div>;
}

function Memo({ objective }: { objective: string; weekTwo: boolean }) {
  return <div className="full-memo"><p>当前目标</p><h2>{objective}</h2><hr/><p>沈望的记录</p><blockquote>原来已经过去这么久了。蛮好的，祝福她。</blockquote></div>;
}

function Storage({ seen, addEvidence, onLaptop, password, setPassword, hint, laptopOpen, unlock }: {
  seen: Evidence[]; addEvidence: (e: Evidence) => void; onLaptop: () => void; password: string; setPassword: (v: string) => void; hint: boolean; laptopOpen: boolean; unlock: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  return <div className="storage-view">
    <aside className="evidence-shelf">
      <button onClick={() => { setSelected("letter"); addEvidence("letter"); }}>破损信封 <small>{seen.includes("letter") ? "已查看" : "未查看"}</small></button>
      <button onClick={() => { setSelected("draft"); addEvidence("draft"); }}>本票信封 <small>{seen.includes("draft") ? "已查看" : "未查看"}</small></button>
      <button onClick={() => { setSelected("laptop"); onLaptop(); }}>顾盼的旧电脑 <small>{laptopOpen ? "已解锁" : "已休眠"}</small></button>
      <button onClick={() => setSelected("memento")}>艺术展合照 <small>2018.10.21</small></button>
    </aside>
    <section className="evidence-detail">
      {!selected && <div className="empty-state"><span>B-17</span><p>请选择一件物品进行整理</p></div>}
      {selected === "letter" && <article><p className="stamp">退件 · 2022</p><h2>寄件人：郝倩</h2><p>信封底部已经破损，信纸从里面滑了出来。</p><blockquote>“如果你不能原谅我，请至少知道我的痛苦……但请相信我，这并不全是我的错。”</blockquote><p>沈望听顾盼提过这个名字，但从未见过她。</p></article>}
      {selected === "draft" && <article><p className="stamp">未兑现</p><h2>USD 20,000</h2><p>一张已经失效的银行本票。付款方是一家空壳咨询公司，备注只有：</p><code>HM-2217</code><blockquote>“收下它。忘记那天晚上。这对所有人都好。”</blockquote></article>}
      {selected === "memento" && <article><p className="stamp">隐藏信物 01</p><h2>左望右盼</h2><p>校园艺术展开幕合照。沈望站在画面左边，顾盼站在右边。</p><code>2018-10-21_左望右盼.jpg</code><p>照片背面：今天开始，不再只是搭档。</p></article>}
      {selected === "laptop" && <article className="laptop-lock"><p className="stamp">GU PAN · LOCAL DEVICE</p><h2>{laptopOpen ? "欢迎回来，顾盼" : "输入密码"}</h2>{!laptopOpen ? <><input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="八位数字" maxLength={8}/><button className="primary dark" onClick={unlock}>解锁</button>{hint && <p className="hint">密码提示：恋爱纪念日</p>}</> : <><div className="folder-list"><span>回国材料</span><span>画</span><span>待整理</span><span>微信备份 🔒</span></div><p>桌面里有大量加密内容。浏览器历史仍保留一笔治疗订单。</p></>}</article>}
    </section>
  </div>;
}

function Browser({ addEvidence, seen }: { addEvidence: (e: Evidence) => void; seen: Evidence[] }) {
  const [query, setQuery] = useState("");
  const found = /harbor|港湾/i.test(query);
  return <div className="browser-view"><div className="address"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索 Harborwell Behavioral Services"/></div>
    {!found ? <section className="invoice"><p>最近浏览</p><h2>治疗订单 #HW-220214-HQ</h2><dl><dt>付款人</dt><dd>GU PAN</dd><dt>项目</dt><dd>Residential Treatment Program</dd><dt>入住人</dt><dd>H. Q.</dd><dt>金额</dt><dd>$12,480</dd></dl><button onClick={() => { setQuery("Harborwell Behavioral Services"); addEvidence("invoice"); }}>搜索机构名称</button></section> : <section className="search-results"><p>搜索结果</p><h2>Harborwell Behavioral Services</h2><p>提供药物依赖、戒断管理与28天住院支持的行为健康机构。出于隐私保护，公开页面不展示患者诊断。</p><div className="result-card"><b>Residential Treatment Program</b><span>药物依赖住院治疗 · 28天</span></div><button className="primary dark" onClick={() => addEvidence("drug")}>{seen.includes("drug") ? "已加入备忘录" : "确认线索：H.Q.可能是郝倩"}</button></section>}
  </div>;
}

function Archive({ seen, laptopOpen, onWeekTwo }: { seen: Evidence[]; laptopOpen: boolean; onWeekTwo: () => void }) {
  return <div className="archive-view"><p className="eyebrow">调查原型 · 当前完成度</p><h2>{Math.min(100, seen.length * 16 + (laptopOpen ? 20 : 0))}%</h2><div className="progress"><i style={{ width: `${Math.min(100, seen.length * 16 + (laptopOpen ? 20 : 0))}%` }} /></div>
    <h3>一周目核心证据</h3><ul><li className={seen.includes("letter") ? "done" : ""}>郝倩的破损密信</li><li className={seen.includes("draft") ? "done" : ""}>未兑现的2万美元本票</li><li className={laptopOpen ? "done" : ""}>顾盼旧电脑</li><li className={seen.includes("drug") ? "done" : ""}>隐晦治疗订单</li></ul>
    <p className="prototype-note">文字初稿已接入完整故事骨架。后续将在这里继续加入微信备份、学生身份伪造、黑话字典、管理员后台与郝倩对质。</p>
    {laptopOpen && seen.includes("letter") && seen.includes("draft") && <button className="primary dark" onClick={onWeekTwo}>预览第二周目双屏框架</button>}
  </div>;
}

function DesktopPane({ side, name, task }: { side: string; name: string; task: string }) {
  const items = side === "left" ? ["顾盼旧电脑", "CorpusLens", "郝倩密信", "管理员后台"] : ["QQ情侣空间", "临川地图", "恒慕官网", "陈放"];
  return <section className={`desktop-pane ${side}`}><header><span>{name}</span><small>{task}</small></header><div className="pane-icons">{items.map((x, i) => <button key={x}><b>{["证", "译", "信", "网"][i]}</b><span>{x}</span></button>)}</div><aside className="pane-memo"><p>当前目标</p><strong>{task}</strong><small>{side === "left" ? "剩余 71:42:18" : "转运倒计时尚未确认"}</small></aside></section>;
}

function appTitle(app: AppId) {
  return ({ wechat: "微信", mail: "邮箱", memo: "备忘录", files: "北港寄存中心 · B-17", browser: "浏览器", archive: "调查档案" })[app];
}
