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
    const { isAdmin } = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data: { isAdmin },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("设置管理员错误:", error);
    return NextResponse.json(
      { error: "操作失败，请稍后重试" },
      { status: 500 }
    );
  }
}
