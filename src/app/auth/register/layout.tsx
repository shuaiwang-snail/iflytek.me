import { Metadata } from "next";

export const metadata: Metadata = {
  title: "用户注册 - 讯飞资讯",
  description: "注册讯飞资讯平台账号，成为讯飞资讯分享者",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
