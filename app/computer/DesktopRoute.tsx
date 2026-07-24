"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Owner = "shen" | "gupan" | "liuhan";
type GameMode = "normal" | "hardcore";
type PreviewImage = {
  src:string;
  alt:string;
  tag?:string;
  title?:string;
  body?:ReactNode;
  link?:[string,string];
  backText?:string;
};
type EdgeResult = {
  domain:string;
  title:string;
  snippet:string;
  url?:string;
  hint?:string;
  local?:boolean;
};

const directFileImages:Record<string,PreviewImage>={
  "一封破损的信.pdf":{
    src:"/evidence/hao-qian-letter.png",alt:"破损信封与郝倩的手写信"
  },
  "合照.jpg":{
    src:"/evidence/art-show-storage-copy.png",alt:"B-17寄存仓中的校园艺术展开幕合照",backText:"我的秘密"
  },
  "暂停学业申请.pdf":{
    src:"/evidence/gupan-temporary-leave.png",alt:"顾盼的暂时休学申请批准表",tag:"学校表单 · 已批准",title:"Temporary Leave of Absence",
    body:<p>文件证明她计划暂时离开，而不是彻底消失。</p>
  },
  "医院_患者编号.jpg":{
    src:"/evidence/gupan-patient-portal-slip.png",alt:"顾盼的医院患者编号与门户访问单",tag:"扫描件",title:"North Harbor Medical Center",
    body:<p>照片保留了患者编号、就诊日期和访问码；完整诊疗记录需要前往医院门户。</p>,
    link:["/hospital","打开医院患者门户 ↗"]
  },
  "事后检查记录_GP-221109.pdf":{
    src:"/evidence/gupan-post-assault-exam.png",alt:"顾盼事后检查记录扫描件",tag:"敏感医疗资料 · 虚构记录",title:"事后检查与筛查摘要",
    body:<><div className="pc-scan"><b>PATIENT: GU PAN　MRN: GP-221109</b><span>VISIT DATE: 2022-11-09</span><span>ACCESS CODE: 7304</span><span>SCREENING: ABNORMAL — CONFIRMATORY TEST REQUIRED</span></div><p>临床备注记录了顾盼对“突然失去意识后，疑似发生非自愿接触”的陈述。医护人员建议保存证据、进行复检并接受持续支持。</p><p>这份打印件只包含摘要；完整结果和后续诊疗记录保存在患者门户。</p></>,
    link:["/hospital","使用患者编号与检验码打开医院门户 ↗"]
  },
  "治疗订单_HW-220214-HQ.pdf":{
    src:"/evidence/hao-qian-treatment-order.png",alt:"顾盼为郝倩支付的康复治疗订单",tag:"付款订单 · 已结清",title:"Harborwell Recovery Center",
    body:<p>治疗项目只写着“依赖性行为稳定干预”。完整付款方与转介信息需要前往同一医疗集团门户。</p>,
    link:["/hospital","打开港湾康复中心病例门户 ↗"]
  },
  "HM-2217_未兑现.pdf":{
    src:"/evidence/bank-draft-hm-2217.png",alt:"附言为HM-2217的未兑付两万美元银行本票",tag:"异常代号",title:"HM-2217",
    body:<p>两万美元本票没有解释用途，附言只留下编号 <code>HM-2217</code>；必须结合聊天、草稿和后台记录判断它代表什么。</p>
  },
};

let notificationAudioContext: AudioContext | null = null;

async function playNotificationSound(kind:"wechat"|"mail"){
  try{
    notificationAudioContext ??= new AudioContext();
    if(notificationAudioContext.state==="suspended")await notificationAudioContext.resume();
    const now=notificationAudioContext.currentTime;
    const notes=kind==="wechat"
      ?[{frequency:784,start:0,duration:.08},{frequency:1046,start:.1,duration:.12}]
      :[{frequency:659,start:0,duration:.11},{frequency:523,start:.12,duration:.16}];
    notes.forEach(note=>{
      const oscillator=notificationAudioContext!.createOscillator();
      const gain=notificationAudioContext!.createGain();
      const start=now+note.start;
      oscillator.type="sine";
      oscillator.frequency.setValueAtTime(note.frequency,start);
      gain.gain.setValueAtTime(.0001,start);
      gain.gain.exponentialRampToValueAtTime(.045,start+.018);
      gain.gain.exponentialRampToValueAtTime(.0001,start+note.duration);
      oscillator.connect(gain);
      gain.connect(notificationAudioContext!.destination);
      oscillator.start(start);
      oscillator.stop(start+note.duration+.02);
    });
  }catch{}
}

const configs = {
  shen:{
    owner:"沈望",device:"SHEN-WANG-PC",os:"Windows 11 专业版",time:"21:18",date:"2025年12月3日 星期三",
    wallpaper:"sw",quote:"原来已经过去这么久了。蛮好的，祝福她。",
    apps:[["微信","💬","wechat"],["Outlook","✉","mail"],["Microsoft Edge","◎","browser"],["文件资源管理器","📁","files"],["我的日记","▤","diary"],["地图","⌖","map"],["回收站","♲","trash"]],
  },
  gupan:{
    owner:"顾盼",device:"GP-LAPTOP-2018",os:"Windows 10 家庭中文版",time:"03:42",date:"2022年11月17日 星期四",
    wallpaper:"gp",quote:"希望自卑的人，也能拥有面对黑暗的勇气。",
    apps:[["此电脑","▣","files"],["个人文件","📁","personal"],["微信","💬","wechat"],["Outlook","✉","mail"],["浏览器","◎","browser"],["回收站","♲","trash"]],
  },
  liuhan:{
    owner:"刘涵",device:"LIUHAN-DESKTOP",os:"Windows 11 家庭中文版",time:"22:06",date:"2025年12月3日 星期三",
    wallpaper:"lh",quote:"她回国没人知道，也不在家乡。这事不对。",
    apps:[["微信","💬","wechat"],["QQ","Q","qq"],["浏览器","◎","browser"],["临川地图","⌖","map"],["案件协作","盾","police"],["下载","↓","downloads"]],
  }
} as const;

export default function DesktopRoute({owner}:{owner:Owner}){
  const cfg=configs[owner];
  const [systemTime,setSystemTime]=useState<string>(cfg.time);
  const [gameMode,setGameMode]=useState<GameMode|null>(null);
  const [active,setActive]=useState<string|null>(null);
  const [selected,setSelected]=useState<string|null>(null);
  const [start,setStart]=useState(false);
  const [notice,setNotice]=useState(false);
  const [wechatNotice,setWechatNotice]=useState<{title:string;body:string}|null>(null);
  const [extracted,setExtracted]=useState(false);
  const resetGame=()=>{
    if(!window.confirm("确定清除《嫁》的全部调查进度并重新开始吗？"))return;
    for(let index=localStorage.length-1;index>=0;index-=1){
      const key=localStorage.key(index);
      if(key?.startsWith("jia-"))localStorage.removeItem(key);
    }
    for(let index=sessionStorage.length-1;index>=0;index-=1){
      const key=sessionStorage.key(index);
      if(key?.startsWith("jia-"))sessionStorage.removeItem(key);
    }
    window.location.assign("/");
  };
  const toggleGameMode=()=>{
    setGameMode(current=>{
      const next:GameMode=current==="normal"?"hardcore":"normal";
      localStorage.setItem("jia-game-mode",next);
      window.dispatchEvent(new CustomEvent("jia-game-mode-change",{detail:next}));
      return next;
    });
  };
  useEffect(()=>{
    const syncMode=()=>{
      const savedMode=localStorage.getItem("jia-game-mode");
      setGameMode(savedMode==="hardcore"?"hardcore":"normal");
    };
    const frame=window.requestAnimationFrame(syncMode);
    window.addEventListener("storage",syncMode);
    window.addEventListener("jia-game-mode-change",syncMode);
    return()=>{window.cancelAnimationFrame(frame);window.removeEventListener("storage",syncMode);window.removeEventListener("jia-game-mode-change",syncMode)};
  },[]);
  useEffect(()=>{
    const update=()=>setSystemTime(new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date()));
    update();
    const timer=window.setInterval(update,1000);
    return()=>window.clearInterval(timer);
  },[]);
  useEffect(()=>{const notify=()=>{if(owner==="shen"&&localStorage.getItem("jia-storage-reached")==="true")setNotice(true);setExtracted(localStorage.getItem("jia-gupan-pc-unlocked")==="true")};notify();window.addEventListener("jia-progress",notify);return()=>window.removeEventListener("jia-progress",notify)},[owner]);
  useEffect(()=>{
    if(owner!=="shen")return;
    const updates=[
      {key:"jia-olddriver-group",seen:"jia-notified-olddriver",title:"老司机夜航群",body:"你已通过验证并加入群聊"},
      {key:"jia-yuanfan-management-group",seen:"jia-notified-yuanfan-group",title:"远帆互助会·管理群",body:"韩铎邀请你加入了群聊"},
      {key:"jia-hq-added",seen:"jia-notified-hq",title:"H.Q. · 郝倩",body:"你们已经成为好友，可以开始聊天了"},
      {key:"jia-hd-added",seen:"jia-notified-hd",title:"韩铎",body:"新的联系人已出现在微信中"},
    ];
    const check=()=>{
      const hasProgress=updates.some(item=>localStorage.getItem(item.key)==="true")||localStorage.getItem("jia-storage-reached")==="true"||localStorage.getItem("jia-gupan-pc-unlocked")==="true";
      if(!hasProgress&&localStorage.getItem("jia-notified-opening-wechat-v3")!=="true"){
        localStorage.setItem("jia-notified-opening-wechat-v3","true");
        setWechatNotice({title:"刘涵",body:"还没休息？"});
        return;
      }
      const fresh=updates.filter(item=>localStorage.getItem(item.key)==="true"&&localStorage.getItem(item.seen)!=="true");
      if(fresh.length===0)return;
      fresh.forEach(item=>localStorage.setItem(item.seen,"true"));
      setWechatNotice({title:fresh[0].title,body:fresh[0].body});
    };
    check();
    window.addEventListener("storage",check);
    window.addEventListener("jia-progress",check);
    window.addEventListener("jia-wechat-notification",check);
    return()=>{window.removeEventListener("storage",check);window.removeEventListener("jia-progress",check);window.removeEventListener("jia-wechat-notification",check)};
  },[owner]);
  useEffect(()=>{if(wechatNotice)void playNotificationSound("wechat")},[wechatNotice]);
  useEffect(()=>{if(notice&&!wechatNotice)void playNotificationSound("mail")},[notice,wechatNotice]);
  useEffect(()=>{if(gameMode==="hardcore"&&active==="case")setActive(null)},[gameMode,active]);
  useEffect(()=>{document.documentElement.dataset.desktop=owner;return()=>{delete document.documentElement.dataset.desktop}},[owner]);
  return <main className={`pc-desktop pc-${owner}`}>
    <div className="pc-wallpaper"/>
    <section className="pc-icons" aria-label={`${cfg.owner}的桌面`}>
      {cfg.apps.map(([label,icon,id])=><button key={id} className={selected===id?"selected":""} onClick={()=>setSelected(id)} onDoubleClick={()=>setActive(id)}><i>{icon}</i><span>{label}</span></button>)}
      {owner==="shen"&&extracted&&<button className={selected==="storage"?"selected":""} onClick={()=>setSelected("storage")} onDoubleClick={()=>setActive("storage")}><i>📁</i><span>B-17 寄存仓</span></button>}
      {owner==="shen"&&extracted&&<button className={selected==="gupan-pc"?"selected":""} onClick={()=>setSelected("gupan-pc")} onDoubleClick={()=>window.open("/computer/gupan","_blank","noopener,noreferrer")}><i className="device-icon">▰</i><span>顾盼的旧电脑</span></button>}
      {owner==="liuhan"&&<button onDoubleClick={()=>window.open("/hengmu","_blank","noopener,noreferrer")} onClick={()=>setSelected("hengmu")} className={selected==="hengmu"?"selected":""}><i>囍</i><span>恒慕官网.url</span></button>}
    </section>
    {gameMode==="normal"&&<aside className="pc-sticky"><small>当前目标</small><b>{owner==="shen"?"整理 B-17 寄存仓，查明她离开的原因":owner==="gupan"?"恢复旧文件，找到未完成的举报材料":"根据残破地址与IP定位顾盼住处"}</b><span>{owner==="gupan"?"最后同步：2022/11/17 03:42":owner==="liuhan"?"陈放：有线索先走正式程序":"B-17 到期剩余 71:42:18"}</span><button type="button" className="pc-sticky-case" onClick={()=>setActive("case")}><i>◫</i><strong>调查档案</strong><em>查看已经收集的证据</em></button></aside>}
    {wechatNotice&&<div className="pc-toast pc-wechat-toast"><button className="pc-toast-open" onClick={()=>{setWechatNotice(null);setActive("wechat")}}><i>微</i><span><small>微信 · 现在</small><b>{wechatNotice.title}</b><em>{wechatNotice.body}</em></span></button><button className="pc-toast-close" aria-label="关闭微信通知" onClick={()=>setWechatNotice(null)}>×</button></div>}
    {notice&&!wechatNotice&&<div className="pc-toast"><button className="pc-toast-open" onClick={()=>{setNotice(false);setActive("mail")}}><i>✉</i><span><small>Outlook · 现在</small><b>B-17现场物品清单.zip</b><em>身份核验已完成，请下载现场物品清单</em></span></button><button className="pc-toast-close" aria-label="关闭通知" onClick={()=>setNotice(false)}>×</button></div>}
    {active&&<PcWindow owner={owner} app={active} gameMode={gameMode} close={()=>setActive(null)}/>}
    <footer className="pc-taskbar">
      <button className="pc-start" onClick={()=>setStart(!start)}>田</button>
      <button className="pc-search">⌕　搜索</button>
      {cfg.apps.slice(0,4).map(([label,icon,id])=><button key={id} className={active===id?"running":""} title={label} onClick={()=>setActive(id)}>{icon}</button>)}
      <span className="pc-tray">⌃　⌨　◉　⌁　🔊　 <b>{systemTime}<small>{cfg.date.replace(" 星期三","").replace(" 星期四","")}</small></b></span>
    </footer>
    {start&&<div className="pc-startmenu"><div className="pc-start-search">⌕　在应用、设置和文档中搜索</div><header><b>已固定</b><span>所有应用　›</span></header><div>{cfg.apps.map(([label,icon,id])=><button key={id} onClick={()=>{setActive(id);setStart(false)}}><i>{icon}</i><span>{label}</span></button>)}</div><footer><span>●　{cfg.owner}</span><button onClick={()=>{location.href="/"}}>关机</button></footer></div>}
    <div className="pc-route-switch"><span>{cfg.owner}的电脑</span>{gameMode&&<button type="button" className={`pc-mode-label ${gameMode}`} onClick={toggleGameMode} aria-label={`当前为${gameMode==="normal"?"通灵模式":"真实模式"}，点击切换为${gameMode==="normal"?"真实模式":"通灵模式"}`} title="点击切换游戏模式">{gameMode==="normal"?"通灵模式":"真实模式"} <small>⇄</small></button>}<a href="/computer/shen" target="_blank" rel="noopener noreferrer">沈望</a><a href="/computer/gupan" target="_blank" rel="noopener noreferrer">顾盼</a><a href="/computer/liuhan" target="_blank" rel="noopener noreferrer">刘涵</a><a href="/" target="_blank" rel="noopener noreferrer">返回主选单</a><button type="button" onClick={resetGame}>↻ 重置进度</button></div>
  </main>
}

