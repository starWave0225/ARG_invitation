"use client";

import {useEffect,useState} from "react";
import YuanfanNav from "../YuanfanNav";

const calendarActivities=[
  {order:1,day:23,title:"周末迎新桌游"},
  {order:2,day:15,title:"旧物交换会"},
  {order:3,day:13,title:"博物馆夜游"},
  {order:4,day:1,title:"秋季艺术工坊"},
  {order:5,day:14,title:"新生租房答疑"},
  {order:6,day:4,title:"社区晚餐会"},
  {order:7,day:18,title:"河岸晨跑"},
  {order:8,day:9,title:"国际生说明会"},
  {order:9,day:22,title:"志愿者培训"},
  {order:10,day:5,title:"交换生沙龙"},
  {order:11,day:18,title:"夜间安全讲座"},
];

export default function YuanfanCalendar(){
  const [hasAccess,setHasAccess]=useState(false);
  useEffect(()=>{
    const sync=()=>setHasAccess(localStorage.getItem("jia-yuanfan-site-access")==="true");
    sync();
    window.addEventListener("storage",sync);
    window.addEventListener("jia-progress",sync);
    return()=>{window.removeEventListener("storage",sync);window.removeEventListener("jia-progress",sync)};
  },[]);
  return <main className="route-page yuanfan-route"><div className="aid-public">
    <YuanfanNav hasAccess={hasAccess}/>
    <header className="aid-subpage-hero"><small>MEMBER SERVICES · ACTIVITY CALENDAR</small><h1>活动日历</h1><p>认证学生与志愿者的活动排期及归档。</p></header>
    <section className={`aid-calendar aid-calendar-page ${hasAccess?"unlocked":"locked"}`}><div><small>OCTOBER 2022</small><h3>十月活动安排</h3><p>{hasAccess?"圈选日期按照活动序号 1—11 归档。":"完成学生身份核验后查看活动安排。"}</p></div>{hasAccess?<div className="aid-calendar-content"><div className="aid-month"><header><span>‹</span><b>OCTOBER 2022</b><span>›</span></header><div className="aid-month-grid">{["一","二","三","四","五","六","日"].map(day=><strong key={day}>{day}</strong>)}{Array.from({length:42},(_,index)=>{const day=index-4;const activities=calendarActivities.filter(item=>item.day===day);return day<1||day>31?<span className="empty" key={`empty-${index}`}/>:<span className={activities.length?"circled":""} key={day}><b>{day}</b>{activities.length>0&&<i>{activities.map(item=>item.order).join("·")}</i>}</span>})}</div></div><div className="aid-calendar-list">{calendarActivities.map(activity=><article key={activity.order}><em>{String(activity.order).padStart(2,"0")}</em><time>10 / {String(activity.day).padStart(2,"0")}</time><span><b>{activity.title}</b><small>成员活动 · 已结束</small></span></article>)}</div></div>:<div className="aid-calendar-locked"><span>🔒</span><b>需要学生网站权限</b><small>请联系远帆联络人完成核验</small></div>}</section>
    <footer>Registered Student Organization · Privacy · Safeguarding · Contact</footer>
  </div></main>;
}
