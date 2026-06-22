import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 获取某一天的日报
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    let startDate: Date;
    let endDate: Date;

    if (dateParam) {
      // 指定日期
      startDate = new Date(dateParam);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(dateParam);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // 默认今天
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    const news = await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { publishedAt: "desc" },
      include: {
        submitter: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ news, date: dateParam });
  } catch (error: any) {
    console.error("获取日报错误:", error);
    return NextResponse.json(
      { error: "获取失败，请稍后重试" },
      { status: 500 }
    );
  }
}
