"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FullInvestigation } from "./FullInvestigation";

type AppId = "wechat" | "mail" | "memo" | "files" | "browser" | "archive" | "guFiles" | "guWechat" | "full";
type Evidence = "letter" | "draft" | "laptop" | "invoice" | "drug" | "betrayal" | "breakup" | "medical";
type GameMode = "normal" | "hardcore";

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
  { title: "第一周目 · 国外", body: "沈望在72小时内赶往海外城市 North Harbor（北港）的寄存中心，取回顾盼的旧电脑、郝倩的破损密信与艺术展合照；未兑现的2万美元本票则藏在旧电脑文件中。他从治疗订单、微信备份和留学生互助会后台，查明顾盼曾救助郝倩，也因此成为团伙目标。" },
  { title: "迟来的回望", body: "管理员后台将顾盼标记为 HM-2217。郝倩已经结婚，面对密信与照片仍拒绝作证。沈望终于知道顾盼为什么离开，却在回国后发现所谓婚礼已经完成，遗体不知所踪。" },
  { title: "第二周目 · 双线", body: "玩家保留第一周目的记忆。左侧沈望快速重取国外证据；右侧刘涵从QQ情侣空间的匿名留言、完整IP与残破地址交叉定位晴川公寓。双桌面从这里同步推进。" },
  { title: "方案变更", body: "刘涵在拘禁现场找到旧请柬。新郎邵明辉来自当地富豪家庭，原宴席已经取消。请柬二维码通向恒慕官网；撕碎变更单底部的摩斯封边给出服务码 YQ-730419。" },
  { title: "真相与结局", body: "合同号、服务码和付款记录解锁“圆满方案”。警方朋友陈放把中断接警、恒慕车辆与永安礼仪园纳入正式调查。读完刘涵线最后两份警方档案后，顾盼旧电脑会恢复一封被删除的绝笔信；信末通向隐藏结局《镜花水月》。" },
];

