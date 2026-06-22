import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json(
        { error: "无权访问" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { reason } = await req.json();

    // 更新资讯状态为已拒绝
    const news = await prisma.news.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewedBy: session.user!.id,
        reviewedAt: new Date(),
        reviewNote: reason,
      },
    });

    // 创建通知
    await prisma.notification.create({
      data: {
        userId: news.submittedBy,
        type: "NEWS_REJECTED",
        title: "资讯审核未通过",
        content: `您的资讯《${news.title}》未通过审核，原因：${reason}`,
        newsId: news.id,
      },
    });

    return NextResponse.json({ success: true, news });
  } catch (error: any) {
    console.error("拒绝资讯错误:", error);
    return NextResponse.json(
      { error: "操作失败，请稍后重试" },
      { status: 500 }
    );
  }
}
