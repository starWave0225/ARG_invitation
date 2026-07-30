"use client";

import {useEffect,useRef,useState} from "react";
import EndingMusicControl from "../../ending/EndingMusicControl";

const DLC_TRACK="/audio/bgm/a-kind-of-hope.mp3";
const STORAGE_KEY="jia-dlc-hope-stage";

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
    id:"door",
    label:"用力拍门，要求他们放我出去",
    detail:"让门外的父母知道我还没有妥协。",
    response:"门外立刻有人靠近。我把旧手机藏回床板下面。现在对抗只会让他们再次搜房，我需要先保护唯一能求救的工具。",
  },
  {
    id:"bargain",
    label:"拿婚约当筹码，再谈一次条件",
    detail:"假装愿意配合，换回护照和常用手机。",
    response:"他们已经替我写好了答案，也从未准备履行条件。继续谈判会暴露我仍有行动计划。我先把力气留给真正能出去的路。",
  },
  {
    id:"battery",
    label:"先让旧手机活下来",
    detail:"关闭后台与相册同步，调暗屏幕，把手机带到窗边寻找信号。",
    correct:true,
    response:"电量停在6%。窗框右上角偶尔出现一格信号，QQ情侣空间的旧页面还能打开。我有机会送出一条很短的消息。",
  },
];

const dispatchChoices:Choice[]=[
  {
    id:"farewell",
    label:"“沈望，对不起。我还是很想你。”",
    detail:"把最想说的话留给最想念的人。",
    response:"这是真的，但它没有告诉任何人我在哪里、正在遭遇什么。它会被当成告别，而我现在要送出去的是一条能让我活下来的消息。",
  },
  {
    id:"vague",
    label:"“救救我，他们不让我出去。”",
    detail:"先发出去，再等对方追问位置。",
    response:"信号随时会断。我不能假设还有第二次发送机会。求救必须同时包含姓名、地址、正在发生的事和明确请求。",
  },
  {
    id:"location",
    label:"“我是顾盼，被反锁在晴川公寓4-1-402。请报警。”",
    detail:"删掉解释，只留下身份、精确位置、危险和行动请求。",
    correct:true,
    response:"02:13，发送成功。页面随即掉线，但消息已经留下服务器时间、公共网络IP和完整门牌。我把截图存进离线相册，然后拨打110。",
  },
];

