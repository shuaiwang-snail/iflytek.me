import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 获取单个产品
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ message: "产品不存在" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("获取产品失败:", error);
    return NextResponse.json({ message: "获取失败" }, { status: 500 });
  }
}

// 更新产品
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const data = await req.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        subtitle: data.subtitle,
        description: data.description,
        category: data.category,
        price: data.price,
        tag: data.tag,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
        features: JSON.stringify(data.features || []),
        specs: JSON.stringify(data.specs || {}),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("更新产品失败:", error);
    return NextResponse.json({ message: "更新失败" }, { status: 500 });
  }
}

// 删除产品
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除产品失败:", error);
    return NextResponse.json({ message: "删除失败" }, { status: 500 });
  }
}
