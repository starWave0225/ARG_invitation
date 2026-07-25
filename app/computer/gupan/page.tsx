"use client";

import {FormEvent, useEffect, useState} from "react";
import DesktopRoute from "../DesktopRoute";

export default function Page(){
  const [ready,setReady]=useState(false);
  const [unlocked,setUnlocked]=useState(false);
  const [password,setPassword]=useState("");
  const [attempts,setAttempts]=useState(0);
  const [systemTime,setSystemTime]=useState("03:42");

  useEffect(()=>{
    const readyTimer=window.setTimeout(()=>{
      setUnlocked(localStorage.getItem("jia-gupan-computer-unlocked")==="true");
      setReady(true);
    },0);
    const update=()=>setSystemTime(new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date()));
    update();
    const timer=window.setInterval(update,1000);
    return()=>{
      window.clearTimeout(readyTimer);
      window.clearInterval(timer);
    };
  },[]);

  const submit=(event:FormEvent)=>{
    event.preventDefault();
    if(password.replace(/\D/g,"")==="20181021"){
      localStorage.setItem("jia-gupan-computer-unlocked","true");
      setUnlocked(true);
      return;
    }
    setAttempts(value=>value+1);
    setPassword("");
  };

  if(!ready)return <main className="gp-lock-screen"/>;
  if(unlocked)return <DesktopRoute owner="gupan"/>;

  return <main className="gp-lock-screen">
    <div className="gp-lock-time"><b>{systemTime}</b><span>2022年11月18日　星期五</span></div>
    <section className="gp-login-card">
      <img src="/characters/gu-pan.png" alt="顾盼"/>
      <h1>顾盼</h1>
      <small>GP-LAPTOP-2018</small>
      <form onSubmit={submit}>
        <label htmlFor="gp-password">密码</label>
        <div><input id="gp-password" autoFocus type="password" value={password} onChange={event=>setPassword(event.target.value)} placeholder="输入密码"/><button aria-label="登录">→</button></div>
      </form>
      {attempts>0&&<p className="gp-login-error">密码不正确</p>}
      {attempts>0&&<p className="gp-password-hint"><span>密码提示</span><b>恋爱纪念日</b></p>}
    </section>
    <footer><span>CHS</span><span>⌁　◉　🔊　⏻</span></footer>
  </main>
}
