"use client";

export default function YuanfanNav({hasAccess}:{hasAccess:boolean}){
  const open=(path:string,requiresAccess=false)=>{
    if(requiresAccess&&!hasAccess)return;
    window.open(path,"_blank","noopener,noreferrer");
  };
  const downloadGuide=()=>{
    const link=document.createElement("a");
    link.href="/downloads/%E8%BF%9C%E5%B8%86_2025%E7%A7%8B%E5%AD%A3%E6%96%B0%E7%94%9F%E6%8C%87%E5%8D%97.txt";
    link.download="远帆_2025秋季新生指南.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return <nav>
    <a className="aid-brand" href="/yuanfan" title="返回远帆主页" aria-label="远帆社区互助会，返回主页"><i>远</i> 远帆社区互助会</a>
    <button type="button" disabled={!hasAccess} title={hasAccess?"查看成员公告":"需要学生网站权限"} onClick={()=>open("/yuanfan/notices",true)}>成员公告</button>
    <button type="button" disabled={!hasAccess} title={hasAccess?"查看活动日历":"需要学生网站权限"} onClick={()=>open("/yuanfan/calendar",true)}>活动日历</button>
    <button type="button" className="aid-guide-download" disabled={!hasAccess} title={hasAccess?"新生指南":"需要学生网站权限"} onContextMenu={event=>{event.preventDefault();if(hasAccess)downloadGuide()}}>新生指南</button>
    <button type="button" onClick={()=>open("/yuanfan/contact")}>联系我们</button>
    <em className={hasAccess?"unlocked":""}>{hasAccess?"学生访问已开通":"访客模式"}</em>
  </nav>;
}
