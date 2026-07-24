"use client";

export type WeiboSortOrder="asc"|"desc";

export default function WeiboSortToggle({order,onChange}:{order:WeiboSortOrder;onChange:(order:WeiboSortOrder)=>void}){
  const buttonStyle=(active:boolean)=>({
    padding:"5px 9px",
    border:"1px solid",
    borderColor:active?"#e76524":"#d8d8d8",
    borderRadius:"3px",
    background:active?"#f7691d":"transparent",
    color:active?"#fff":"#888",
    fontSize:"9px",
  });

  return <div role="group" aria-label="微博时间排序" data-testid="weibo-sort-toggle" style={{display:"flex",alignItems:"center",gap:"5px"}}>
    <button type="button" style={buttonStyle(order==="asc")} aria-pressed={order==="asc"} onClick={()=>onChange("asc")}>时间顺序</button>
    <button type="button" style={buttonStyle(order==="desc")} aria-pressed={order==="desc"} onClick={()=>onChange("desc")}>倒序</button>
  </div>;
}