function PcWindow({owner,app,gameMode,close}:{owner:Owner;app:string;gameMode:GameMode|null;close:()=>void}){
  const titles:Record<string,string>={wechat:"微信",mail:"Outlook",files:"文件资源管理器",storage:"B-17 寄存仓",memo:"备忘录",diary:"我的日记",case:"调查档案",trash:"回收站",personal:"个人文件",browser:"Microsoft Edge",qq:"QQ",map:"地图",police:"案件协作",downloads:"下载"};
  const isExplorer=["files","storage","personal","downloads"].includes(app);
  const [previewImage,setPreviewImage]=useState<PreviewImage|null>(null);
  const [imageFlipped,setImageFlipped]=useState(false);
  useEffect(()=>{if(!previewImage)return;const onKeyDown=(event:KeyboardEvent)=>{if(event.key==="Escape")setPreviewImage(null)};window.addEventListener("keydown",onKeyDown);return()=>window.removeEventListener("keydown",onKeyDown)},[previewImage]);
  const openImage=(event:React.MouseEvent<HTMLDivElement>)=>{
    const target=event.target as HTMLElement;
    if(target.tagName!=="IMG"||target.closest(".wx-app"))return;
    const image=target as HTMLImageElement;
    setImageFlipped(false);
    setPreviewImage({src:image.currentSrc||image.src,alt:image.alt||"图片预览"});
  };
  return <section className={`pc-window ${app==="wechat"?"chat":""} ${isExplorer?"explorer-window":""}`}>
    <header><span><i>{isExplorer?"📁":"●"}</i>{titles[app]||app}</span><div><button>—</button><button>□</button><button onClick={close}>×</button></div></header>
    <div className="pc-window-content" onClick={openImage}><WindowContent owner={owner} app={app} gameMode={gameMode} openImagePreview={image=>{setImageFlipped(false);setPreviewImage(image)}}/></div>
    {previewImage&&<div className="pc-image-lightbox" role="dialog" aria-modal="true" aria-label={previewImage.title||previewImage.alt} onClick={()=>setPreviewImage(null)}><span className="pc-image-scroll-hint">滚轮或触控板查看完整图片</span><button type="button" aria-label="关闭图片预览" onClick={()=>setPreviewImage(null)}>×</button><div className="pc-image-lightbox-scroll" tabIndex={0} aria-label={`${previewImage.alt}，可滚动查看`}><figure onClick={event=>event.stopPropagation()}>{previewImage.backText?<button type="button" className={`pc-photo-flip ${imageFlipped?"flipped":""}`} onClick={()=>setImageFlipped(value=>!value)} aria-label={imageFlipped?"翻回照片正面":"翻到照片背面"}><span className="pc-photo-flip-inner"><span className="pc-photo-face pc-photo-front"><img src={previewImage.src} alt={previewImage.alt}/></span><span className="pc-photo-face pc-photo-back" aria-hidden={!imageFlipped}><em>{previewImage.backText}</em></span></span></button>:<img src={previewImage.src} alt={previewImage.alt}/>}<figcaption>{previewImage.backText?(imageFlipped?"照片背面 · 点击翻回正面":"点击照片查看背面"):previewImage.alt}</figcaption>{(previewImage.tag||previewImage.title||previewImage.body||previewImage.link)&&<div className="pc-image-lightbox-notes">{previewImage.tag&&<small>{previewImage.tag}</small>}{previewImage.title&&<h2>{previewImage.title}</h2>}{previewImage.body}{previewImage.link&&<a className="primary" href={previewImage.link[0]} target="_blank" rel="noopener noreferrer">{previewImage.link[1]}</a>}</div>}<a href={previewImage.src} target="_blank" rel="noopener noreferrer">在新标签页打开原图 ↗</a></figure></div></div>}
  </section>
}

function WindowContent({owner,app,gameMode,openImagePreview}:{owner:Owner;app:string;gameMode:GameMode|null;openImagePreview:(image:PreviewImage)=>void}){
  const [openedFile,setOpenedFile]=useState<string|null>(null);
  const [explorerView,setExplorerView]=useState(app==="files"?"root":app);
  const [progress,setProgress]=useState(0);
  const [storageReached,setStorageReached]=useState(false);
  const [gupanPcUnlocked,setGupanPcUnlocked]=useState(false);
  const [liuhanAddressReached,setLiuhanAddressReached]=useState(false);
  const [liuhanPhoneObtained,setLiuhanPhoneObtained]=useState(false);
  const openFile=(file:string)=>{
    const directImage=directFileImages[file];
    if(directImage){
      setOpenedFile(null);
      openImagePreview(directImage);
      return;
    }
    setOpenedFile(file);
  };
  useEffect(()=>{const sync=()=>{setProgress(v=>v+1);setStorageReached(localStorage.getItem("jia-storage-reached")==="true");setGupanPcUnlocked(localStorage.getItem("jia-gupan-pc-unlocked")==="true");setLiuhanAddressReached(localStorage.getItem("jia-liuhan-address-reached")==="true");setLiuhanPhoneObtained(localStorage.getItem("jia-liuhan-phone-obtained")==="true")};sync();window.addEventListener("jia-progress",sync);return()=>window.removeEventListener("jia-progress",sync)},[]);
  useEffect(()=>{setExplorerView(app==="files"?"root":app);setOpenedFile(null)},[app]);
  void progress;
  if(app==="mail"&&owner==="gupan")return <GupanMailbox/>;
  if(app==="mail")return <ShenMailbox storageReached={storageReached}/>;
  if(app==="wechat"&&owner==="gupan")return <GupanWeChatArchive/>;
  if(app==="wechat")return <WeChatDesktop owner={owner}/>;
  if(app==="browser")return <EdgeBrowser owner={owner}/>;
  if(app==="qq")return <div className="pc-document"><small>QQ · 情侣空间快捷入口</small><h2>左望右盼</h2><p>沈望与顾盼的情侣空间。上次访问：2022年1月7日。</p><div className="pc-qzone-card"><img src="/characters/shen-wang.png" alt="沈望"/><b>♥</b><img src="/characters/gu-pan.png" alt="顾盼"/><span>有一条来自匿名访客的新留言</span></div><a href="/qzone" target="_blank" rel="noopener noreferrer">在新标签页打开QQ情侣空间 ↗</a></div>;
  if(app==="map")return <MapApp owner={owner}/>;
  if(app==="diary")return <ShenDiary/>;
  if(app==="personal"||app==="files"||app==="storage"||app==="downloads"){
    const gupanPersonalFiles=["暂停学业申请.pdf","医院_患者编号.jpg","事后检查记录_GP-221109.pdf","治疗订单_HW-220214-HQ.pdf","HM-2217_未兑现.pdf","画","待整理"];
    const files=explorerView==="storage"
      ?["B-17现场物品清单.zip","一封破损的信.pdf","合照.jpg"]
      :explorerView==="personal"
        ?gupanPersonalFiles
        :explorerView==="downloads"
            ?["QQ空间截图","IP定位记录",...(liuhanAddressReached?["旧请柬","恒慕服务码"]:[]),...(liuhanPhoneObtained?["顾盼的手机_本地数据提取"]:[])]
            :[];
    const rootFolders=owner==="shen"
      ?(gupanPcUnlocked?[{label:"B-17 寄存仓",view:"storage"}]:[])
      :owner==="gupan"
        ?[{label:"个人文件",view:"personal"}]
        :[{label:"下载",view:"downloads"}];
    const pathNames:Record<string,string>={root:"此电脑",storage:"B-17 寄存仓",personal:"个人文件",downloads:"下载"};
    return <div className="pc-explorer"><aside><span>快速访问</span>{rootFolders.map(folder=><span key={folder.view}>{folder.label}</span>)}<span>此电脑</span></aside><section><header>{explorerView==="root"?"←　→　↑　 此电脑":<><button className="pc-explorer-back" type="button" onClick={()=>setExplorerView("root")}>←</button>　→　↑　 此电脑　›　{pathNames[explorerView]||explorerView}</>}</header><div className="pc-filegrid" tabIndex={0} aria-label="文件列表，可滚动查看">{explorerView==="root"?rootFolders.map(folder=><button key={folder.view} onClick={()=>setExplorerView(folder.view)}><i>📁</i><span>{folder.label}</span><small>点击打开</small></button>):files.map(file=><button key={file} onClick={()=>openFile(file)}><i>{file.endsWith(".jpg")?"🖼":file.includes("手机")?"▰":"📄"}</i><span>{file}</span><small>点击打开</small></button>)}{explorerView==="root"&&owner==="shen"&&gupanPcUnlocked&&<a className="pc-device-link" href="/computer/gupan" target="_blank" rel="noopener noreferrer"><i>▰</i><span><b>顾盼的旧电脑</b><small>GP-LAPTOP-2018 · 已从休眠恢复</small></span><em>打开设备 ↗</em></a>}{explorerView==="root"&&rootFolders.length===0&&<div className="pc-folder-empty"><span>此位置暂无文件</span></div>}{explorerView!=="root"&&files.length===0&&<div className="pc-folder-empty"><span>此文件夹为空</span></div>}</div>{openedFile&&<FilePreview owner={owner} file={openedFile} close={()=>setOpenedFile(null)}/>}</section></div>;
  }
  if(app==="police")return <div className="pc-document"><small>临川公安 · 线索协作（只读）</small><h2>陈放</h2><p>有明确的人身危险或转运信息，立即联系我。数据库内容不能私下查，线索必须正式登记。</p><hr/><p>待提交：QQ求救原始记录、IP归属、拘禁现场照片、恒慕转运单。</p></div>;
  if(app==="case")return <CaseArchive mode={gameMode}/>;
  if(app==="memo")return <div className="pc-notepad"><p>2025/12/03</p><h2>原来已经过去这么久了。</h2><p>蛮好的，祝福她。</p><hr/><p>刘涵说得对。不是去找她，只是把过去留下的东西收好。</p></div>;
  return <div className="pc-empty"><span>♲</span><p>此文件夹为空</p></div>;
}

