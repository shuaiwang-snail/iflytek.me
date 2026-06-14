"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface SidebarProps {
  categories: Category[];
}

export function Sidebar({ categories }: SidebarProps) {
  const { data: session } = useSession();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🎙️</span>
          <div>
            <div className="font-bold text-lg text-gray-900 dark:text-white">讯飞资讯</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">iflytek.me</div>
          </div>
        </Link>
      </div>

      {/* 导航 */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        >
          <span>📰</span>
          <span className="font-medium">资讯精选</span>
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </Link>
        ))}

        <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

        <Link
          href="/about"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span>ℹ️</span>
          <span>关于</span>
        </Link>
      </nav>

      {/* 用户区域 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {session ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {session.user?.name?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {session.user?.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {(session.user as any)?.isAdmin ? "管理员" : "用户"}
                </div>
              </div>
            </div>
            
            {(session.user as any)?.isAdmin && (
              <Link
                href="/admin"
                className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
              >
                管理后台
              </Link>
            )}
            
            <button
              onClick={() => signOut()}
              className="block w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              退出登录
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              href="/auth/login"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              登录
            </Link>
            <Link
              href="/auth/register"
              className="block w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              注册
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
