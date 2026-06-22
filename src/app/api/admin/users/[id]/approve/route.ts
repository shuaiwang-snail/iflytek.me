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

    const user = await prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });

    // 创建通知
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "USER_APPROVED",
        title: "账号审核通过",
        content: "您的账号已通过审核，现在可以登录使用了",
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("审核用户错误:", error);
    return NextResponse.json(
      { error: "审核失败，请稍后重试" },
      { status: 500 }
    );
  }
}