function ShenMailbox({storageReached}:{storageReached:boolean}){
  const [selected,setSelected]=useState(0);
  const [addressCopied,setAddressCopied]=useState(false);
  const storageAddress="North Harbor Storage Center, Zone B · 17 Harborfront Avenue, Seabreeze District, North Harbor (OVERSEAS)";
  const copyStorageAddress=async()=>{
    try{
      await navigator.clipboard.writeText(storageAddress);
      setAddressCopied(true);
    }catch{}
  };
  const expiryMail={from:"北港寄存中心（海外）",date:"昨天 16:17",subject:"B-17号寄存仓最终到期通知",preview:"三年保管期限将在72小时后结束",body:<><small>North Harbor Storage Center（北港寄存中心 · 海外） &lt;notice@northharbor-storage.example&gt;</small><div className="shen-expiry-document"><div className="shen-translation-banner"><b>中文翻译件</b><span>原件由 North Harbor Storage Center 签发 · NORTH HARBOR / OVERSEAS</span></div><img className="shen-expiry-notice" src="/evidence/b17-expiry-notice.png" alt="北港寄存中心B-17号寄存仓最终到期通知中文翻译件"/></div><div className="shen-mail-address"><small>OVERSEAS VISIT ADDRESS · 海外到访地址</small><strong>{storageAddress}</strong><button type="button" onClick={copyStorageAddress}>{addressCopied?"已复制":"复制地址"}</button></div></>};
  const adMails=[
    {from:"食刻外卖",date:"今天 13:40",subject:"今晚吃点好的？满30减12元",preview:"你的专属夜宵券将在今晚24:00失效",ad:true,body:<><small>食刻外卖 &lt;offers@shike.example&gt;</small><span className="mail-ad-label">推广</span><h2>今晚不做饭，也可以好好吃饭</h2><div className="mail-promo-card"><b>满 30 减 12</b><p>限指定商家使用 · 今晚24:00前有效</p></div><p className="gp-mail-muted">此邮件根据你的订阅偏好自动发送，与当前调查无关。</p></>},
    {from:"光盒云盘",date:"昨天",subject:"老用户专享：2TB空间限时五折",preview:"照片和文件太多？升级后可自动备份全部设备",ad:true,body:<><small>光盒云盘 &lt;membership@lightbox-cloud.example&gt;</small><span className="mail-ad-label">推广</span><h2>给旧照片多留一点空间</h2><div className="mail-promo-card blue"><b>2TB 年费会员 ¥128</b><p>活动截止至12月8日，自动续费可随时关闭。</p></div><p className="gp-mail-muted">你收到此邮件是因为曾注册光盒云盘基础账户。</p></>},
    {from:"跃动健身",date:"12月1日",subject:"沈先生，你的年卡续费优惠已到账",preview:"冬季续费享八折，再赠两次私教体验课",ad:true,body:<><small>跃动健身会所 &lt;club@yuedong-fitness.example&gt;</small><span className="mail-ad-label">会员推广</span><h2>这个冬天，别让训练计划停下来</h2><div className="mail-promo-card orange"><b>年卡续费 8 折</b><p>赠送2次私教体验课 · 海岚店限定</p></div><p className="gp-mail-muted">若你已不再居住于北港，可忽略本邮件。</p></>},
    {from:"远行旅行",date:"11月29日",subject:"年末出发：国内机票低至199元",preview:"滑雪、温泉与跨年目的地推荐",ad:true,body:<><small>远行旅行 &lt;newsletter@fartrip.example&gt;</small><span className="mail-ad-label">订阅邮件</span><h2>年末出发，换一座城市过冬</h2><div className="mail-promo-card winter"><b>机票低至 ¥199</b><p>价格随余票变化，最终以订单页面为准。</p></div><p className="gp-mail-muted">你于2021年订阅了“每周旅行灵感”。</p></>},
    {from:"像素工坊",date:"11月26日",subject:"黑五最后一天：设计素材全场六折",preview:"字体、笔刷、演示模板与年度素材包",ad:true,body:<><small>像素工坊 &lt;sale@pixel-foundry.example&gt;</small><span className="mail-ad-label">广告</span><h2>黑五设计素材特卖</h2><div className="mail-promo-card dark"><b>全场 6 折</b><p>优惠码：PIXEL40 · 今日23:59失效</p></div><p className="gp-mail-muted">这是一封自动营销邮件。</p></>}
  ];
  const arrivalMail={from:"北港寄存中心（海外）",date:"刚刚",subject:"B-17现场物品清单.zip",preview:"身份核验已完成，请下载现场物品清单",body:<><small>North Harbor Storage Center（北港寄存中心 · 海外） &lt;archive@northharbor-storage.example&gt;</small><h2>B-17现场物品清单.zip</h2><p>您已完成海外现场身份核验。物品清单与设备唤醒记录见附件。</p><button className="pc-zip" onClick={()=>{localStorage.setItem("jia-gupan-pc-unlocked","true");window.dispatchEvent(new Event("jia-progress"))}}>▣　解压到桌面</button><p className="pc-mail-hint">解压后，“文件资源管理器”中会出现顾盼的旧电脑。</p></>};
  const mails=storageReached?[arrivalMail,expiryMail,...adMails]:[adMails[0],expiryMail,...adMails.slice(1)];
  const current=mails[Math.min(selected,mails.length-1)] as {body:ReactNode};
  return <div className="gp-mailbox shen-mailbox"><aside><b>Outlook</b><button>新邮件</button><span className="active">收件箱　{mails.length}</span><span>垃圾邮件　3</span><span>已发送邮件</span><span>草稿　2</span><span>存档</span></aside><section><div className="gp-mail-list">{mails.map((mail,index)=><button className={selected===index?"active":""} key={mail.subject} onClick={()=>setSelected(index)}><b>{mail.from}{Boolean((mail as {ad?:boolean}).ad)&&<em>广告</em>}</b><small>{mail.date}</small><strong>{mail.subject}</strong><span>{mail.preview}</span></button>)}</div><article>{current.body}</article></section></div>
}

function GupanMailbox(){
  const [selected,setSelected]=useState(0);
  const mails=[
    {from:"Northbridge Student Services",date:"2022/11/12",subject:"Your temporary leave request has been received",preview:"Your request remains under review.",body:<><small>Student Services &lt;services@northbridge.example&gt;</small><h2>Temporary leave request received</h2><p>Dear Gu Pan, your request has been received. Your university account and mailbox will remain available during the review period.</p><p>Reference: LOA-GP-221112</p></>},
    {from:"NB Community Forum",date:"2022/11/07",subject:"Weekly digest: 14 discussions you may have missed",preview:"Housing exchange · International student board…",body:<><small>Northbridge Community Forum &lt;digest@forum.northbridge.example&gt;</small><h2>Your weekly forum digest</h2><p>Housing exchange, international student welcome board, campus safety discussion and fourteen other threads received new replies this week.</p><p className="gp-mail-muted">You receive this automated digest because your university community account is active.</p><a className="gp-hidden-school-link" href="/university" target="_blank" rel="noopener noreferrer">Manage forum account at Northbridge University ↗</a></>},
    {from:"Campus Arts Newsletter",date:"2022/10/31",subject:"November exhibitions and open studios",preview:"Three student exhibitions open this month.",body:<><small>College of Arts & Media</small><h2>November exhibitions</h2><p>Open studios, visiting artist talks and student exhibitions will continue throughout November.</p><p>Events are open to registered students and alumni.</p></>},
    {from:"Library Notices",date:"2022/10/28",subject:"Automatic renewal confirmation",preview:"2 borrowed items renewed until December.",body:<><small>Northbridge Libraries</small><h2>Automatic renewal confirmation</h2><p>Two borrowed items have been renewed. No action is required.</p></>}
  ];
  return <div className="gp-mailbox"><aside><b>Outlook</b><button>新邮件</button><span className="active">收件箱　4</span><span>草稿　1</span><span>已发送邮件</span><span>存档</span></aside><section><div className="gp-mail-list">{mails.map((mail,index)=><button className={selected===index?"active":""} key={mail.subject} onClick={()=>setSelected(index)}><b>{mail.from}</b><small>{mail.date}</small><strong>{mail.subject}</strong><span>{mail.preview}</span></button>)}</div><article>{mails[selected].body}</article></section></div>
}

