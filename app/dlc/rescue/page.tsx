"use client";

import {useEffect,useRef,useState} from "react";
import EndingMusicControl from "../../ending/EndingMusicControl";

const DLC_TRACK="/audio/bgm/a-kind-of-hope.mp3";
const STORAGE_KEY="jia-dlc-rescue-stage";

type Stage="briefing"|"signal"|"dispatch"|"contact"|"rescue"|"ending";
type Choice={
  id:string;
  label:string;
  detail:string;
  correct?:boolean;
  response:string;
};

const stages:Stage[]=["briefing","signal","dispatch","contact","rescue","ending"];

const signalChoices:Choice[]=[
  {
    id:"hengmu",
    label:"追查恒慕的仪式地点",
    detail:"从“圆满方案”和阴婚请柬入手。",
    response:"还太早。此时恒慕尚未接到遗体转运委托，这条线还不存在。",
  },
  {
    id:"family",
    label:"联系顾家确认婚讯",
    detail:"直接询问顾盼是否正在准备婚礼。",
    response:"顾家正是限制她自由的人。贸然联系会让旧手机被收走，也可能让她被转移。",
  },
  {
    id:"qzone",
    label:"盯住情侣空间的匿名求救",
    detail:"用一周目得到的IP和残缺门牌，提前等待那条消息。",
    correct:true,
    response:"2025.11.27 02:13，匿名留言出现。IP与公共网络节点重合：晴川公寓，4栋1单元402室。",
  },
];

const dispatchChoices:Choice[]=[
  {
    id:"alone",
    label:"让刘涵独自上门",
    detail:"先敲门确认顾盼是否在里面。",
    response:"门从外面锁着，顾家拒绝开门。单独到场既无法强制进入，也会让对方开始清理证据。",
  },
  {
    id:"confront",
    label:"打电话质问顾父",
    detail:"警告他立刻放顾盼离开。",
    response:"质问会暴露调查进度，却无法提供现场保护。顾盼需要的是可以进入房间的正式力量。",
  },
  {
    id:"joint",
    label:"同步报警并请求急救联动",
    detail:"提交求救原文、精确门牌、持续失联和外侧锁门风险。",
    correct:true,
    response:"110受理涉嫌非法拘禁警情，并同步通知辖区民警与120。刘涵被要求保持电话畅通，在楼下接应。",
  },
];

const contactChoices:Choice[]=[
  {
    id:"promise",
    label:"“你必须答应我撑下去。”",
    detail:"要求她先作出承诺。",
    response:"这句话把证明求生意愿的责任又放回了顾盼身上。她不需要通过一场考试，才值得被救。",
  },
  {
    id:"hero",
    label:"“等我，我一定会救你。”",
    detail:"让沈望赶去晴川公寓。",
    response:"沈望仍在北港。把希望系在一个无法及时到场的人身上，会浪费最关键的窗口。",
  },
  {
    id:"agency",
    label:"“警察和医生到了。要让他们进来吗？”",
    detail:"说明已经发生的事，把接下来的决定交给她。",
    correct:true,
    response:"手机另一端沉默了很久。随后，顾盼清楚地回答：“要。我不同意这桩婚事。请带我离开。”",
  },
];

function ChoiceGrid({choices,selected,onSelect}:{choices:Choice[];selected:string;onSelect:(choice:Choice)=>void}){
  return <div className="rescue-choice-grid">
    {choices.map(choice=><button
      type="button"
      key={choice.id}
      className={selected===choice.id?(choice.correct?"is-correct":"is-wrong"):""}
      onClick={()=>onSelect(choice)}
      aria-pressed={selected===choice.id}
    >
      <span>{choice.label}</span>
      <small>{choice.detail}</small>
    </button>)}
  </div>;
}

