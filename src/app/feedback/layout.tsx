import { Metadata } from "next";

export const metadata: Metadata = {
  title: "反馈 - 讯飞资讯",
  description: "帮助改进讯飞资讯平台",
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