function EdgeBrowser({owner}:{owner:Owner}){
  const [query,setQuery]=useState("");
  const [searched,setSearched]=useState("");
  const submit=()=>setSearched(query.trim());
  const normalized=searched.toLowerCase();
  const school=/(northbridge|north\s*bridge|北桥|大学|学校|教务)/i.test(searched);
  const hospital=/(north[\s-]*harbor|northharbor|mynorthharbor|medical\s*center|patient\s*portal|医院|医疗|患者门户)/i.test(searched);
  const hengmu=/(恒慕|hengmu|婚姻家庭|婚介)/i.test(searched);
  const results:EdgeResult[]=[
    ...(owner==="shen"&&/(顾盼|gu\s*pan|gupan|向阳处)/i.test(searched)?[{domain:"weibo.com/u/gpan_sunward",title:"向阳处没有窗的微博",snippet:"顾盼的公开微博主页、相册与近期动态。",url:"/weibo/gupan"}]:[]),
    ...(school?[{domain:"www.northbridge.example",title:"Northbridge University｜北桥大学",snippet:"课程、学生服务、校园目录与学生社区系统。",url:"/university"}]:[]),
    ...(owner==="shen"&&/(远帆|互助会|yuanfan|yf\s*connect)/i.test(searched)?[{domain:"yuanfan-community.example",title:"远帆社区互助会",snippet:"为留学生提供生活互助、危机转介与志愿者服务。",url:"/yuanfan"}]:[]),
    ...((owner==="shen"||owner==="liuhan")&&hengmu?[{domain:"www.hengmu-family.example",title:"恒慕婚姻家庭服务集团",snippet:"婚姻咨询、家庭协调与定制礼仪服务。",url:"/hengmu"}]:[]),
    ...(hospital?[{domain:"portal.northharbor-med.example",title:"MyNorthHarbor Medical Network",snippet:"北港（海外）医疗集团患者服务、历史病例与检验结果门户。",url:"/hospital"}]:[]),
    ...(owner==="shen"&&/(北港寄存|寄存中心|north\s*harbor\s*storage|b-?17|临港大道|harborfront)/i.test(searched)?[{domain:"North Harbor City Guide · OVERSEAS",title:"North Harbor Storage Center｜北港寄存中心",snippet:"17 Harborfront Avenue, Seabreeze District, North Harbor。营业时间 09:00—18:00；具体仓位与授权信息不对外公开。",hint:"可在桌面“地图”中搜索英文地址或机构名",local:true}]:[])
  ];
  const ownerName=owner==="shen"?"沈望":owner==="gupan"?"顾盼":"刘涵";
  const renderResult=(item:EdgeResult,index:number)=>{
    const content=<><small>{item.domain}</small><b>{item.title}</b><span>{item.snippet}</span>{item.hint&&<em>{item.hint}</em>}</>;
    return item.url
      ?<a className="edge-result" href={item.url} target="_blank" rel="noopener noreferrer" key={`${item.title}-${index}`}>{content}</a>
      :<article className={`edge-result ${item.local?"local":""}`} key={`${item.title}-${index}`}>{content}</article>;
  };
  return <div className={`edge-browser edge-${owner}`}>
    <div className="edge-tabs"><span className="active"><i>e</i>{searched?`${searched} - 搜索`:"新建标签页"}<button aria-label="关闭标签页">×</button></span><button aria-label="新建标签页">＋</button></div>
    <div className="edge-toolbar"><span>←　→　↻</span><label><i>⌕</i><input value={query} onChange={event=>setQuery(event.target.value)} onKeyDown={event=>event.key==="Enter"&&submit()} placeholder="搜索或输入网址"/></label><button className="edge-submit" onClick={submit}>搜索</button><span>☆　⋯</span></div>
    <section>
      {!searched?<div className="edge-home"><b>e</b><small>{ownerName}的 Microsoft Edge</small><h1>从 Web 搜索</h1><div className="edge-home-search"><input value={query} onChange={event=>setQuery(event.target.value)} onKeyDown={event=>event.key==="Enter"&&submit()} placeholder="输入人物、机构或关键词"/><button onClick={submit} aria-label="搜索">⌕</button></div></div>:<div className="edge-results"><header><small>搜索结果</small><h2>{searched}</h2><span>已筛选广告与重复内容</span></header>
        {results.map(renderResult)}
        {results.length===0&&<div className="edge-no-result"><i>⌕</i><b>没有找到相关结果</b><p>请检查关键词，或尝试搜索完整的人名、机构名和地址。</p></div>}
        <footer>安全搜索已开启 · 搜索词：{normalized}</footer>
      </div>}
    </section>
  </div>
}

function CaseArchive({mode}:{mode:GameMode|null}){
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    const sync=()=>setRevision(value=>value+1);
    window.addEventListener("storage",sync);
    window.addEventListener("jia-progress",sync);
    window.addEventListener("jia-wechat-notification",sync);
    return()=>{window.removeEventListener("storage",sync);window.removeEventListener("jia-progress",sync);window.removeEventListener("jia-wechat-notification",sync)};
  },[]);
  void revision;
  let prototypeSeen:string[]=[];
  try{
    const data=JSON.parse(localStorage.getItem("jia-prototype")||"{}");
    prototypeSeen=Array.isArray(data.seen)?data.seen:[];
  }catch{}
  const openingStep=Number(localStorage.getItem("jia-lh-opening-step-v3")||0);
  const facts=[
    {ready:openingStep>0,title:"顾盼可能已经回国",detail:"刘涵从老小区听到了顾家的婚讯，但消息来源和新郎身份仍不明确。"},
    {ready:localStorage.getItem("jia-storage-reached")==="true",title:"B-17寄存仓身份核验完成",detail:"登记人为顾盼，授权取件人为沈望；寄存物即将进入到期清理流程。"},
    {ready:localStorage.getItem("jia-gupan-pc-unlocked")==="true",title:"顾盼旧电脑已经挂载",detail:"设备最后活动时间停在2022年11月17日，仍需使用恋爱纪念日登录。"},
    {ready:localStorage.getItem("jia-gupan-computer-unlocked")==="true",title:"旧电脑登录成功",detail:"个人文件、浏览器缓存和离线微信备份已经可以继续调查。"},
    {ready:prototypeSeen.includes("medical"),title:"顾盼的医疗记录",detail:"她曾报告意识丧失、记忆缺失及疑似药物促成的侵犯，并保存了相关证据。"},
    {ready:prototypeSeen.includes("hq-treatment"),title:"郝倩的治疗与远帆转介",detail:"顾盼承担了治疗费用，转介编号指向远帆社区互助会。"},
    {ready:localStorage.getItem("jia-yuanfan-management-group")==="true",title:"远帆长期保留成员资料",detail:"管理群确认住址、紧急联系人和旧转介档案被录入YF Connect。"},
    {ready:localStorage.getItem("jia-olddriver-group")==="true",title:"老司机夜航群",detail:"汽车黑话并非讨论驾驶，HM-2217与2022年10月27日的群文件有关。"},
    {ready:localStorage.getItem("jia-sealed-evidence-unlocked")==="true",title:"远帆封存证据",detail:"多名受害者共享相同的管理员、设备、药物控制用语及资金路径。"},
    {ready:localStorage.getItem("jia-liuhan-address-reached")==="true",title:"晴川公寓4栋602室",detail:"残缺求救、IP节点和地址候选交叉指向同一地点。"},
    {ready:localStorage.getItem("jia-liuhan-phone-obtained")==="true",title:"顾盼的旧手机",detail:"手机保留了旧电脑微信密码，并提示沈望仍拥有情侣空间主人权限。"},
    {ready:localStorage.getItem("jia-hengmu-unlocked")==="true",title:"恒慕“圆满方案”",detail:"原婚礼已转为特殊家庭委托，委托标的被送往永安礼仪园。"}
  ];
  const confirmed=facts.filter(item=>item.ready);
  const nextHint=
    openingStep<8?"完成与刘涵的微信对话，确认B-17寄存仓的存在。":
    localStorage.getItem("jia-storage-reached")!=="true"?"读取B-17到期邮件，在地图中搜索寄存中心地址。":
    localStorage.getItem("jia-gupan-pc-unlocked")!=="true"?"查看抵达后的新邮件，将附件解压到桌面。":
    localStorage.getItem("jia-gupan-computer-unlocked")!=="true"?"从“我的日记”确认恋爱纪念日，尝试登录顾盼旧电脑。":
    !prototypeSeen.includes("medical")||!prototypeSeen.includes("hq-treatment")?"检查顾盼的个人文件，并分别查询两份医疗记录。":
    localStorage.getItem("jia-hd-added")!=="true"?"从远帆公开主页寻找韩铎的联系方式。":
    localStorage.getItem("jia-yuanfan-management-group")!=="true"?"利用大学官网建立可验证的学生身份，再提交给韩铎。":
    localStorage.getItem("jia-sealed-evidence-unlocked")!=="true"?"追查老司机夜航群，取得远帆后台的封存搜索暗语。":
    localStorage.getItem("jia-liuhan-phone-obtained")!=="true"?"切换到刘涵电脑，利用残缺地址和IP记录定位顾盼。":
    localStorage.getItem("jia-hengmu-unlocked")!=="true"?"检查旧请柬和服务码，追查恒慕的方案变更。":
    "现有证据已经覆盖海外侵害、国内拘禁与遗体转运，等待最后汇总。";
  return <div className="pc-document pc-case-archive">
    <small>沈望 · 私人调查档案</small>
    <header><div><h2>顾盼为什么离开？</h2><p>只记录玩家已经亲自确认的事实。</p></div><strong>{confirmed.length} / {facts.length}</strong></header>
    {mode==="normal"?<section className="case-current-hint"><small>通灵模式 · 当前建议</small><p>{nextHint}</p></section>:<p className="case-hardcore-note">真实模式：档案保留已确认事实，但不显示下一步方向。</p>}
    <section className="case-evidence-list">
      {confirmed.length>0?confirmed.map(item=><article key={item.title}><b>{item.title}</b><p>{item.detail}</p></article>):<div className="case-empty"><b>尚未确认调查证据</b><p>查看邮件、聊天、文件和网页后，确认内容会自动收录在这里。</p></div>}
    </section>
  </div>;
}

function ShenDiary(){
  const [entry,setEntry]=useState(0);
  const entries=[
    {date:"2018年10月21日",title:"左望，右盼",text:"今天是艺术展开幕。她忙了一整晚，直到最后一张标签贴正，才想起来自己还没有拍照留念，我心里暗喜，我的机会终于来啦！\n\n摄影社的人让我们靠近一点，”我在左边，她紧靠右，第一张照片，不太敢亲密的“。\n\n散场后，我们绕着校园走了很久，谁也不愿回宿舍，谁也不愿先开口正式表白，只是在时间快要走到第二天的路口，我牵住了她的手。\n\n从今天开始，我们不再只是搭档。",image:"/memories/art-show-2018.png",caption:"大学校园艺术展 · 我们确认关系的那一天"},
    {date:"2019年5月3日",title:"从海岸线开始",text:"第一次一起旅行。她带了一张折得乱七八糟的地图，坐在湖边，把想去的地方一个个圈起来。\n\n她说世界这么大，如果只在一个地方生活，会不会太可惜。\n\n我问她要从哪里开始。她想了一会儿，在海岸线上画了一颗很小的太阳：“我喜欢海，就找一个海边的城市吧。等我们都忙完，一起去。”",image:"/memories/lake-trip-2019.png",caption:"湖边 · 地图上的第一颗太阳"},
    {date:"2019年10月21日",title:"一周年纪念",text:"送她一条酒红色围巾。她怕冷，却总嫌围巾麻烦，出门十次有九次会忘。卡片上我没署名，只画了两只眼睛：左边那只望着右边。\n\n她一下就看懂了，因为这是只有我们知道的暗号。临走前，她把围巾绕了两圈：“我保证，这次不会忘带围巾啦。”",image:"/memories/scarf-anniversary.png",caption:"一周年礼物 · 酒红色羊毛围巾"},
    {date:"2020年12月24日",title:"第一场异地的雪",text:"好久没记日记。\n\n这一年忙着毕业，我找了一份还算得体的工作，而她真的去了一个海边城市开启她的留学生涯。\n\n不同时间线的我们忙碌了许多，却保持着跨时差的视频，异地固然辛苦，但看到她的笑容什么疲惫都烟消云散了。\n\n今天她那边下雪了。视频接通时，她把手机放在窗边，让我看了十分钟的夜景，其实我更喜欢地是她看向雪的表情。我们有一搭没一搭的聊着，真希望时间静止在这一刻。\n\n挂断前她问：“以后真的能在同一个地方吗？”我说当然。因为我觉得，只要两个人都愿意坚持，距离就不是什么问题。",image:"/memories/long-distance-winter-2020.png",caption:"第一场异地的雪"},
    {date:"2021年8月17日",title:"没有走完的地图",text:"她把那张旧地图重新画了一遍，空白的地方比去过的地方多得多。原先等毕业以后，要把这些空白一点点填满，如今我却有点走不开。不过我们约定好，不管以后哪个国家、哪座城市，都要在同一个地方开始新的生活。\n\n她还在海边画了一颗更大的太阳。就像两年前那样。我笑她记性太好，她说：“重要的事当然要记得。”",image:"/memories/travel-map-2021.png",caption:"旅行地图 · 海岸线旁的又一个太阳"},
    {date:"2022年1月7日",title:"来之不易的见面",text:"机场分别前，她还在讲下一学年的计划：想继续画画，想申请新的工作室，也想等我稳定以后一起搬家。我一边听，一边盯着登机提醒，怕错过最后的登机通知。\n\n她问我有没有认真听。我说以后还有很多时间，可以慢慢讲。\n\n她叹了口气，脸上没有生气的表情，只是紧紧抱了我一下。",faded:"现在想起来，那竟然是最后一次见面。",image:"/memories/airport-goodbye-2022.png",caption:"机场出发层"},
    {date:"2022年11月18日",title:"那封信",text:"最近好多事发生，可能是我忽视了她，也可能是上次纪念日没来得及把礼物寄到她手上，她最近像是变了一个人，不再跟我分享日常，连视频也不开...\n\n凌晨醒来，看见她在发来的长消息。她说她累了，说我们不适合继续，也说不要再找她。我很着急，太着急了，一下子乱了方寸，给她打电话，已经无法接通。我彻夜难眠，寻找共友，他们却只告诉我都拉黑了，为什么，为什么会如此决绝。\n\n我感觉我所有的力气，都被留在了这一天。",image:"/memories/breakup-message-2022.png",caption:"2022年11月18日凌晨"}
  ];
  const x=entries[entry];
  return <div className="pc-diary"><aside><h3>我的日记</h3>{entries.map((e,i)=><button className={entry===i?"active":""} onClick={()=>setEntry(i)} key={e.date}><small>{e.date}</small><b>{e.title}</b></button>)}</aside><article><small>{x.date}</small><h1>{x.title}</h1><p>{x.text}</p>{"faded" in x&&x.faded&&<p className="pc-diary-faded">{x.faded}</p>}{x.image&&<figure><img src={x.image} alt={x.caption}/><figcaption>{x.caption}</figcaption></figure>}</article></div>
}

