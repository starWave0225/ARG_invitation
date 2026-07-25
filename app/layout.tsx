import type { Metadata } from "next";
import "./globals.css";
import "./opening-walk.css";
import OpeningMusic from "./OpeningMusic";

export const metadata: Metadata = {
  title: "嫁｜双周目网页调查叙事",
  description: "沈望一直在等顾盼回首。现在，请替她找回被夺走的真相。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><OpeningMusic/>{children}</body></html>;
}