export default function RescueDlcPage(){
  const [ready,setReady]=useState(false);
  const [stage,setStage]=useState<Stage>("briefing");
  const [selected,setSelected]=useState("");
  const [feedback,setFeedback]=useState("");
  const [paused,setPaused]=useState(true);
  const audioRef=useRef<HTMLAudioElement|null>(null);

  useEffect(()=>{
    const frame=window.requestAnimationFrame(()=>{
      const saved=localStorage.getItem(STORAGE_KEY) as Stage|null;
      if(saved&&stages.includes(saved))setStage(saved);
      setReady(true);
    });
    return()=>window.cancelAnimationFrame(frame);
  },[]);

  useEffect(()=>{
    if(!ready)return;
    localStorage.setItem(STORAGE_KEY,stage);
    if(stage==="ending"){
      localStorage.setItem("jia-dlc-rescue-complete","true");
    }
  },[stage,ready]);

  useEffect(()=>()=>audioRef.current?.pause(),[]);

  const begin=()=>{
    const audio=audioRef.current;
    if(audio){
      const stored=Number(localStorage.getItem("arg-music-volume")??.45);
      const master=Number.isFinite(stored)?Math.min(1,Math.max(0,stored)):.45;
      const muted=localStorage.getItem("arg-music-muted")==="true";
      audio.volume=muted?0:Math.min(.5,master*.8);
      audio.currentTime=0;
      void audio.play().then(()=>setPaused(false)).catch(()=>setPaused(true));
    }
    setSelected("");
    setFeedback("");
    setStage("signal");
  };

  const togglePause=()=>{
    const audio=audioRef.current;
    if(!audio)return;
    if(paused){
      void audio.play().then(()=>setPaused(false)).catch(()=>setPaused(true));
    }else{
      audio.pause();
      setPaused(true);
    }
  };

  const choose=(choice:Choice)=>{
    setSelected(choice.id);
    setFeedback(choice.response);
  };

  const advance=(next:Stage)=>{
    setSelected("");
    setFeedback("");
    setStage(next);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const restart=()=>{
    localStorage.removeItem(STORAGE_KEY);
    setSelected("");
    setFeedback("");
    setStage("briefing");
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const selectedIsCorrect=(choices:Choice[])=>choices.find(choice=>choice.id===selected)?.correct===true;

  if(!ready)return <main className="rescue-dlc rescue-locked"><p>正在核对已经发生过的时间线……</p></main>;

  return <main className={`rescue-dlc stage-${stage}`}>
    <audio ref={audioRef} src={DLC_TRACK} loop preload="auto" onPlay={()=>setPaused(false)} onPause={()=>setPaused(true)}/>
    {stage!=="briefing"&&<EndingMusicControl paused={paused} onToggle={togglePause}/>}
    <div className="rescue-noise" aria-hidden="true"/>
    <header className="rescue-topbar">
      <a href="/" aria-label="返回《嫁》主选单">嫁</a>
      <div><span>DLC · 希。望</span><small>2025.11.26 — 2026.03.21</small></div>
      <b>{stage==="ending"?"SAVED":`${String(Math.max(0,stages.indexOf(stage))).padStart(2,"0")} / 04`}</b>
    </header>

    {stage==="briefing"&&<section className="rescue-briefing">
      <div className="rescue-briefing-copy">
        <small>DOWNLOADABLE STORY · STANDALONE ROUTE</small>
        <h1>希。望</h1>
        <p>你已经知道求救留言会在哪里出现，知道门牌、IP、外锁和那通迟到了三天的报警。</p>
        <blockquote>这一次，不去挽回一具遗体。<br/>这一次，让顾盼自己走出那扇门。</blockquote>
        <button type="button" onClick={begin}>带着真相，回到三天前　→</button>
      </div>
      <div className="rescue-clock" aria-hidden="true">
        <small>距离原警情发生</small>
        <strong>56:58:18</strong>
        <span>2025.11.26　22:48</span>
      </div>
      <p className="rescue-disclaimer">这是一条独立的DLC时间线，建议在完成原作后游玩。原作中发生过的痛苦不会被否认；在这里，玩家获得一次提前行动的机会。</p>
    </section>}

    {stage==="signal"&&<section className="rescue-mission">
      <header>
        <small>MISSION 01 · 提前听见</small>
        <h1>真正能改变结局的第一条线索是什么？</h1>
        <p>现有证据来自不同时间。只有一条会在顾盼仍然活着时出现。</p>
      </header>
      <ChoiceGrid choices={signalChoices} selected={selected} onSelect={choose}/>
      {feedback&&<div className={`rescue-feedback ${selectedIsCorrect(signalChoices)?"success":""}`}><span>{selectedIsCorrect(signalChoices)?"突破口已确认":"这条路来不及"}</span><p>{feedback}</p></div>}
      {selectedIsCorrect(signalChoices)&&<button className="rescue-next" type="button" onClick={()=>advance("dispatch")}>锁定晴川公寓　→</button>}
    </section>}

    {stage==="dispatch"&&<section className="rescue-mission">
      <header>
        <small>MISSION 02 · 让门必须打开</small>
        <h1>已经确认402室。接下来该把谁带到门外？</h1>
        <p>知道地址不等于拥有进入私人住宅的权限。错误的惊动会缩短救援窗口。</p>
      </header>
      <div className="rescue-evidence-strip" aria-label="报警材料">
        <span><b>01</b> 匿名求救原文</span>
        <span><b>02</b> 183.214.76.119</span>
        <span><b>03</b> 4栋1单元402</span>
        <span><b>04</b> 三日持续失联</span>
      </div>
      <ChoiceGrid choices={dispatchChoices} selected={selected} onSelect={choose}/>
      {feedback&&<div className={`rescue-feedback ${selectedIsCorrect(dispatchChoices)?"success":""}`}><span>{selectedIsCorrect(dispatchChoices)?"联合处置已建立":"风险正在升高"}</span><p>{feedback}</p></div>}
      {selectedIsCorrect(dispatchChoices)&&<button className="rescue-next" type="button" onClick={()=>advance("contact")}>接通顾盼的旧手机　→</button>}
    </section>}

    {stage==="contact"&&<section className="rescue-mission rescue-contact">
      <header>
        <small>MISSION 03 · 把选择还给她</small>
        <h1>旧手机只剩最后一格电。</h1>
        <p>门外已经响起警笛。顾盼接通了电话，却没有说话。</p>
      </header>
      <div className="rescue-phone">
        <div><img src="/characters/gu-pan.png" alt="顾盼"/><span><b>顾盼</b><small>通话中 · 00:17</small></span></div>
        <i/><i/><i/><i/><i/>
      </div>
      <ChoiceGrid choices={contactChoices} selected={selected} onSelect={choose}/>
      {feedback&&<div className={`rescue-feedback ${selectedIsCorrect(contactChoices)?"success":""}`}><span>{selectedIsCorrect(contactChoices)?"她作出了自己的决定":"换一种说法"}</span><p>{feedback}</p></div>}
      {selectedIsCorrect(contactChoices)&&<button className="rescue-next" type="button" onClick={()=>advance("rescue")}>让现场听见她的回答　→</button>}
    </section>}

    {stage==="rescue"&&<section className="rescue-operation">
      <header><small>2025.11.29 · 晴川公寓</small><h1>这一次，警灯来在天亮以前。</h1></header>
      <div className="rescue-door" aria-label="晴川公寓402室外侧">
        <span>402</span>
        <div className="rescue-door-light"/>
        <i className="one"/><i className="two"/>
      </div>
      <ol>
        <li><time>07:12</time><div><b>110二次确认求救</b><p>通话录音中，顾盼明确表示被限制自由并要求离开。</p></div></li>
        <li><time>07:19</time><div><b>民警与120抵达</b><p>顾家试图阻止进入。门框外锁、旧手机与现场陈述被同步记录。</p></div></li>
        <li><time>07:24</time><div><b>依法开门</b><p>锁舌退回。急救人员首先进入房间，刘涵留在警戒线外。</p></div></li>
        <li className="alive"><time>07:31</time><div><b>顾盼离开402室</b><p>她披着急救毯，自己跨过门槛。生命体征平稳。</p></div></li>
      </ol>
      <button className="rescue-next" type="button" onClick={()=>advance("ending")}>去看她亲自选择的以后　→</button>
    </section>}

    {stage==="ending"&&<section className="rescue-ending">
      <div className="rescue-ending-art" aria-hidden="true">
        <img src="/paintings/xiangyangchu.png" alt=""/>
      </div>
      <article>
        <small>DLC END · 人间向阳</small>
        <h1>顾盼，27岁，<br/>幸存。</h1>
        <p>顾家因非法拘禁被调查，恒慕与远帆的证据链仍由郝倩、刘涵和沈望继续补全。顾盼接受了医疗与法律援助，但没有被要求立刻原谅谁，也没有被要求成为任何人的证人。</p>
        <div className="rescue-ending-chat">
          <p><b>顾盼</b><span>北港的春季复学申请通过了。</span></p>
          <p className="right"><b>沈望</b><span>恭喜。那幅《向阳处》，我替你送去画展？</span></p>
          <p><b>顾盼</b><span>不用。这一次，我自己挂。</span></p>
        </div>
        <blockquote>后来会不会重新相爱，是故事以外的事。<br/>重要的是，她终于拥有了“后来”。</blockquote>
        <div className="rescue-ending-actions"><button type="button" onClick={restart}>重新回溯</button><a href="/">返回主选单</a></div>
      </article>
    </section>}
  </main>;
}