function GupanWeChatArchive(){
  const [offline,setOffline]=useState(false);
  const [archiveUnlocked,setArchiveUnlocked]=useState(false);
  const [password,setPassword]=useState("");
  const [passwordError,setPasswordError]=useState(false);
  useEffect(()=>{
    const sync=()=>{
      setArchiveUnlocked(localStorage.getItem("jia-gp-wechat-unlocked-v5")==="true");
    };
    const frame=window.requestAnimationFrame(sync);
    window.addEventListener("storage",sync);
    window.addEventListener("jia-progress",sync);
    return()=>{window.cancelAnimationFrame(frame);window.removeEventListener("storage",sync);window.removeEventListener("jia-progress",sync)};
  },[]);
  const unlockArchive=()=>{
    if(password.trim()!=="gp2022wxpass"){setPasswordError(true);return}
    localStorage.setItem("jia-gp-wechat-unlocked-v5","true");
    setArchiveUnlocked(true);
    setPasswordError(false);
    window.dispatchEvent(new Event("jia-progress"));
  };
  if(!offline)return <div className="gp-wx-expired"><div><span>微</span><h2>登录状态已过期</h2><p>此设备已长时间未连接微信。为保护账号安全，需要在手机端重新确认登录。</p><button disabled>使用手机微信扫码登录</button><small>当前无法连接账号服务器</small></div><section>{archiveUnlocked?<><b>本机聊天记录已解锁</b><p>设备中保留了一份截至 2022年11月17日 的本地缓存。记录可能不完整，且不包含云端新消息。</p><button onClick={()=>setOffline(true)}>查看本机聊天记录（只读）</button></>:<><b>本机聊天记录已加密</b><p>这份本地缓存需要微信备份密码才能解密。正确密码保存在与本机绑定的旧手机中。</p><div className="gp-wx-password"><input type="password" value={password} onChange={event=>{setPassword(event.target.value);setPasswordError(false)}} onKeyDown={event=>event.key==="Enter"&&unlockArchive()} placeholder="输入微信备份密码" autoComplete="off"/><button onClick={unlockArchive}>解锁聊天记录</button></div>{passwordError&&<p className="gp-wx-password-error">密码错误，无法解密本地记录。</p>}<small>可以先尝试输入；手机尚未找到时不会显示额外提示。</small></>}</section></div>;
  return <div className="gp-wx-offline"><header><span><b>离线记录</b><small>最后同步：2022年11月17日 03:42 · 仅限本机缓存</small></span><button onClick={()=>setOffline(false)}>退出记录</button></header><div><WeChatDesktop owner="gupan" offline/></div></div>;
}

function MapApp({owner}:{owner:Owner}){
  const [query,setQuery]=useState("");
  const [searched,setSearched]=useState("");
  const [reached,setReached]=useState(false);
  const [phoneObtained,setPhoneObtained]=useState(false);
  useEffect(()=>{
    const frame=window.requestAnimationFrame(()=>{
      const wasReached=localStorage.getItem(owner==="shen"?"jia-storage-reached":"jia-liuhan-address-reached")==="true";
      setReached(wasReached);
      if(wasReached)setSearched(owner==="shen"?"北港寄存中心":"晴川公寓4栋602室");
      if(owner==="liuhan")setPhoneObtained(localStorage.getItem("jia-liuhan-phone-obtained")==="true");
    });
    return()=>window.cancelAnimationFrame(frame);
  },[owner]);
  const normalized=searched.replace(/\s/g,"").toLowerCase();
  const valid=owner==="shen"?(normalized.includes("临港大道17号")||normalized.includes("17harborfrontavenue")||normalized.includes("北港寄存中心")||normalized.includes("northharborstoragecenter")):(normalized.includes("晴川公寓")&&(/602|4栋/.test(normalized)));
  const search=()=>setSearched(query.trim());
  const go=()=>{if(!valid)return;localStorage.setItem(owner==="shen"?"jia-storage-reached":"jia-liuhan-address-reached","true");setReached(true);window.dispatchEvent(new Event("jia-progress"))};
  const obtainPhone=()=>{localStorage.setItem("jia-liuhan-phone-obtained","true");setPhoneObtained(true);window.dispatchEvent(new Event("jia-progress"))};
  return <div className="pc-map-search">
    <header><b>{owner==="shen"?"North Harbor Map · 海外":"临川地图 · 国内"}</b><div><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="搜索地点、道路或完整地址"/><button onClick={search}>搜索</button></div></header>
    <section className="pc-map-canvas"><span className="map-road a"/><span className="map-road b"/><span className="map-water"/>{searched&&<i className={`map-result-pin ${valid?"useful":""}`}>●</i>}</section>
    <aside>{searched?<><small>搜索结果</small><h2>{valid?(owner==="shen"?"North Harbor Storage Center · Zone B":"晴川公寓 · 4栋602室"):searched}</h2><p>{valid?(owner==="shen"?"17 Harborfront Avenue, Seabreeze District, North Harbor · OVERSEAS":"临川市青槐区长宁路117号"):"已在地图上显示该地点。当前任务与此地点没有关联。"}</p><button disabled={!valid||reached} onClick={go}>{reached?"已到达，剧情已更新":"前往这里"}</button>{reached&&<strong>{owner==="shen"?"海外到访身份核验完成。新的邮件已送达。":"已进入现场。窗边发现一部屏幕碎裂的手机。"}</strong>}{owner==="liuhan"&&reached&&<div className="map-phone-find"><b>现场物品 · 顾盼的手机</b><p>手机仍能开机，内部数据需要带回后进行离线提取。</p><button disabled={phoneObtained} onClick={obtainPhone}>{phoneObtained?"已取得，数据已加入下载":"取得顾盼的手机"}</button></div>}</>:<div className="map-placeholder"><b>搜索任意地点</b><p>地图会显示结果；只有与当前线索相关的地址可以前往。</p></div>}</aside>
  </div>
}

