import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron 任务配置
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 验证 Cron 密钥
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();

    // 查找需要发布的资讯（已排期且时间已到）
    const scheduledNews = await prisma.news.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: now,
        },
      },
    });

    // 发布资讯
    const publishedIds = [];
    for (const news of scheduledNews) {
      await prisma.news.update({
        where: { id: news.id },
        data: {
          status: "PUBLISHED",
          publishedAt: now,
        },
      });
      publishedIds.push(news.id);
    }

    return NextResponse.json({
      success: true,
      publishedCount: publishedIds.length,
      publishedIds,
      timestamp: now.toISOString(),
    });
  } catch (error: any) {
    console.error("定时发布错误:", error);
    return NextResponse.json(
      { error: "执行失败" },
      { status: 500 }
    );
  }
}