const contactChoices:Choice[]=[
  {
    id:"minimize",
    label:"“我们只是吵架，我想出去冷静一下。”",
    detail:"避免让父母因报警而受到处罚。",
    response:"门外一直说这只是家庭矛盾。如果我也这样描述，最重要的危险会被遮住。我不需要替限制我自由的人减轻后果。",
  },
  {
    id:"permission",
    label:"“能不能先别告诉他们是我报警？”",
    detail:"只说明害怕，不直接说明门被锁住。",
    response:"接警员需要判断是否必须立即进入。我可以表达害怕，但还要把非法拘禁、我的明确意愿和医疗风险说完整。",
  },
  {
    id:"statement",
    label:"“我叫顾盼。我被从外面反锁，已经三天。”",
    detail:"继续说清：我不同意结婚。我要离开，也需要医生。",
    correct:true,
    response:"接警员逐句复述，我逐句确认。我的姓名、位置、被限制自由的事实和求助意愿都进入录音。她让我不要挂断，民警与120已经出发。",
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
      localStorage.setItem("jia-dlc-hope-complete","true");
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
      <div><span>DLC · 希·望</span><small>2025.11.26 — 2026.03.21</small></div>
      <b>{stage==="ending"?"SAVED":`${String(Math.max(0,stages.indexOf(stage))).padStart(2,"0")} / 04`}</b>
    </header>

    {stage==="briefing"&&<section className="rescue-briefing">
      <div className="rescue-briefing-copy">
        <small>DOWNLOADABLE STORY · STANDALONE ROUTE</small>
        <h1>希·望</h1>
        <p className="rescue-title-subtitle">我想活下去！</p>
        <p>2025年11月26日，你在晴川公寓402室醒来。门从外面锁着，护照和常用手机都被收走，床板下只剩一部电量6%的旧手机。</p>
        <blockquote>你将扮演顾盼。<br/>求救、接受帮助、继续活着，都是自救。</blockquote>
        <button type="button" onClick={begin}>成为顾盼，开始自救　→</button>
      </div>
      <div className="rescue-clock" aria-hidden="true">
        <small>旧手机剩余电量</small>
        <strong>6%</strong>
        <span>无SIM卡 · 信号不稳定</span>
      </div>
      <p className="rescue-disclaimer">这是一条独立的DLC时间线，建议在完成原作后游玩。每次尝试都可以重来；求生不是一场必须答对的考试。</p>
    </section>}

    {stage==="signal"&&<section className="rescue-mission">
      <header>
        <small>MISSION 01 · 保住唯一的出口</small>
        <h1>旧手机只剩6%的电。我先做什么？</h1>
        <p>门外有人来回走动。我不能确定下一次搜房会在什么时候发生。</p>
      </header>
      <ChoiceGrid choices={signalChoices} selected={selected} onSelect={choose}/>
      {feedback&&<div className={`rescue-feedback ${selectedIsCorrect(signalChoices)?"success":""}`}><span>{selectedIsCorrect(signalChoices)?"我留住了一次机会":"先保护自己"}</span><p>{feedback}</p></div>}
      {selectedIsCorrect(signalChoices)&&<button className="rescue-next" type="button" onClick={()=>advance("dispatch")}>把手机带到窗边　→</button>}
    </section>}

    {stage==="dispatch"&&<section className="rescue-mission">
      <header>
        <small>MISSION 02 · 把地址说完整</small>
        <h1>信号只够发一条消息。我要写什么？</h1>
        <p>我有很多话想说，但下一秒页面就可能掉线。这条消息必须让陌生人也知道该怎样行动。</p>
      </header>
      <div className="rescue-evidence-strip" aria-label="旧手机状态">
        <span><b>BAT</b> 5%</span>
        <span><b>NET</b> 1格</span>
        <span><b>APP</b> QQ缓存可用</span>
        <span><b>DOOR</b> 外侧反锁</span>
      </div>
      <ChoiceGrid choices={dispatchChoices} selected={selected} onSelect={choose}/>
      {feedback&&<div className={`rescue-feedback ${selectedIsCorrect(dispatchChoices)?"success":""}`}><span>{selectedIsCorrect(dispatchChoices)?"我的位置已经留下":"这条消息还不够"}</span><p>{feedback}</p></div>}
      {selectedIsCorrect(dispatchChoices)&&<button className="rescue-next" type="button" onClick={()=>advance("contact")}>拨打110　→</button>}
    </section>}

    {stage==="contact"&&<section className="rescue-mission rescue-contact">
      <header>
        <small>MISSION 03 · 亲口说出我的意愿</small>
        <h1>接警员问：“你现在安全吗？”</h1>
        <p>门外有人喊，这只是家里闹矛盾。我握紧手机，必须让电话另一端听懂正在发生什么。</p>
      </header>
      <div className="rescue-phone">
        <div><span className="rescue-emergency-avatar">110</span><span><b>临川110接警中心</b><small>通话中 · 00:17</small></span></div>
        <i/><i/><i/><i/><i/>
      </div>
      <ChoiceGrid choices={contactChoices} selected={selected} onSelect={choose}/>
      {feedback&&<div className={`rescue-feedback ${selectedIsCorrect(contactChoices)?"success":""}`}><span>{selectedIsCorrect(contactChoices)?"我的话被记录下来":"再说得明确一点"}</span><p>{feedback}</p></div>}
      {selectedIsCorrect(contactChoices)&&<button className="rescue-next" type="button" onClick={()=>advance("rescue")}>保持通话，等待开门　→</button>}
    </section>}

    {stage==="rescue"&&<section className="rescue-operation">
      <header><small>2025.11.27 · 晴川公寓402室</small><h1>我听见警笛穿过窗帘。</h1></header>
      <div className="rescue-door" aria-label="从晴川公寓402室内看向房门">
        <span>402</span>
        <div className="rescue-door-light"/>
        <i className="one"/><i className="two"/>
      </div>
      <ol>
        <li><time>02:13</time><div><b>我发出求救</b><p>QQ页面显示“发送成功”。我把截图留在离线相册，随后拨通110。</p></div></li>
        <li><time>02:21</time><div><b>民警与120抵达</b><p>门外开始争辩。我没有挂断电话，也没有替任何人改口。</p></div></li>
        <li><time>02:24</time><div><b>我再次确认</b><p>“我被反锁。我不同意。我需要离开。”这句话同时被接警录音与执法记录仪收下。</p></div></li>
        <li><time>02:27</time><div><b>门锁从外面打开</b><p>急救人员先走进来。他们问我愿不愿意离开这里，我回答：“愿意。”</p></div></li>
        <li className="alive"><time>02:31</time><div><b>我离开402室</b><p>我披上急救毯，拿着那部只剩2%电量的旧手机，自己跨过门槛。</p></div></li>
      </ol>
      <button className="rescue-next" type="button" onClick={()=>advance("ending")}>去看我亲自选择的以后　→</button>
    </section>}

    {stage==="ending"&&<section className="rescue-ending">
      <div className="rescue-ending-art" aria-hidden="true">
        <img src="/paintings/xiangyangchu.png" alt=""/>
      </div>
      <article>
        <small>DLC END · 希·望</small>
        <h1>我叫顾盼。<br/>我活下来了。</h1>
        <p>我接受了医疗与法律援助，也参与制定了自己的安全计划。顾家因非法拘禁被调查，恒慕与远帆的证据仍有人继续追查；但我不需要立刻原谅谁，也不需要用作证来换取被帮助的资格。</p>
        <div className="rescue-ending-chat">
          <p><b>2025.12.08 · 安全计划</b><span>不见家人不是任性。现在，我有权决定谁能接近我。</span></p>
          <p className="right"><b>2026.02.03 · 复学邮件</b><span>北港的春季复学申请通过了。</span></p>
          <p><b>2026.03.21 · 备忘录</b><span>《向阳处》重新展出。画是我自己挂的。</span></p>
        </div>
        <blockquote>我不是因为答对了三道题，才值得活下来。<br/>我求救了，也接受了帮助。这些都是我的选择。</blockquote>
        <div className="rescue-ending-actions"><button type="button" onClick={restart}>重新尝试</button><a href="/">返回主选单</a></div>
      </article>
    </section>}
  </main>;
}