function WeChatDesktop({owner,offline=false}:{owner:Owner;offline?:boolean}){
  const [section,setSection]=useState<"chats"|"contacts"|"moments"|"add">("chats");
  const [query,setQuery]=useState("");
  const [added,setAdded]=useState(false);
  const [hdAdded,setHdAdded]=useState(false);
  const [groupJoined,setGroupJoined]=useState(false);
  const [driverJoined,setDriverJoined]=useState(false);
  const [hqStage,setHqStage]=useState(0);
  const [openingStep,setOpeningStep]=useState(0);
  const [result,setResult]=useState<"hq"|"driver"|null>(null);
  const [driverRequest,setDriverRequest]=useState(false);
  const [driverAnswer,setDriverAnswer]=useState("");
  const [driverError,setDriverError]=useState(false);
  const [chat,setChat]=useState(owner==="gupan"?"郝倩":owner==="liuhan"?"沈望":"刘涵");
  const [profile,setProfile]=useState<string|null>(null);
  const [momentProfile,setMomentProfile]=useState<string|null>(null);
  const [draft,setDraft]=useState("");
  const [sent,setSent]=useState<{who:string;text:string}[]>([]);
  const messagesRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{const sync=()=>{setAdded(localStorage.getItem("jia-hq-added")==="true");setHdAdded(localStorage.getItem("jia-hd-added")==="true");setGroupJoined(localStorage.getItem("jia-yuanfan-management-group")==="true");setDriverJoined(localStorage.getItem("jia-olddriver-group")==="true");setHqStage(Number(localStorage.getItem("jia-hq-stage")||0));setOpeningStep(Number(localStorage.getItem("jia-lh-opening-step-v3")||0))};sync();window.addEventListener("jia-progress",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("jia-progress",sync);window.removeEventListener("storage",sync)}},[]);
  useEffect(()=>{const frame=window.requestAnimationFrame(()=>{const panel=messagesRef.current;if(panel)panel.scrollTo({top:panel.scrollHeight,behavior:"smooth"})});return()=>window.cancelAnimationFrame(frame)},[chat,hqStage,sent.length]);
  const people=owner==="shen"?[
    {name:"刘涵",src:"/characters/liu-han.png",note:"她回国了？"},
    ...(driverJoined?[{name:"老司机夜航群",src:"/olddriver-group.svg",note:"今晚的路书发群文件"}]:[]),
    ...(hdAdded?[{name:"韩铎",src:"/characters/han-duo.png",note:"远帆迎新？你哪个学校的"}]:[]),
    ...(groupJoined?[{name:"远帆互助会·管理群",src:"/characters/han-duo.png",note:"韩铎邀请你加入了群聊"}]:[]),
    ...(added?[{name:"郝倩",src:"/characters/hao-qian.png",note:"你是怎么找到我的？"}]:[])
  ]:owner==="gupan"?[{name:"一家人",src:"/family-group.svg",note:"回来以后就听话"},{name:"郝倩",src:"/characters/hao-qian.png",note:"你怎么回到家的？"},{name:"沈望",src:"/characters/shen-wang.png",note:"语音通话 02:17"}]:[{name:"沈望",src:"/characters/shen-wang.png",note:openingStep>=liuHanOpeningExchanges.length?"嗯。机票定了告诉我。":"还没休息？"},{name:"陈放",src:"/characters/chen-fang.png",note:"有实证再找我"}];
  const current=people.find(p=>p.name===chat)||people[0];
  const specialized=(owner==="shen"&&["刘涵","韩铎","远帆互助会·管理群","老司机夜航群"].includes(current.name))||(owner==="liuhan"&&current.name==="沈望");
  const addFriend=()=>{if(offline)return;localStorage.setItem("jia-hq-added","true");setAdded(true);setChat("郝倩");setSection("chats");window.dispatchEvent(new Event("jia-wechat-notification"))};
  const searchContact=()=>{
    if(offline)return;
    const normalized=query.toLowerCase().replace(/^wx\s*:\s*/,"").trim();
    setDriverRequest(false);setDriverError(false);
    if(normalized==="hqian_17")setResult("hq");
    else if(owner==="shen"&&normalized==="olddriver")setResult("driver");
    else setResult(null);
  };
  const joinDriverGroup=()=>{
    if(driverAnswer.replace(/\s/g,"")!=="风从北岸来"){setDriverError(true);return}
    localStorage.setItem("jia-olddriver-group","true");
    setDriverJoined(true);setDriverError(false);setChat("老司机夜航群");setSection("chats");
    window.dispatchEvent(new Event("jia-progress"));
  };
  const advanceHq=(next:number)=>{localStorage.setItem("jia-hq-stage",String(next));setHqStage(next)};
  const send=(value?:string)=>{if(offline)return;const text=(value??draft).trim();if(!text)return;setSent(v=>[...v,{who:current.name,text}]);setDraft("");if(current.name==="郝倩"&&owner==="shen"){if(hqStage===0&&/(YF-HQ-0214|治疗|港湾)/i.test(text))advanceHq(1);else if(hqStage===1&&hdAdded&&/(韩铎|后台|朋友圈|截图)/.test(text))advanceHq(2);else if(hqStage===2&&/(旧账号|档案|顾盼)/.test(text))advanceHq(3)}};
  const profileData:Record<string,{src:string;wx:string;intro:string}>={沈望:{src:"/characters/shen-wang.png",wx:"zw_1021",intro:"有些答案，值得等很久。"},顾盼:{src:"/characters/gu-pan.png",wx:"gpan_sunward",intro:"向阳处。"},刘涵:{src:"/characters/liu-han.png",wx:"liuhan_lc",intro:"临川，偶尔摄影。"},郝倩:{src:"/characters/hao-qian.png",wx:"hqian_17",intro:"现在的生活来之不易。"},韩铎:{src:"/characters/han-duo.png",wx:"hd_047_abroad",intro:"留学生活｜活动联络"},陈放:{src:"/characters/chen-fang.png",wx:"chenfang_1203",intro:"请勿通过微信报警。"}};
  const personalMoments:Record<string,{text:string;time:string;wedding?:boolean}[]> = {
    沈望:[{text:"忙完这阵，想把以前没整理完的照片都洗出来。硬盘里的东西越放越多，人倒是越来越懒。",time:"2025年11月23日"},{text:"艺术展撤展。谢谢每个来看作品的人。",time:"2018年10月28日"}],
    顾盼:[{text:"暂时离开一阵。不是放弃，只是想先把自己照顾好。",time:"2022年11月16日"},{text:"新画还没完成。向阳处没有窗，也可以自己凿一扇。",time:"2022年10月22日"}],
    刘涵:[{text:"临川今晚雾很大，桥上的灯倒是比平时好看。",time:"2025年12月1日"},{text:"旧相机修好了。试卷拍完才发现，最喜欢的还是那些没对准焦的。",time:"2025年10月9日"}],
    郝倩:[{text:"终于把婚礼照片整理完。日子会继续，过去的就留在过去吧。",time:"2025年10月18日",wedding:true},{text:"有些信寄出去以后，就不应该再等回复。",time:"2024年6月7日"},{text:"换了号码。校友请备注学校与姓名。",time:"2022年12月2日"}],
    韩铎:[{text:"远帆这破后台又让我补档。YF-HQ-0214都结案半年了还在列表里，迟早把 /staff/console 做成书签。",time:"2022年10月19日"},{text:"迎新结束。拍照别只顾着笑，名单、住址、紧急联系人一个都不能漏。",time:"2022年9月4日"}],
    陈放:[{text:"有情况请先保护现场、保存原始记录。网上转发一百次，不如一次完整取证。",time:"2025年11月30日"},{text:"又是夜班。临川降温，出门记得加衣。",time:"2025年11月18日"}]
  };
  const selfName=owner==="shen"?"沈望":owner==="gupan"?"顾盼":"刘涵";
  const momentName=momentProfile||selfName;
  const momentAvatar=profileData[momentName]?.src||profileData[selfName].src;
  return <div className={`wx-app ${offline?"wx-app-offline":""}`} onClick={e=>{const el=e.target as HTMLElement;const profileTarget=el.closest<HTMLElement>("[data-profile]");const name=profileTarget?.dataset.profile||(el.tagName==="IMG"?el.getAttribute("alt"):null);if(name&&name!=="本人"&&profileData[name])setProfile(name)}} onKeyDown={e=>{if(!offline&&e.key==="Enter"&&!e.shiftKey&&(e.target as HTMLElement).tagName==="TEXTAREA"){e.preventDefault();const textarea=e.target as HTMLTextAreaElement;send(textarea.value);textarea.value=""}}}>
    <nav><button className="wx-self-avatar" onClick={()=>setProfile(owner==="shen"?"沈望":owner==="gupan"?"顾盼":"刘涵")}><img src={owner==="shen"?"/characters/shen-wang.png":owner==="gupan"?"/characters/gu-pan.png":"/characters/liu-han.png"} alt="本人"/></button><button className={section==="chats"?"active":""} onClick={()=>setSection("chats")}>◉<small>聊天</small></button><button className={section==="contacts"?"active":""} onClick={()=>setSection("contacts")}>♙<small>通讯录</small></button><button className={section==="moments"?"active":""} onClick={()=>{setMomentProfile(null);setSection("moments")}}>◎<small>朋友圈</small></button><button className={section==="add"?"active":""} onClick={()=>setSection("add")}>＋<small>添加</small></button></nav>
    {section==="chats"&&<><aside className="wx-list"><header>⌕ 搜索　 <button onClick={()=>setSection("add")}>＋</button></header>{people.map(p=><button className={chat===p.name?"active":""} key={p.name} onClick={()=>setChat(p.name)}><img src={p.src} alt={p.name}/><span><b>{p.name}</b><small>{p.note}</small></span></button>)}</aside>{!specialized&&<section className="wx-conversation"><header>{current.name}</header><div className="wx-messages" ref={messagesRef}>{current.name==="一家人"&&owner==="gupan"?<GupanFamilyChat/>:current.name==="沈望"&&owner==="gupan"?<GupanShenBreakupChat/>:current.name==="郝倩"&&owner==="shen"?<><div className="wx-system">你们已经成为好友，可以开始聊天了</div><WxBubble src="/characters/shen-wang.png" mine text="我是沈望。顾盼以前提过你。"/><WxBubble src="/characters/hao-qian.png" text="你是怎么找到我的？"/><WxBubble src="/characters/shen-wang.png" mine text="她留下了一封你的信。我想知道2022年10月发生了什么。"/><WxBubble src="/characters/hao-qian.png" text="我已经写过道歉了。那时候我也没有办法。"/>{hqStage===0&&<button className="wx-confront" onClick={()=>advanceHq(1)}>发送港湾记录：YF-HQ-0214</button>}{hqStage>=1&&<><WxBubble src="/characters/shen-wang.png" mine text="港湾记录显示顾盼替你付了治疗费，转介编号是YF-HQ-0214。"/><WxBubble src="/characters/hao-qian.png" text="远帆只是转介我。顾盼自己要管我，我没有让她付钱。韩铎当时也在那里做联络。"/>{hqStage===1&&<button className="wx-confront" onClick={()=>advanceHq(2)} disabled={!hdAdded}>出示韩铎朋友圈中的后台截图{!hdAdded?"（需先查看韩铎）":""}</button>}</>}{hqStage>=2&&<><WxBubble src="/characters/shen-wang.png" mine text="韩铎的朋友圈拍到了YF Connect，屏幕上正是你的转介编号。后台为什么会有顾盼的资料？"/><WxBubble src="/characters/hao-qian.png" text="我治疗后做过短期志愿者。韩铎有正式工作人员权限，他能看住址和紧急联系人。我离开后那个旧账号一直没注销。"/>{hqStage===2&&<button className="wx-confront" onClick={()=>advanceHq(3)}>追问旧账号与顾盼档案</button>}</>}{hqStage>=3&&<><WxBubble src="/characters/hao-qian.png" text="旧账号是 hq.volunteer，历史口令 YF-0214-GP。你只能看到和我有关的档案。顾盼救我那天，也被他们建成了关联人。"/><a className="wx-shared-link" href="/yuanfan" target="_blank" rel="noopener noreferrer"><i>远</i><span><b>YF Connect · 历史志愿者入口</b><small>账号 hq.volunteer · 口令 YF-0214-GP</small></span><em>打开 ↗</em></a></>}</>:current.name==="陈放"?<><WxBubble src="/characters/chen-fang.png" text="我查到的不是失踪记录。她家属在11月29日报过一起非正常死亡。警方到过现场。"/><WxBubble src="/characters/liu-han.png" mine text="死亡？那为什么她家还在传她要结婚？遗体现在在哪里？"/><WxBubble src="/characters/chen-fang.png" text="警方只确认了表面死因，不知道你说的三日拘禁。遗体后来由家属委托的礼仪公司接走。我给你开脱敏记录，授权码：CF-1203-LH"/><a className="wx-shared-link" href="/police" target="_blank" rel="noopener noreferrer"><i>警</i><span><b>临川公安 · 线索协查档案</b><small>死亡警情与移交记录 · 有效期2小时</small></span><em>打开 ↗</em></a></>:<><WxBubble src="/characters/hao-qian.png" text="我提前走了。应该是酒吧的人送你的。"/><WxBubble src="/characters/gu-pan.png" mine text="他们怎么知道地址？除了你，还有谁有我的钥匙？"/></>}</div><footer><span>☺　📁　✂</span><textarea placeholder="输入消息"/><button>发送</button></footer></section>}</>}
    {section==="contacts"&&<section className="wx-contacts"><header>通讯录</header><button onClick={()=>setSection("add")}>＋　新的朋友</button>{people.map(p=><div key={p.name}><img src={p.src} alt={p.name}/><b>{p.name}</b><small>{p.note}</small></div>)}</section>}
    {section==="add"&&<section className="wx-add"><h2>添加朋友</h2><p>输入微信号、手机号或QQ号</p><div><input value={query} onChange={e=>{setQuery(e.target.value);setResult(null);setDriverRequest(false);setDriverError(false)}} placeholder="微信号"/><button onClick={searchContact}>搜索</button></div>
      {result==="hq"&&<article><img src="/characters/hao-qian.png" alt="郝倩"/><span><b>H.Q. · 郝倩</b><small>微信号：hqian_17　地区：海外</small></span>{added?<em>已添加</em>:<button onClick={addFriend}>添加到通讯录</button>}</article>}
      {result==="driver"&&<article className="wx-driver-result"><img src="/olddriver-group.svg" alt="老司机夜航群"/><span><b>Old Driver · 夜航入口</b><small>微信号：olddriver　仅通过群验证加入</small></span>{driverJoined?<em>已加入</em>:!driverRequest?<button onClick={()=>setDriverRequest(true)}>申请加入群聊</button>:<div className="wx-driver-challenge"><small>入群问题</small><b>2022 秋季夜路安全值班手册中的备用识别语是什么？</b><input value={driverAnswer} onChange={e=>{setDriverAnswer(e.target.value);setDriverError(false)}} placeholder="输入识别语"/><button onClick={joinDriverGroup}>提交答案</button>{driverError&&<p>识别语不正确。群主拒绝了本次申请。</p>}<em>提示：这个答案不在微信里。</em></div>}</article>}
      {!result&&query&&<p className="wx-no-result">未找到该用户。请检查完整微信号。</p>}
    </section>}
    {section==="moments"&&<section className="wx-moments"><div className="wx-moments-cover"><span><b>{momentName}</b><img alt={momentName} src={momentAvatar}/></span></div>{momentProfile?<><div className="wx-personal-moments-label"><button onClick={()=>{setMomentProfile(null);setSection("moments")}}>‹ 返回好友动态</button><span>{momentName}的朋友圈</span></div>{personalMoments[momentName]?.length>0?personalMoments[momentName].map((item,index)=><Moment key={`${momentName}-${index}`} src={momentAvatar} name={momentName} text={item.text} time={item.time} wedding={item.wedding}/>):<div className="wx-empty-moments">该用户暂时没有公开动态。</div>}</>:owner==="shen"&&(added||hdAdded)?<>{hdAdded&&personalMoments.韩铎.map((item,index)=><Moment key={`韩铎-${index}`} src={profileData.韩铎.src} name="韩铎" text={item.text} time={item.time}/>) }{added&&personalMoments.郝倩.map((item,index)=><Moment key={`郝倩-${index}`} src={profileData.郝倩.src} name="郝倩" text={item.text} time={item.time} wedding={item.wedding}/>)}</>:<div className="wx-empty-moments">添加好友后，可以查看对方公开的朋友圈。</div>}</section>}
    {owner==="shen"&&section==="chats"&&current.name==="刘涵"&&<LiuHanOpeningDialogue/>}
    {owner==="liuhan"&&section==="chats"&&current.name==="沈望"&&<ShenWangOpeningMirror/>}
    {owner==="shen"&&section==="chats"&&current.name==="韩铎"&&<HanDuoIdentityCheck/>}
    {owner==="shen"&&section==="chats"&&current.name==="远帆互助会·管理群"&&<YuanfanManagementGroup/>}
    {owner==="shen"&&section==="chats"&&current.name==="老司机夜航群"&&<OldDriverGroup/>}
    {sent.filter(x=>x.who===current.name).length>0&&section==="chats"&&<div className="wx-live-sent">{sent.filter(x=>x.who===current.name).map((x,i)=><p key={i}>{x.text}</p>)}</div>}
    {profile&&profileData[profile]&&<div className="wx-profile-modal" onClick={()=>setProfile(null)}><article onClick={e=>e.stopPropagation()}><button onClick={()=>setProfile(null)}>×</button><header><img src={profileData[profile].src} alt={profile}/><span><h2>{profile}</h2><small>微信号：{profileData[profile].wx}</small></span></header><dl><dt>个人简介</dt><dd>{profileData[profile].intro}</dd><dt>地区</dt><dd>{profile==="郝倩"||profile==="韩铎"?"海外":"中国"}</dd></dl><button className="wx-profile-moments" onClick={()=>{setMomentProfile(profile);setProfile(null);setSection("moments")}}>朋友圈　›</button></article></div>}
  </div>
}

