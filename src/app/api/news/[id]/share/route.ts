import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 记录分享
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const { type } = await req.json();

    // 增加分享数
    await prisma.news.update({
      where: { id },
      data: {
        shareCount: {
          increment: 1,
        },
      },
    });

    // 如果用户已登录，记录分享历史
    if (session?.user?.id) {
      await prisma.share.create({
        data: {
          newsId: id,
          userId: session.user.id,
          shareType: type,
          shareUrl: `${process.env.NEXTAUTH_URL}/news/${id}?ref=${session.user.id}`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("记录分享错误:", error);
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    );
  }
}
