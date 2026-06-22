import { Metadata } from "next";

export const metadata: Metadata = {
  title: "教育类产品 - 讯飞资讯",
  description: "讯飞智慧教育解决方案与产品动态",
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
