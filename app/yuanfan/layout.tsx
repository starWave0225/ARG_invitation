import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "远帆社区互助会｜Yuanfan Community Support",
  description: "面向留学生的新生安顿、健康转介与同伴支持网络。",
};

export default function YuanfanLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
