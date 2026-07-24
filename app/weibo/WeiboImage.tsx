"use client";

import {useEffect,useState} from "react";

type WeiboImageKind="map"|"snow"|"wedding"|"lab"|"photo";

const imageSources:Partial<Record<WeiboImageKind,string>>={
  map:"https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=90",
  snow:"https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1600&q=90",
  lab:"/evidence/gupan-patient-portal-slip.png",
};

export default function WeiboImage({kind,label,src}:{kind:WeiboImageKind;label:string;src?:string}){
  const [open,setOpen]=useState(false);

  useEffect(()=>{
    if(!open)return;
    const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};
    window.addEventListener("keydown",close);
    return()=>window.removeEventListener("keydown",close);
  },[open]);

  return <>
    {kind==="wedding"?
      <button type="button" className="hq-wedding-photo wb-image-trigger" style={src?{backgroundImage:`linear-gradient(#0000,#0008),url("${src}")`,backgroundPosition:"center",backgroundSize:"cover"}:undefined} onClick={()=>setOpen(true)} aria-label={`放大查看：${label}`} data-testid="weibo-image-wedding">
        <span>WEDDING · 2025<br/><small>婚礼照片预览</small></span>
      </button>:
      kind==="lab"?
        <button type="button" className="wb-attachment wb-image-file" onClick={()=>setOpen(true)} aria-label={`放大查看：${label}`} data-testid="weibo-image-lab">
          ▧　lab_7304.png<small>本地图片 · 点击放大</small>
        </button>:
        <button type="button" className={`wb-photo ${kind} wb-image-trigger`} style={src?{backgroundImage:`linear-gradient(#0001,#0005),url("${src}")`}:undefined} onClick={()=>setOpen(true)} aria-label={`放大查看：${label}`} data-testid={`weibo-image-${kind}`}>
          <span>{label}</span>
        </button>
    }
    {open&&
      <div className="wb-image-lightbox" role="dialog" aria-modal="true" aria-label={label} onClick={()=>setOpen(false)} data-testid="weibo-image-lightbox">
        <button type="button" className="wb-image-lightbox-close" onClick={()=>setOpen(false)} aria-label="关闭大图">×</button>
        <figure onClick={event=>event.stopPropagation()}>
          {kind==="wedding"?
            src?<img src={src} alt={label}/>:<div className="hq-wedding-photo wb-wedding-large">WEDDING · 2025<br/><small>婚礼照片预览</small></div>:
            <img src={src??imageSources[kind]} alt={label}/>
          }
          <figcaption>{label}</figcaption>
        </figure>
      </div>
    }
  </>;
}
