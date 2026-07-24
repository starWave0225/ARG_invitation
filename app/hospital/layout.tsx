import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyNorthHarbor｜Medical & Recovery Records",
  description: "North Harbor Medical Center and Harborwell Recovery Center historical record portal.",
};

export default function HospitalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