function GupanFamilyChat(){
  return <>
    <div className="wx-system">2022年11月9日　“一家人”群聊记录</div>
    <WxBubble src="/characters/gu-pan.png" mine text="我昨晚在酒吧失去意识，醒来以后身体很不对。我已经到医院了。取证和检查要自费，你们能不能先借我一点？"/>
    <WxBubble src="/family-mother.svg" text="谁让你一个女孩子去那种地方？出了事就找家里，你有没有想过自己的生活作风有问题？"/>
    <WxBubble src="/family-father.svg" text="你真给家里丢脸。别指望我们给你钱。臭B，谁会要你？这种事不准再告诉别人。"/>
    <WxBubble src="/family-brother.svg" text="那你这个月还能不能按时给我打生活费？"/>
    <WxBubble src="/characters/gu-pan.png" mine text="我知道了。我会申请休学，回国工作，医疗费和后续检查我自己承担。"/>
    <WxBubble src="/family-mother.svg" text="回来可以，回家以后就听话。我们给你安排相亲，你必须去见。"/>
    <WxBubble src="/family-father.svg" text="别想回来以后还像在外面一样自由。家里养你这么大，不是让你给家里丢脸的。"/>
    <div className="wx-system wx-sensitive-note">该记录包含受害者指责、言语侮辱与家庭控制内容</div>
  </>
}

function GupanShenBreakupChat(){
  return <>
    <div className="wx-system">2022年11月17日　03:42</div>
    <article className="wx-breakup-letter">
      <header><span>顾盼</span><small>已发送 · 此后无新消息</small></header>
      <p>沈望：</p>
      <p>这段时间我想了很久。我们隔着时差，生活已经越来越不一<em>w</em>样。</p>
      <p>我不想再等你，也不想让你<em>x:</em>继续等我。</p>
      <p>一直跑着实在太累了，我决定停<em>old</em>下来。</p>
      <p>请尊重我的选择，我需要安<em>dr</em>静一会，不要来找我。</p>
      <p>不是因为你做错了什么，只是我不再想和你一起计划以<em>iver</em>后。</p>
      <p>到这里吧。</p>
      <p>顾盼</p>
    </article>
    <div className="wx-system">这封信是本机微信最后同步的记录</div>
  </>
}

function HanDuoIdentityCheck(){
  const [name,setName]=useState("");
  const [year,setYear]=useState("");
  const [major,setMajor]=useState("");
  const [studentId,setStudentId]=useState("");
  const [status,setStatus]=useState<"idle"|"error"|"success">("idle");
  useEffect(()=>{const frame=window.requestAnimationFrame(()=>{if(localStorage.getItem("jia-hd-trusted")==="true")setStatus("success")});return()=>window.cancelAnimationFrame(frame)},[]);
  const verify=()=>{
    const raw=localStorage.getItem("jia-school-profile");
    if(!raw){setStatus("error");return}
    const profile=JSON.parse(raw) as {name:string;year:string;major:string;studentId:string};
    const matches=name.trim()===profile.name&&year.trim()===profile.year&&major.trim().toUpperCase()===profile.major&&studentId.trim().toUpperCase()===profile.studentId;
    if(!matches){setStatus("error");return}
    localStorage.setItem("jia-hd-trusted","true");
    localStorage.setItem("jia-yuanfan-management-group","true");
    setStatus("success");window.dispatchEvent(new Event("jia-progress"));
  };
  return <section className="wx-hd-check">
    <header><img src="/characters/han-duo.png" alt="韩铎"/><span><b>韩铎</b><small>远帆社区联络</small></span></header>
    <div className="wx-hd-thread"><WxBubble src="/characters/han-duo.png" text="远帆迎新？你哪个学校的？最近冒充留学生混活动的人不少。姓名、入学年份、专业代码和完整学号都发我，我查一下。"/>
      {status==="error"&&<><WxBubble src="/characters/shen-wang.png" mine text={`${name} / ${year} / ${major} / ${studentId}`}/><WxBubble src="/characters/han-duo.png" text="对不上。学校社区档案里不是这套信息。资料想清楚再发。"/></>}
      {status==="success"&&<><WxBubble src="/characters/shen-wang.png" mine text="身份资料已按学校社区档案提交。"/><WxBubble src="/characters/han-duo.png" text="查到了，信息能对上。先拉你进管理群，群里的旧资料别往外转。"/><div className="wx-group-invite"><i>远</i><span><b>远帆互助会·管理群</b><small>韩铎邀请你加入群聊</small></span><em>已加入</em></div></>}
    </div>
    {status!=="success"&&<footer><small>必须与大学社区系统中注册的信息完全一致</small><div><input value={name} onChange={e=>setName(e.target.value)} placeholder="姓名"/><input value={year} onChange={e=>setYear(e.target.value)} placeholder="入学年份"/><input value={major} onChange={e=>setMajor(e.target.value)} placeholder="专业代码"/><input value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="完整学号"/></div><button onClick={verify}>发送身份资料</button></footer>}
  </section>
}

function YuanfanManagementGroup(){
  return <section className="wx-hd-check wx-yf-group"><header><i>远</i><span><b>远帆互助会·管理群（17）</b><small>消息免打扰</small></span></header><div className="wx-hd-thread"><div className="wx-system">韩铎邀请你加入了群聊</div><WxBubble src="/characters/han-duo.png" text="新来的先看群公告。活动名单、住址和紧急联系人统一录进 YF Connect，别在群里发原表。"/><WxBubble src="/characters/hao-qian.png" text="以前的转介档案还要补吗？有些关联人的信息不应该一直留着。"/><WxBubble src="/characters/han-duo.png" text="系统没让删就别动。YF-HQ-0214那批我会处理。后台路径还是 /staff/console。"/><div className="wx-group-notice"><b>群公告</b><p>历史资料仅限内部使用。管理员账号不得外借，导出记录由负责人统一归档。</p></div></div></section>
}

function OldDriverGroup(){
  return <section className="wx-hd-check wx-yf-group wx-driver-group"><header><img src="/olddriver-group.svg" alt="老司机夜航群"/><span><b>老司机夜航群（46）</b><small>群聊已开启消息免打扰</small></span></header><div className="wx-hd-thread"><div className="wx-system">你已通过群验证。“Old Driver”邀请你加入了群聊</div><WxBubble src="/characters/han-duo.png" text="新来的先学会看路书。群里不说真名，也别问车是谁的。"/><WxBubble src="/characters/hao-qian.png" text="今晚那辆“新车”状态不对，别再加油了。"/><WxBubble src="/characters/han-duo.png" text="照旧。路线发管理员，记录仪先开，结束以后统一送回车库。"/><WxBubble src="/characters/han-duo.png" text="旧记录别在这里问。远帆后台搜索“女司机”时只认英文连写：womandriver。看完记得清搜索记录。"/><div className="wx-driver-code"><small>群内暗语 · 仅成员可见</small><b>womandriver</b><span>用于 YF Connect 管理后台搜索栏</span></div><div className="wx-group-notice dangerous"><b>群文件 · 2022-10-27_夜航路书</b><p>目标编号 HM-2217 · 集合地点与回程地址已由管理员隐藏。聊天中的“车”“加油”“记录仪”显然不是在讨论驾驶。</p></div></div></section>
}

const liuHanOpeningExchanges:{reply:string;response:string;followup?:string}[]=[
  {reply:"还在加班。怎么了？",response:"就……我妈刚从小区遛弯回来，说顾盼已经回国了，好像快结婚了。"},
  {reply:"谁？",response:"顾盼啊，你俩很久没联系了吧。。"},
  {reply:"是啊..原来已经过去这么久了。蛮好的，祝福她。",response:"没想到你是这个反应，当年你俩可是模范情侣，令人唏嘘啊。。你还ok?"},
  {reply:"时间只能困住念旧的人啊。她已经开始新生活了，我不该再去打扰。",response:"话是这么说，可是，你不好奇新郎是谁吗？"},
  {reply:"我也得有好奇的资格啊，从那天起，真的什么消息都没了。\n消息到底是从哪里传出来的？",response:"我妈说，顾叔叔前阵子在业主群里问过婚宴和彩礼的事。后来又突然不提了。今天不知道谁说漏了嘴，才传成她马上要结婚。",followup:"也许吧。可你别跟我装。她当年一封信就把所有人都断了，你到现在都还不知道为什么。"},
  {reply:"我是想知道原因。但是..",response:"你前两天是不是跟我说收到过一封寄存仓邮件？就是你们留学时存东西的那个。"},
  {reply:"是，还有三天到期，我本来准备让他们直接清掉。",response:"别清。你去一趟吧，把你们当时留下的东西分好，属于她的整理出来，我帮你打听一下她现在的住址，寄还给她吧，就当给这段事一个正式的结尾。"},
  {reply:"好。我去把那些东西收回来，也和过去好好告个别。\n谢了兄弟",response:"嗯。机票定了告诉我。要是在那边睹物思人了，随时找我，别一个人闷着。"}
];

