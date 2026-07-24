const celebrities=[
  {name:"刘亦菲",handle:"@刘亦菲",kind:"演员",initial:"刘",url:"https://www.weibo.com/liuyifeiofficial"},
  {name:"杨幂",handle:"@杨幂",kind:"演员",initial:"幂",url:"https://www.weibo.com/yangmiblog"},
  {name:"白敬亭",handle:"@白敬亭",kind:"演员",initial:"白",url:"https://www.weibo.com/u/2112496475"},
  {name:"张若昀",handle:"@张若昀",kind:"演员",initial:"张",url:"https://weibo.com/u/1827683445"},
];

export default function CelebrityFollows({shift=0,compact=false}:{shift?:number;compact?:boolean}){
  const ordered=[...celebrities.slice(shift),...celebrities.slice(0,shift)];
  const content=<>
    <header><div><b>关注的人</b><small>兴趣关注 · 公开账号</small></div><span>查看全部　›</span></header>
    <div>{ordered.map((person,index)=><a href={person.url} target="_blank" rel="noopener noreferrer" key={person.name}><i className={`celebrity-color c${(index+shift)%4}`}>{person.initial}</i><span><b>{person.name} <em>V</em></b><small>{person.handle} · {person.kind}</small></span><strong>已关注</strong></a>)}</div>
  </>;
  return compact?<div className="wb-celebrity-follows compact">{content}</div>:<section className="wb-celebrity-follows">{content}</section>
}
