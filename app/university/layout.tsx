import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Northbridge University｜Student Services",
  description: "Northbridge University academic catalog and student services.",
};

export default function UniversityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