export default function Home() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [choosingMode, setChoosingMode] = useState(false);
  const [openingPlaying, setOpeningPlaying] = useState(false);
  const [menuReady, setMenuReady] = useState(false);
  const [gameCleared, setGameCleared] = useState(false);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [phase, setPhase] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [seen, setSeen] = useState<Evidence[]>([]);
  const [password, setPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState(false);
  const [laptopOpen, setLaptopOpen] = useState(false);
  const [device, setDevice] = useState<"shen" | "gu">("shen");
  const [weekTwo, setWeekTwo] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const enterGame=(mode:GameMode)=>{
    window.localStorage.setItem("jia-game-mode",mode);
    router.push("/computer/shen");
  };

  const finishOpening=()=>{
    setOpeningPlaying(false);
    setChoosingMode(false);
    setMenuReady(true);
    window.dispatchEvent(new Event("jia-opening-music-menu"));
  };

  const playOpening = () => {
    if(openingPlaying||menuReady)return;
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      setMenuReady(true);
      return;
    }
    setOpeningPlaying(true);
    window.dispatchEvent(new Event("jia-opening-music-play"));
  };

  const startGame = (mode: GameMode) => enterGame(mode);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setGameCleared(
        window.localStorage.getItem("jia-game-cleared") === "true" ||
        Number(window.localStorage.getItem("jia-full-step") || 0) >= 14
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("jia-prototype");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const timer = window.setTimeout(() => {
          setPhase(data.phase ?? 0);
          setSeen(data.seen ?? []);
          setLaptopOpen(data.laptopOpen ?? false);
          setDevice(data.device ?? "shen");
          setWeekTwo(data.weekTwo ?? false);
        }, 0);
        return () => window.clearTimeout(timer);
      } catch {}
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("jia-prototype", JSON.stringify({ phase, seen, laptopOpen, weekTwo, device }));
  }, [phase, seen, laptopOpen, weekTwo, device]);

  const addEvidence = (item: Evidence) => {
    setSeen((old) => (old.includes(item) ? old : [...old, item]));
  };

  const objective = useMemo(() => {
    if (weekTwo) return "同步取得国内外证据，在转运前找到顾盼";
    if (device === "gu") return seen.includes("drug") ? "恢复顾盼的微信聊天备份" : "调查 H.Q. 的治疗订单";
    if (laptopOpen) return "查明顾盼离开前经历了什么";
    if (phase >= 3) return "整理 B-17 寄存仓中的物品";
    if (phase >= 2) return "在72小时内前往海外北港寄存中心";
    return "阅读刘涵发来的消息";
  }, [phase, laptopOpen, weekTwo, device, seen]);

  const open = (app: AppId) => {
    setActiveApp(app);
    if (app === "wechat" && phase === 0) {
      setPhase(1);
      window.setTimeout(() => {
        setNotice("North Harbor（海外）寄存中心：B-17 三年保管期限即将结束");
        setPhase(2);
      }, 900);
    }
  };

  const reset = () => {
    for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith("jia-")) window.localStorage.removeItem(key);
    }
    for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = window.sessionStorage.key(index);
      if (key?.startsWith("jia-")) window.sessionStorage.removeItem(key);
    }
    setPhase(0); setSeen([]); setLaptopOpen(false); setWeekTwo(false); setDevice("shen");
    setActiveApp(null); setNotice(null); setPassword("");
  };

  if (!started) {
    return (
      <main className="landing">
        <div className="grain" />
        {!menuReady&&!openingPlaying&&(
          <button
            type="button"
            className="opening-gate"
            onClick={playOpening}
            aria-label="点击播放《嫁》游戏片头"
          >
            <span>嫁</span>
            <b>点击进入</b>
            <small>CLICK TO BEGIN · 建议使用耳机</small>
          </button>
        )}
        {openingPlaying&&<OpeningSequence onSkip={finishOpening}/>}
        {menuReady&&<section className="title-card main-menu-ready">
          <p className="eyebrow">本格网页调查叙事</p>
          <h1>嫁</h1>
          <div className="content-note">
            本作涉及所有违法情节均为虚构和游戏创作。<br/>
            敏感内容以文字和证据呈现，不展示、生成实际画面。
          </div>
          {!choosingMode ? <>
            <button className="primary" onClick={()=>setChoosingMode(true)}>开始游戏</button>
            <button className="text-button" disabled={!gameCleared} title={gameCleared?"打开文字逻辑初稿":"完成真结局后解锁"} onClick={() => { if(gameCleared){setStarted(true);setShowMap(true)} }}>查看文字逻辑初稿（只在通关后可用）</button>
          </> : <section className="game-mode-select" aria-label="选择游戏模式">
            <header><button type="button" onClick={()=>setChoosingMode(false)}>← 返回</button><span>选择游戏模式</span></header>
            <div>
              <button type="button" className="normal" onClick={()=>startGame("normal")}><small>NORMAL</small><b>通灵模式</b><p>桌面会显示提示，指引当前目标与调查方向。</p></button>
              <button type="button" className="hardcore" onClick={()=>startGame("hardcore")}><small>HARDCORE</small><b>真实模式</b><p>无额外提示。真实模拟主角面对的调查困境，并展示你的推理能力。</p><em>别紧张，你随时可以回到主选单再次选择</em></button>
            </div>
            <p>两种模式的剧情、谜题和结局分叉完全相同。</p>
          </section>}
          <p className="desktop-note">建议使用电脑与耳机 · 进度保存在当前浏览器</p>
        </section>}
      </main>
    );
  }

  return (
    <main className={`desktop ${weekTwo ? "week-two" : ""} ${device === "gu" ? "gu-desktop" : ""}`}>
      <div className="wallpaper-mark">{device === "gu" ? "盼" : "望"}</div>
      <header className="system-bar">
        <div className="brand-mark">{device === "gu" ? "GU PAN · LOCAL DEVICE" : "嫁 / JIA"}</div>
        <div className="chapter-label">{weekTwo ? "第二周目 · 左望右盼" : device === "gu" ? "旧电脑 · 最后同步于 2022" : "第一周目 · 她为何离开"}</div>
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
            {device === "shen" ? <>
              <DesktopIcon label="微信" symbol="聊" badge={phase === 0} onClick={() => open("wechat")} />
              <DesktopIcon label="邮箱" symbol="邮" badge={phase >= 2} onClick={() => open("mail")} />
              <DesktopIcon label="备忘录" symbol="记" onClick={() => open("memo")} />
              <DesktopIcon label="B-17 寄存仓" symbol="箱" locked={phase < 3} onClick={() => phase >= 3 && open("files")} />
              <DesktopIcon label="调查档案" symbol="档" onClick={() => open("archive")} />
            </> : <>
              <DesktopIcon label="个人文件" symbol="文" onClick={() => open("guFiles")} />
              <DesktopIcon label="浏览器" symbol="网" onClick={() => open("browser")} />
              <DesktopIcon label="微信" symbol="聊" locked={!seen.includes("drug")} onClick={() => seen.includes("drug") && open("guWechat")} />
              <DesktopIcon label="调查档案" symbol="档" onClick={() => open("archive")} />
              <DesktopIcon label="返回沈望电脑" symbol="望" onClick={() => { setDevice("shen"); setActiveApp(null); }} />
            </>}
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
              {device === "gu" && <li>最后同步时间停在2022年</li>}
            </ul>
            <blockquote>{device === "gu" ? "这不是她留给我的遗书。这是一场没有完成的调查。" : laptopOpen ? "她试着告诉过我。是我没有让她说完。" : "她已经有新的生活了。把东西收好，就回来。"}</blockquote>
          </aside>
        </>
      )}

      {notice && (
        <button className="notification" onClick={() => { setNotice(null); open("mail"); }}>
          <span>新邮件</span><strong>{notice}</strong><small>点击查看</small>
        </button>
      )}

      {activeApp && !weekTwo && (
        <div className={`window-shell ${activeApp === "full" ? "full-window" : ""}`} role="dialog" aria-modal="true">
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
            {activeApp === "guFiles" && <GuFiles addEvidence={addEvidence} />}
            {activeApp === "guWechat" && <WeChatBackup seen={seen} addEvidence={addEvidence} />}
            {activeApp === "browser" && <Browser addEvidence={addEvidence} seen={seen} />}
            {activeApp === "archive" && <Archive seen={seen} laptopOpen={laptopOpen} onWeekTwo={() => { setWeekTwo(true); setActiveApp(null); }} onFull={()=>setActiveApp("full")} />}
            {activeApp === "full" && <FullInvestigation onClose={()=>setActiveApp(null)} />}
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

function OpeningSequence({onSkip}:{onSkip:()=>void}){
  const [titleReady,setTitleReady]=useState(false);

  useEffect(()=>{
    const timer=window.setTimeout(()=>setTitleReady(true),47250);
    return ()=>window.clearTimeout(timer);
  },[]);

  return <section className="opening-sequence" role="dialog" aria-modal="true" aria-label="《嫁》片头演出">
    <button type="button" className="opening-skip" onClick={onSkip}>跳过片头　↗</button>
    <div className="opening-rule" aria-hidden="true"/>
    <div className="opening-beat-cut" aria-hidden="true"/>

    <div className="opening-scene opening-typewriter" aria-hidden="true">
      <div className="opening-material-photo opening-material-message">
        <img src="/memories/breakup-message-2022.png" alt=""/>
      </div>
      <div className="opening-keys">
        {["0","3",":","4","2"].map((letter,index)=><span style={{"--key-index":index} as React.CSSProperties} key={`${letter}-${index}`}>{letter}</span>)}
      </div>
      <p>最后交谈时间</p>
      <b>有人在凌晨告别</b>
    </div>

    <div className="opening-scene opening-pages" aria-hidden="true">
      <div className="opening-document-cascade">
        {[
          "/evidence/b17-expiry-notice.png",
          "/evidence/gupan-temporary-leave.png",
          "/evidence/hao-qian-letter.png",
          "/evidence/gupan-family-chat-backup.png",
        ].map((src,index)=><img src={src} alt="" style={{"--doc-index":index} as React.CSSProperties} key={src}/>)}
      </div>
      <div className="opening-falling-mark">？</div>
      <p>两段时间线　不同版本的故事　消失的爱人</p>
    </div>

    <div className="opening-scene opening-clues" aria-hidden="true">
      <div className="opening-clue-materials">
        <img src="/evidence/b17-inventory.png" alt=""/>
        <img src="/evidence/bank-draft-hm-2217.png" alt=""/>
        <img src="/evidence/hao-qian-letter.png" alt=""/>
      </div>
      <div className="opening-clue opening-clue-storage"><small>寄存仓</small><b>B-17</b><span>FINAL NOTICE</span></div>
      <div className="opening-clue opening-clue-draft"><small>PAY TO</small><b>$20,000</b><span>VOID · HM-2217</span></div>
      <div className="opening-clue opening-clue-envelope"><i>退</i><b>无人查收</b><span>RETURN TO SENDER</span></div>
      <div className="opening-thread"/>
      <p>每件留下的东西　都在代她说话</p>
    </div>

    <div className="opening-scene opening-generated opening-generated-evidence" aria-hidden="true">
      <img src="/opening/evidence-table.png" alt=""/>
      <div className="opening-generated-copy">
        <small>ITEMS RETURNED AS-IS</small>
        <b>遗忘在回忆的爱人</b>
        <p>一封没有送到的信　一段无疾而终的感情</p>
      </div>
    </div>

    <div className="opening-scene opening-generated opening-generated-memory" aria-hidden="true">
      <img className="opening-memory-before" src="/opening/fractured-memory.png" alt=""/>
      <img className="opening-memory-after" src="/opening/fractured-memory-neutral.png" alt=""/>
      <div className="opening-generated-copy">
        <small>2018.10.21</small>
        <b>左望，右盼</b>
        <p>照片记得那一天　后来发生了什么</p>
      </div>
    </div>

    <div className="opening-scene opening-generated opening-generated-corridor" aria-hidden="true">
      <img src="/opening/paper-corridor.png" alt=""/>
      <div className="opening-generated-copy">
        <small>RECORDS DO NOT TELL THE WHOLE STORY</small>
        <b>是暂时离开？　是再也不见。</b>
        <p>同一个名字　出现在两段不同的故事里</p>
      </div>
    </div>

    <div className="opening-scene opening-dual" aria-hidden="true">
      <div className="opening-half left"><div className="opening-portrait"><img src="/characters/shen-wang.png" alt=""/></div><b>望</b><small>2025 · 海外 · 北港</small></div>
      <div className="opening-half right"><div className="opening-portrait"><img src="/characters/gu-pan.png" alt=""/></div><b>盼</b><small>2022 · 最后讯息</small></div>
      <p>同一段过去　两种看见真相的方式</p>
    </div>

    <div className="opening-scene opening-pixel opening-pixel-parallel" aria-hidden="true">
      <div className="pixel-horizon"/>
      <div className="pixel-sprite pixel-shen pose-walk pixel-parallel-shen"/>
      <div className="pixel-sprite pixel-gupan pose-walk pixel-parallel-gupan"/>
      <div className="pixel-caption"><small>2018 → 2022 → 2025</small><b>他们在不同的时间里继续向前</b></div>
    </div>

    <div className="opening-scene opening-pixel opening-pixel-messages" aria-hidden="true">
      <div className="pixel-sprite pixel-shen pose-document pixel-message-shen"/>
      <div className="pixel-sprite pixel-gupan pose-document pixel-message-gupan"/>
      <div className="pixel-message-stack left"><i/><i/><i/><i/></div>
      <div className="pixel-message-stack right"><i/><i/><i/></div>
      <div className="pixel-caption"><small>未接通　未发送　未说完</small><b>这次，由你发现潜藏在输入框后的秘密</b></div>
    </div>

    <div className="opening-scene opening-pixel opening-pixel-path" aria-hidden="true">
      <div className="pixel-sprite pixel-shen pose-stand pixel-path-shen"/>
      <div className="pixel-sprite pixel-gupan pose-stand pixel-path-gupan"/>
      <div className="pixel-red-path"/>
      <div className="pixel-caption"><small>也许　我可以帮你什么</small><b>将没有说完的故事　续写</b></div>
    </div>

    <div className="opening-scene opening-pixel opening-pixel-return" aria-hidden="true">
      <div className="pixel-return-memory left"><img src="/memories/art-show-2018.png" alt=""/></div>
      <div className="pixel-return-memory right"><img src="/memories/airport-goodbye-2022.png" alt=""/></div>
      <div className="pixel-return-rule"/>
      <div className="pixel-sprite pixel-shen pose-turn pixel-return-shen"/>
      <div className="pixel-sprite pixel-gupan pose-turn pixel-return-gupan"/>
      <div className="pixel-caption"><small>现在　过去</small><b>如果那时有人回头</b></div>
    </div>

    <div className="opening-scene opening-title-reveal" aria-hidden={!titleReady}>
      <div className="opening-radicals"><span>女</span><span>家</span></div>
      <button type="button" className="opening-title-button" disabled={!titleReady} onClick={onSkip} aria-label="进入主菜单">嫁</button>
      <small>BYE BYE, BABY BLUE</small>
      <em>AN INTERACTIVE MYSTERY</em>
    </div>
  </section>;
}

function DesktopIcon({ label, symbol, badge, locked, onClick }: { label: string; symbol: string; badge?: boolean; locked?: boolean; onClick: () => void }) {
  return <button className={`desktop-icon ${locked ? "locked" : ""}`} onDoubleClick={onClick} onClick={onClick}>
    <span className="icon-tile">{symbol}</span><span>{label}</span>{badge && <i />}
  </button>;
}

function WeChat({ phase }: { phase: number }) {
  return <div className="chat-layout">
    <aside className="chat-list"><img className="avatar" src="/characters/liu-han.png" alt="刘涵"/><div><b>刘涵</b><p>蛮好的。祝福她。</p></div></aside>
    <section className="conversation">
      <header>刘涵 <small>大学发小</small></header>
      <div className="messages">
        {chatLines.map((line, i) => <div className={`bubble-row ${line.who === "沈望" ? "mine" : ""}`} key={i}><img src={line.who==="沈望"?"/characters/shen-wang.png":"/characters/liu-han.png"} alt={line.who}/><p>{line.text}</p></div>)}
        {phase >= 2 && <div className="bubble-row"><img src="/characters/liu-han.png" alt="刘涵"/><p>当年那个寄存仓？去一趟吧，把该收的都收回来。也算和过去告个别。</p></div>}
      </div>
    </section>
  </div>;
}

function Mail({ onTravel }: { onTravel: () => void }) {
  return <div className="mail-view">
    <p className="mail-meta">North Harbor Storage Center（北港寄存中心 · 海外） &lt;notice@northharbor-storage.example&gt;</p>
    <h2>B-17号寄存仓最终到期通知</h2>
    <div className="countdown"><span>剩余时间</span><strong>71 : 42 : 18</strong></div>
    <p>三年保管期限即将结束。登记人：顾盼；授权取件人：沈望。逾期物品将按照协议统一清理。</p>
    <div className="mail-quote">“你又不是去找她。你是去处理你自己的东西。”——刘涵</div>
    <button className="primary dark" onClick={onTravel}>确认行程 · 前往海外北港</button>
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
      <button onClick={() => { setSelected("laptop"); onLaptop(); }}>顾盼的旧电脑 <small>{laptopOpen ? "已解锁" : "已休眠"}</small></button>
      <button onClick={() => setSelected("memento")}>艺术展合照 <small>2018.10.21</small></button>
    </aside>
    <section className="evidence-detail">
      {!selected && <div className="empty-state"><span>B-17</span><p>请选择一件物品进行整理</p></div>}
      {selected === "letter" && <article><img className="pc-evidence-image" src="/evidence/hao-qian-letter.png" alt="一封破损的手写信"/></article>}
      {selected === "memento" && <article><p className="stamp">纪念物</p><h2>左望右盼</h2><p>校园艺术展开幕合照。沈望站在画面左边，顾盼站在右边。</p><code>2018-10-21_左望右盼.jpg</code><p>照片背面右下角：我的秘密</p></article>}
      {selected === "laptop" && <article className="laptop-lock"><p className="stamp">GU PAN · LOCAL DEVICE</p><h2>{laptopOpen ? "设备已恢复" : "输入密码"}</h2>{!laptopOpen ? <><input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="八位数字" maxLength={8}/><button className="primary dark" onClick={unlock}>解锁</button>{hint && <p className="hint">密码提示：恋爱纪念日</p>}</> : <><div className="folder-list"><span>个人文件</span><span>向阳处</span><span>微信备份 🔒</span></div><p>系统恢复了顾盼最后一次休眠时的现场。</p><a className="storage-device-link" href="/computer/gupan" target="_blank" rel="noopener noreferrer">打开顾盼的旧电脑 ↗</a></>}</article>}
    </section>
  </div>;
}

function Browser({ addEvidence, seen }: { addEvidence: (e: Evidence) => void; seen: Evidence[] }) {
  const [query, setQuery] = useState("");
  const found = /harbor|港湾/i.test(query);
  return <div className="browser-view"><div className="address"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索 Harborwell Behavioral Services"/></div>
    <div className="browser-tabs"><span className="active">搜索</span><span>图片</span><span>新闻</span><small>安全搜索：开启</small></div>
    {!found ? <section className="invoice"><p>最近浏览</p><h2>治疗订单 #HW-220214-HQ</h2><dl><dt>付款人</dt><dd>GU PAN</dd><dt>项目</dt><dd>Residential Treatment Program</dd><dt>入住人</dt><dd>H. Q.</dd><dt>金额</dt><dd>$12,480</dd></dl><button onClick={() => { setQuery("Harborwell Behavioral Services"); addEvidence("invoice"); }}>搜索机构名称</button></section> : <section className="search-results"><p>约 3,420 条结果（0.31 秒）</p><article className="web-result"><small>northharbormedical.org › harborwell › recovery</small><h2>Harborwell Behavioral Recovery</h2><p>海外 North Harbor 医疗网络下属康复项目，提供药物依赖评估、稳定干预和出院转介。</p><div className="result-card"><b>Historical record access</b><span>订单上的患者编号、日期与文件码可用于查询已发布记录</span></div></article><button className="primary dark" onClick={() => addEvidence("drug")}>{seen.includes("drug") ? "已确认订单属于康复项目" : "确认治疗机构"}</button>{seen.includes("drug")&&<a className="route-result" href="/hospital" target="_blank" rel="noopener noreferrer"><small>northharbormedical.org › patients › portal</small><b>MyNorthHarbor Medical & Recovery Records ↗</b><span>先查询H.Q.的康复记录；转介机构应从病例中继续发现。</span></a>}</section>}
  </div>;
}

function GuFiles({addEvidence}:{addEvidence:(e:Evidence)=>void}) {
  const [file, setFile] = useState<string | null>(null);
  return <div className="gu-files">
    <aside>
      {[
        ["暂停学业申请.pdf", "leave"], ["医院回执单.jpg", "receipt"], ["账单.pdf", "bill"], ["HM-2217.pdf", "check"], ["向阳处", "art"],
      ].map(([label, id]) => <button key={id} onClick={() => { setFile(id); if(id==="check")addEvidence("draft"); }}>{label}<small>{id==="art"?"图片":"文件"}</small></button>)}
    </aside>
    <section>
      {!file && <div className="empty-state"><span>2022</span><p>最后同步：2022年11月17日 03:42</p></div>}
      {file === "leave" && <article><p className="stamp">学校表单 · 已批准</p><h2>Temporary Leave of Absence</h2><img className="pc-evidence-image document" src="/evidence/gupan-temporary-leave.png" alt="顾盼的暂时休学申请批准表"/><p>学校名称：Northbridge University（北桥大学）</p></article>}
      {file === "receipt" && <article><p className="stamp">扫描件</p><h2>North Harbor Medical Center</h2><img className="pc-evidence-image document" src="/evidence/gupan-patient-portal-slip.png" alt="顾盼的医院患者编号与门户访问单"/><p>完整诊疗记录请前往医院门户查询</p></article>}
      {file === "bill" && <article><p className="stamp">付款订单 · 已结清</p><h2>Harborwell Recovery Center</h2><img className="pc-evidence-image document" src="/evidence/hao-qian-treatment-order.png" alt="Harborwell Recovery Center付款账单"/></article>}
      {file === "check" && <article><p className="stamp">异常代号</p><h2>HM-2217</h2><img className="pc-evidence-image document" src="/evidence/bank-draft-hm-2217.png" alt="附言为HM-2217的未兑付两万美元银行本票"/><p>两万美元支票，未兑现。</p></article>}
      {file === "art" && <article><img className="pc-evidence-image" src="/paintings/xiangyangchu.png" alt="顾盼的油画《向阳处》"/></article>}
    </section>
  </div>;
}

function WeChatBackup({ seen, addEvidence }: { seen: Evidence[]; addEvidence: (e: Evidence)=>void }) {
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"hq"|"sw"|"letter">("hq");
  if (!open) return <div className="backup-view"><p className="stamp">本地备份 · Backup_2022</p><h2>迁移密码</h2><p>顾盼留下的提示只有四个字：<b>左望右盼</b></p><div className="cipher-grid"><span><b>1</b> / 7</span><span>6 / <b>0</b></span><span><b>2</b> / 9</span><span>8 / <b>1</b></span></div><p className="cipher-help">从左侧的“望”开始，再到右侧的“盼”，交替读取。</p><input value={code} onChange={(e)=>setCode(e.target.value)} maxLength={4} placeholder="四位迁移密码"/><button className="primary dark" onClick={()=>code==="1021"&&setOpen(true)}>恢复离线聊天</button>{code && code!=="1021" && <p className="hint">顺序不对。左望，右盼。</p>}</div>;
  return <div className="wechat-backup"><aside><button className={tab==="hq"?"active":""} onClick={()=>setTab("hq")}><img src="/characters/hao-qian.png" alt="郝倩"/>郝倩</button><button className={tab==="sw"?"active":""} onClick={()=>setTab("sw")}><img src="/characters/shen-wang.png" alt="沈望"/>沈望</button><button className={tab==="letter"?"active":""} onClick={()=>setTab("letter")}><span className="draft-avatar">稿</span>分手信草稿</button></aside><section>
    {tab==="hq" && <article><p className="stamp">2022.10.28 · 事发次日</p><h2>你怎么回到家的？</h2><div className="transcript"><p><b>顾盼：</b>昨晚到底发生了什么？我为什么会在家？</p><p><b>郝倩：</b>我提前走了。你喝多了，应该是酒吧的人送你的。</p><p><b>顾盼：</b>他们怎么知道我住在哪里？我手机有密码，也没有叫车记录。</p><p><b>顾盼：</b>门没有被撬过。除了你，还有谁有我家的钥匙？</p><p><b>郝倩：</b>我只是把地址告诉他们。我真的没有跟着去。</p></div><button className="primary dark" onClick={()=>addEvidence("betrayal")}>{seen.includes("betrayal")?"矛盾已标记":"标记证词矛盾"}</button></article>}
    {tab==="sw" && <article><p className="stamp">语音通话 · 02分17秒</p><h2>没有说完的话</h2><div className="transcript"><p><b>顾盼：</b>昨晚在酒吧，我可能遇到了一些事……</p><p><b>沈望：</b>我早就说过那边酒吧很乱。真想去的话，至少等我过去，或者提前告诉我。</p><p><b>顾盼：</b>你说得对。是我不该去。</p></div><blockquote>未发送：我本来想告诉你，昨晚可能有人伤害了我。可是爸爸妈妈也问我为什么要去。你也这样问。</blockquote></article>}
    {tab==="letter" && <article><p className="stamp">本地草稿 · 2022年11月17日</p><h2>分手信</h2><div className="breakup-letter"><p>沈望：</p><p>这段时间我想了很久。我们隔着时差，生活已经越来越不一样。</p><p>我不想再等你，也不想让你继续等我。</p><p>一直跑着实在太累了，我决定停下来。</p><p>请尊重我的选择，我需要安静一会，不要来找我。</p><p>不是因为你做错了什么，只是我不再想和你一起计划以后。</p><p>到这里吧。</p><p>顾盼</p></div><button className="primary dark" onClick={()=>addEvidence("breakup")}>{seen.includes("breakup")?"已读":"读取完整草稿"}</button></article>}
  </section></div>;
}

function Archive({ seen, laptopOpen, onWeekTwo, onFull }: { seen: Evidence[]; laptopOpen: boolean; onWeekTwo: () => void; onFull:()=>void }) {
  return <div className="archive-view"><p className="eyebrow">调查原型 · 当前完成度</p><h2>{Math.min(100, seen.length * 16 + (laptopOpen ? 20 : 0))}%</h2><div className="progress"><i style={{ width: `${Math.min(100, seen.length * 16 + (laptopOpen ? 20 : 0))}%` }} /></div>
    <h3>一周目核心证据</h3><ul><li className={seen.includes("letter") ? "done" : ""}>郝倩的破损密信</li><li className={seen.includes("draft") ? "done" : ""}>未兑现的2万美元本票</li><li className={laptopOpen ? "done" : ""}>顾盼旧电脑</li><li className={seen.includes("drug") ? "done" : ""}>隐晦治疗订单</li></ul>
    <p className="prototype-note">文字初稿已接入完整故事骨架。后续将在这里继续加入微信备份、学生身份伪造、黑话字典、管理员后台与郝倩对质。</p>
    {laptopOpen && seen.includes("letter") && seen.includes("draft") && <button className="primary dark" onClick={onFull}>继续完整调查</button>}
    <button className="secondary" onClick={onWeekTwo}>预览双屏桌面框架</button>
  </div>;
}

function DesktopPane({ side, name, task }: { side: string; name: string; task: string }) {
  const items = side === "left" ? ["顾盼旧电脑", "CorpusLens", "郝倩密信", "管理员后台"] : ["QQ情侣空间", "临川地图", "恒慕官网", "陈放"];
  return <section className={`desktop-pane ${side}`}><header><span>{name}</span><small>{task}</small></header><div className="pane-icons">{items.map((x, i) => <button key={x}><b>{["证", "译", "信", "网"][i]}</b><span>{x}</span></button>)}</div><aside className="pane-memo"><p>当前目标</p><strong>{task}</strong><small>{side === "left" ? "剩余 71:42:18" : "转运倒计时尚未确认"}</small></aside></section>;
}

function appTitle(app: AppId) {
  return ({ wechat: "微信", mail: "邮箱", memo: "备忘录", files: "North Harbor（海外）· B-17", browser: "浏览器", archive: "调查档案", guFiles: "顾盼的个人文件", guWechat: "微信离线备份", full:"完整调查" })[app];
}
