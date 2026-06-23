import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any)?.isAdmin) {
    redirect("/auth/login");
  }

  // 获取统计数据
  const [
    totalNews,
    pendingNews,
    publishedNews,
    totalUsers,
    pendingUsers,
  ] = await Promise.all([
    prisma.news.count(),
    prisma.news.count({ where: { status: "PENDING" } }),
    prisma.news.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count(),
    prisma.user.count({ where: { isApproved: false } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                🎙️ 讯飞资讯
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">管理后台</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user?.name}
              </span>
              <Link
                href="/"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                返回前台
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">总资讯数</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalNews}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">待审核资讯</div>
            <div className="text-3xl font-bold text-orange-600">{pendingNews}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">已发布资讯</div>
            <div className="text-3xl font-bold text-green-600">{publishedNews}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">总用户数</div>
            <div className="text-3xl font-bold text-blue-600">{totalUsers}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">待审核用户</div>
            <div className="text-3xl font-bold text-red-600">{pendingUsers}</div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/news/create"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 text-center transition-colors"
          >
            <div className="text-3xl mb-2">📝</div>
            <div className="font-medium">发布资讯</div>
          </Link>
          <Link
            href="/admin/news"
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center transition-colors"
          >
            <div className="text-3xl mb-2">📰</div>
            <div className="font-medium text-gray-900 dark:text-white">资讯管理</div>
          </Link>
          <Link
            href="/admin/products"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 text-center transition-colors"
          >
            <div className="text-3xl mb-2">📦</div>
            <div className="font-medium">产品管理</div>
          </Link>
          <Link
            href="/admin/users"
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center transition-colors"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-medium text-gray-900 dark:text-white">用户管理</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
