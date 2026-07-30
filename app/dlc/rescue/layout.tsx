import type {Metadata} from "next";
import {headers} from "next/headers";
import "./rescue.css";

export async function generateMetadata():Promise<Metadata>{
  const requestHeaders=await headers();
  const host=requestHeaders.get("x-forwarded-host")??requestHeaders.get("host")??"localhost";
  const protocol=requestHeaders.get("x-forwarded-proto")??(host.startsWith("localhost")?"http":"https");
  const origin=`${protocol}://${host}`;
  const title="希。望｜《嫁》DLC";
  const description="带着已经查明的真相回到三天前。这一次，让顾盼亲自走出那扇门。";
  const imageUrl=new URL("/dlc/rescue-social.png",origin).toString();

  return {
    title,
    description,
    metadataBase:new URL(origin),
    openGraph:{title,description,type:"website",images:[{url:imageUrl,width:1672,height:941,alt:"《嫁》DLC《希。望》"}]},
    twitter:{card:"summary_large_image",title,description,images:[imageUrl]},
  };
}

export default function Layout({children}:{children:React.ReactNode}){
  return children;
}
