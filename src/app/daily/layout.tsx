import { Metadata } from "next";

export const metadata: Metadata = {
  title: "讯飞日报 - 讯飞资讯",
  description: "每日精选讯飞最新动态",
};

export default function DailyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
