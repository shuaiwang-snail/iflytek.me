import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json(
        { error: "无权访问" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      summary,
      content,
      category,
      source,
      sourceUrl,
      tags,
      scheduledAt,
    } = body;

    // 验证必填字段
    if (!title || !summary || !content || !category || !source) {
      return NextResponse.json(
        { error: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    // 确定状态
    let status: "APPROVED" | "SCHEDULED" = "APPROVED";
    let publishTime: Date | null = new Date();

    if (scheduledAt) {
      status = "SCHEDULED";
      publishTime = null;
    }

    // 创建资讯
    const news = await prisma.news.create({
      data: {
        title,
        summary,
        content,
        category,
        source,
        sourceUrl,
        tags: tags || [],
        status,
        submittedBy: session.user!.id,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: publishTime,
      },
    });

    return NextResponse.json(
      { message: "发布成功", newsId: news.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("发布资讯错误:", error);
    return NextResponse.json(
      { error: "发布失败，请稍后重试" },
      { status: 500 }
    );
  }
}

// 获取资讯列表
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json(
        { error: "无权访问" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = status ? { status: status as any } : {};

    const news = await prisma.news.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        submitter: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(news);
  } catch (error: any) {
    console.error("获取资讯错误:", error);
    return NextResponse.json(
      { error: "获取失败，请稍后重试" },
      { status: 500 }
    );
  }
}
