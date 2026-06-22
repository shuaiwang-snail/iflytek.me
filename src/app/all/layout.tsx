import { Metadata } from "next";

export const metadata: Metadata = {
  title: "全部资讯 - 讯飞资讯",
  description: "浏览所有已发布的讯飞资讯",
};

export default function AllNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