function LiuHanOpeningDialogue(){
  const [step,setStep]=useState(0);
  const threadRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{const frame=window.requestAnimationFrame(()=>setStep(Number(localStorage.getItem("jia-lh-opening-step-v3")||0)));return()=>window.cancelAnimationFrame(frame)},[]);
  useEffect(()=>{const frame=window.requestAnimationFrame(()=>{const panel=threadRef.current;if(panel)panel.scrollTo({top:panel.scrollHeight,behavior:step>0?"smooth":"auto"})});return()=>window.cancelAnimationFrame(frame)},[step]);
  const advance=()=>setStep(value=>{const next=Math.min(liuHanOpeningExchanges.length,value+1);localStorage.setItem("jia-lh-opening-step-v3",String(next));window.dispatchEvent(new Event("jia-progress"));return next});
  return <section className="wx-lh-dialogue">
    <header><button><img src="/characters/liu-han.png" alt="刘涵"/><span><b>刘涵</b><small>微信号：liuhan_lc</small></span></button></header>
    <div className="wx-lh-thread" ref={threadRef}>
      <div className="wx-system">以下为你与刘涵的聊天</div>
      <WxBubble src="/characters/liu-han.png" text="还没休息？"/>
      {liuHanOpeningExchanges.slice(0,step).map((exchange,index)=><div className="wx-exchange" key={index}><WxBubble src="/characters/shen-wang.png" mine text={exchange.reply}/><WxBubble src="/characters/liu-han.png" text={exchange.response}/>{exchange.followup&&<WxBubble src="/characters/liu-han.png" text={exchange.followup}/>}</div>)}
      {step===liuHanOpeningExchanges.length&&<div className="wx-system">对话结束 · 新目标已经明确</div>}
    </div>
    <footer>{step<liuHanOpeningExchanges.length?<><small>点击发送回复</small><button onClick={advance}>{liuHanOpeningExchanges[step].reply}</button></>:<span>已发送　✓</span>}</footer>
  </section>
}

function ShenWangOpeningMirror(){
  const [step,setStep]=useState(0);
  const threadRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const sync=()=>setStep(Number(localStorage.getItem("jia-lh-opening-step-v3")||0));
    const frame=window.requestAnimationFrame(sync);
    window.addEventListener("storage",sync);
    window.addEventListener("jia-progress",sync);
    return()=>{window.cancelAnimationFrame(frame);window.removeEventListener("storage",sync);window.removeEventListener("jia-progress",sync)};
  },[]);
  useEffect(()=>{const frame=window.requestAnimationFrame(()=>{const panel=threadRef.current;if(panel)panel.scrollTo({top:panel.scrollHeight,behavior:"auto"})});return()=>window.cancelAnimationFrame(frame)},[step]);
  return <section className="wx-lh-dialogue wx-lh-mirror">
    <header><button><img src="/characters/shen-wang.png" alt="沈望"/><span><b>沈望</b><small>微信号：zw_1021</small></span></button></header>
    <div className="wx-lh-thread" ref={threadRef}>
      <div className="wx-system">以下为你与沈望的聊天 · 与沈望端同步</div>
      <WxBubble src="/characters/liu-han.png" mine text="还没休息？"/>
      {liuHanOpeningExchanges.slice(0,step).map((exchange,index)=><div className="wx-exchange" key={index}><WxBubble src="/characters/shen-wang.png" text={exchange.reply}/><WxBubble src="/characters/liu-han.png" mine text={exchange.response}/>{exchange.followup&&<WxBubble src="/characters/liu-han.png" mine text={exchange.followup}/>}</div>)}
      {step===liuHanOpeningExchanges.length&&<div className="wx-system">对话结束 · 沈望已决定前往海外北港的寄存中心</div>}
    </div>
    <footer><span>聊天记录与沈望端同步 · 只读</span></footer>
  </section>
}

function WxBubble({src,text,mine}:{src:string;text:string;mine?:boolean}){
  const avatarNames:Record<string,string>={"/characters/shen-wang.png":"沈望","/characters/gu-pan.png":"顾盼","/characters/liu-han.png":"刘涵","/characters/hao-qian.png":"郝倩","/characters/han-duo.png":"韩铎","/characters/chen-fang.png":"陈放","/family-mother.svg":"母亲","/family-father.svg":"父亲","/family-brother.svg":"弟弟"};
  const name=avatarNames[src]||"联系人";
  return <div className={`wx-bubble ${mine?"mine":""}`}><button type="button" className="wx-bubble-avatar" data-profile={name} aria-label={`查看${name}资料`}><img src={src} alt={name}/></button><p>{text}</p></div>
}
function Moment({src,name,text,time,wedding}:{src:string;name:string;text:string;time:string;wedding?:boolean}){return <article className="wx-moment"><img src={src} alt={name}/><div><b>{name}</b><p>{text}</p>{wedding&&<div className="wx-wedding">WEDDING · 2025</div>}<small>{time}　♡　··</small></div></article>}

function FilePreview({owner,file,close}:{owner:Owner;file:string;close:()=>void}){
  const content:Record<string,{tag:string;title:string;body:React.ReactNode;link?:[string,string]}>={
    "B-17现场物品清单.zip":{tag:"压缩档案 · 现场同步",title:"B-17 物品清单",body:<><img className="pc-evidence-image document" src="/evidence/b17-inventory.png" alt="B-17寄存物品提取清单"/><ul><li>一封破损的信.pdf</li><li>GP-LAPTOP-2018.device</li><li>个人照片及文件</li></ul><p>设备状态：休眠。最近一次活动：2022年11月17日。</p></>},
    "暂停学业申请.pdf":{tag:"学校表单 · 已批准",title:"Temporary Leave of Absence",body:<><img className="pc-evidence-image document" src="/evidence/gupan-temporary-leave.png" alt="顾盼的暂时休学申请批准表"/><p>文件证明她计划暂时离开，而不是彻底消失。</p></>},
    "医院_患者编号.jpg":{tag:"扫描件",title:"North Harbor Medical Center",body:<><img className="pc-evidence-image document" src="/evidence/gupan-patient-portal-slip.png" alt="顾盼的医院患者编号与门户访问单"/><p>照片保留了患者编号、就诊日期和访问码；完整诊疗记录需要前往医院门户。</p></>,link:["/hospital","打开医院患者门户 ↗"]},
    "事后检查记录_GP-221109.pdf":{tag:"敏感医疗资料 · 虚构记录",title:"事后检查与筛查摘要",body:<><img className="pc-evidence-image document" src="/evidence/gupan-post-assault-exam.png" alt="顾盼事后检查记录扫描件"/><div className="pc-scan"><b>PATIENT: GU PAN　MRN: GP-221109</b><span>VISIT DATE: 2022-11-09</span><span>ACCESS CODE: 7304</span><span>SCREENING: ABNORMAL — CONFIRMATORY TEST REQUIRED</span></div><p>临床备注记录了顾盼对“突然失去意识后，疑似发生非自愿接触”的陈述。医护人员建议保存证据、进行复检并接受持续支持。</p><p>这份打印件只包含摘要；完整结果和后续诊疗记录保存在患者门户。</p></>,link:["/hospital","使用患者编号与检验码打开医院门户 ↗"]},
    "治疗订单_HW-220214-HQ.pdf":{tag:"付款订单 · 已结清",title:"Harborwell Recovery Center",body:<><img className="pc-evidence-image document" src="/evidence/hao-qian-treatment-order.png" alt="顾盼为郝倩支付的康复治疗订单"/><p>治疗项目只写着“依赖性行为稳定干预”。完整付款方与转介信息需要前往同一医疗集团门户。</p></>,link:["/hospital","打开港湾康复中心病例门户 ↗"]},
    "HM-2217_未兑现.pdf":{tag:"异常代号",title:"HM-2217",body:<><img className="pc-evidence-image document" src="/evidence/bank-draft-hm-2217.png" alt="附言为HM-2217的未兑付两万美元银行本票"/><p>两万美元本票没有解释用途，附言只留下编号 <code>HM-2217</code>；必须结合聊天、草稿和后台记录判断它代表什么。</p></>},
    "画":{tag:"文件夹 · 27项",title:"顾盼的画",body:<><figure className="pc-painting-preview"><img src="/paintings/xiangyangchu.png" alt="顾盼的油画《向阳处》"/><figcaption>《向阳处》· 油画草稿</figcaption></figure><p>文件备注：希望自卑的人，都有面对黑暗的勇气。</p></>},
    "待整理":{tag:"文件夹 · 17项未上传",title:"待整理",body:<><ul><li>检验条码_7304.png</li><li>举报材料_03.tmp</li><li>酒吧页面缓存.dat</li><li>HM-2217_未兑现.pdf</li><li>聊天备份_2022.enc</li></ul><p>文件彼此缺少上下文，需要从浏览器和聊天记录继续追查。</p></>},
    "QQ空间截图":{tag:"证据截图",title:"匿名访客留言",body:<><pre>沈望，救我。我被锁在……{"\n"}临川……长宁路……17号{"\n"}……4栋……02室</pre><p>截图只保留了残破正文。完整IP需要进入情侣空间的主人管理页面。</p></>,link:["/qzone","打开QQ情侣空间 ↗"]},
    "IP定位记录":{tag:"交叉筛查",title:"地址候选表",body:<><table><tbody><tr><th>候选</th><th>IP节点</th><th>工作距离</th></tr><tr><td>晴川公寓4栋602</td><td>匹配</td><td>1.2km</td></tr><tr><td>长宁花园17栋402</td><td>不匹配</td><td>8.6km</td></tr></tbody></table></>,link:["/computer/liuhan","返回刘涵桌面"]},
    "顾盼的手机_本地数据提取":{tag:"现场证物 · 离线提取",title:"顾盼的手机",body:<><div className="old-phone-extract"><header><span>03:19</span><small>无 SIM 卡　12%</small></header><section><div className="old-phone-app">备忘录</div><article><small>2022年11月17日　03:36</small><h3>旧电脑</h3><p>微信密码：<b>gp2022wxpass</b></p></article><article><small>2025年11月29日　02:47</small><h3>如果消息还是发不出去</h3><p>去情侣空间。沈望还留着主人权限，刘涵知道那个空间。</p></article></section></div><p>手机没有 SIM 卡，只保存了少量本地数据。第一条备忘录中的密码指向顾盼旧电脑上的微信聊天备份。</p></>,link:["/computer/gupan","返回顾盼旧电脑，解锁微信 ↗"]},
    "旧请柬":{tag:"现场证物",title:"顾盼 × 邵明辉",body:<><p>日期：2025年12月6日<br/>地点：云庭酒店 · 锦华厅</p><p>酒店档期显示原预约已经取消。请柬二维码仍指向恒慕服务中心。</p></>,link:["/hengmu","扫描二维码，打开恒慕官网 ↗"]},
    "恒慕服务码":{tag:"方案变更单底边",title:"摩斯电码",body:<><code>-.-- --.- --... ...-- ----- ....- .---- ----.</code><p>解码结果：YQ-730419</p></>,link:["/hengmu","前往恒慕服务进度查询 ↗"]},
  };
  const item=content[file]||{tag:owner.toUpperCase(),title:file,body:<p>文件内容暂未恢复。</p>};
  return <div className="pc-file-preview"><header><span>{file}</span><button onClick={close}>×</button></header><article tabIndex={0} aria-label={`${file} 内容，可滚动查看`}><small>{item.tag}</small><h2>{item.title}</h2>{item.body}{item.link&&<a href={item.link[0]} target="_blank" rel="noopener noreferrer">{item.link[1]}</a>}</article></div>;
}
