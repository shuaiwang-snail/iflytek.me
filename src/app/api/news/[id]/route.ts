import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 获取单条资讯
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const news = await prisma.news.findUnique({
      where: { 
        id,
        status: "PUBLISHED", // 只返回已发布的
      },
      include: {
        submitter: {
          select: { 
            name: true,
            wechatQrCode: true,
            wechatId: true,
            emailContact: true,
            phone: true,
          },
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
