import { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于 - 讯飞资讯",
  description: "了解 iflytek.me 讯飞资讯平台",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
