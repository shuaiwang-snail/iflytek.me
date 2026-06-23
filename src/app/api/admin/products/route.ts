import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 获取产品列表
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { sortOrder: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("获取产品失败:", error);
    return NextResponse.json({ message: "获取失败" }, { status: 500 });
  }
}

// 创建产品
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const data = await req.json();
    
    // 验证必填字段
    if (!data.name || !data.model || !data.price || !data.category) {
      return NextResponse.json({ message: "缺少必填字段" }, { status: 400 });
    }

    // 检查型号是否已存在
    const existing = await prisma.product.findUnique({
      where: { model: data.model },
    });
    
    if (existing) {
      return NextResponse.json({ message: "产品型号已存在" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        model: data.model,
        subtitle: data.subtitle || "",
        description: data.description || "",
        category: data.category,
        price: data.price,
        tag: data.tag || "",
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive ?? true,
        features: JSON.stringify(data.features || []),
        specs: JSON.stringify(data.specs || {}),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("创建产品失败:", error);
    return NextResponse.json({ message: "创建失败" }, { status: 500 });
  }
}
