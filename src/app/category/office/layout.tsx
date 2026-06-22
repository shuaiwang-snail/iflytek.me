import { Metadata } from "next";

export const metadata: Metadata = {
  title: "办公类产品 - 讯飞资讯",
  description: "讯飞智能办公解决方案与产品动态",
};

export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
