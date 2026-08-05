import type {Metadata} from "next";
import {notFound} from "next/navigation";
import "./rescue.css";

const title="希·望｜《嫁》DLC";
const description="我想活下去！你将扮演顾盼，在被反锁的402室里寻找信号、发出求救，并亲自走出那扇门。";
const imageUrl="https://starwave0225.github.io/ARG_invitation/dlc/rescue-social.png";
const isDlcEnabled=process.env.NODE_ENV==="development"||process.env.DLC_RESCUE_ENABLED==="true";

const dlcMetadata:Metadata={
  title,
  description,
  openGraph:{title,description,type:"website",images:[{url:imageUrl,width:1672,height:941,alt:"《嫁》DLC《希·望》：我想活下去！"}]},
  twitter:{card:"summary_large_image",title,description,images:[imageUrl]},
};

export const metadata:Metadata=isDlcEnabled?dlcMetadata:{
  title:"页面不存在｜嫁",
  robots:{index:false,follow:false},
};

export default function Layout({children}:{children:React.ReactNode}){
  if(!isDlcEnabled)notFound();
  return children;
}
