import { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理后台 - 讯飞资讯",
  description: "讯飞资讯平台管理后台",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
