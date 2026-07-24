"use client";

import {useEffect,useState} from "react";

export default function HiddenEndingPage(){
  const [unlocked,setUnlocked]=useState<boolean|null>(null);
  useEffect(()=>{
    const frame=window.requestAnimationFrame(()=>setUnlocked(
      localStorage.getItem("jia-hidden-ending-unlocked")==="true"&&
      localStorage.getItem("jia-hidden-ending-source")==="gupan-final-letter"
    ));
    return()=>window.cancelAnimationFrame(frame);
  },[]);

  if(unlocked===null)return <main className="hidden-ending-route hidden-ending-loading">正在打开那封没有寄出的信……</main>;
  if(!unlocked)return <main className="hidden-ending-route hidden-ending-locked"><section><small>ENDING LOCKED</small><h1>这里还没有可以抵达的梦。</h1><p>完成刘涵线后，回到顾盼旧电脑的回收站。</p><a href="/computer/gupan">返回顾盼的旧电脑</a></section></main>;

  return <main className="hidden-ending-route">
    <div className="hidden-ending-glow"/>
    <section className="hidden-ending-chapter">
      <small>隐藏结局 · 镜花水月</small>
      <h1>在梦里，他们拥有完整的一生</h1>
      <div className="hidden-ending-memory">
        <figure><img src="/characters/wechat-shen-wang.png" alt="沈望"/><figcaption>左望</figcaption></figure>
        <span>2018　→　2026</span>
        <figure><img src="/characters/wechat-gu-pan.png" alt="顾盼"/><figcaption>右盼</figcaption></figure>
      </div>
      <blockquote>“这一次，你等到我回头了吗？”<br/>“没有。这一次，我走到了你身边。”</blockquote>
      <p>梦中的沈望在事发前一晚抵达北港。他们没有立刻变得勇敢，也没有突然解决所有问题，只是终于在最需要彼此的时候，站到了同一个地方。</p>
      <p>顾盼完成了学业。地图上的海岸线一年比一年长，空白被车票、照片和两个人争论过又和好的城市一点点填满。2026年，他们在一场很小的婚礼上交换戒指，没有盛大的宴席，也没有谁替她决定该成为怎样的新娘。</p>
      <p>清晨的光停在窗边。顾盼把那条酒红色围巾重新绕到他颈上，告诉他梦总要醒来。</p>
      <footer>死亡没有被改写。<br/>但在无人能够夺走的梦里，他们曾有过完整的一生。</footer>
      <a href="/">带着她的信醒来　→</a>
    </section>
  </main>;
}
