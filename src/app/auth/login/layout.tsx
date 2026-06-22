import { Metadata } from "next";

export const metadata: Metadata = {
  title: "用户登录 - 讯飞资讯",
  description: "登录讯飞资讯平台，分享最新AI行业动态",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
