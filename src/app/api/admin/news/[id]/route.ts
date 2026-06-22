import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 获取单条资讯
export async function GET(
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

    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        submitter: {
          select: { name: true, email: true },
        },
      },
    });

    if (!news) {
      return NextResponse.json(
        { error: "资讯不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error: any) {
    console.error("获取资讯错误:", error);
    return NextResponse.json(
      { error: "获取失败，请稍后重试" },
      { status: 500 }
    );
  }
}

// 更新资讯
export async function PUT(
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
    const body = await req.json();

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: body.title,
        summary: body.summary,
        content: body.content,
        category: body.category,
        source: body.source,
        sourceUrl: body.sourceUrl,
        tags: body.tags,
      },
    });

    return NextResponse.json({ success: true, news });
  } catch (error: any) {
    console.error("更新资讯错误:", error);
    return NextResponse.json(
      { error: "更新失败，请稍后重试" },
      { status: 500 }
    );
  }
}

// 删除资讯
export async function DELETE(
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

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("删除资讯错误:", error);
    return NextResponse.json(
      { error: "删除失败，请稍后重试" },
      { status: 500 }
    );
  }
}
