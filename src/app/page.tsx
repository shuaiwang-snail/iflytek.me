"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";

interface News {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedAt: string;
  viewCount: number;
  shareCount: number;
  tags: string[];
  submitter: { name: string };
}

const categories = [
  { id: "education", name: "教育", icon: "🎓" },
  { id: "medical", name: "医疗", icon: "🏥" },
  { id: "finance", name: "金融", icon: "💰" },
  { id: "automotive", name: "汽车", icon: "🚗" },
  { id: "city", name: "城市", icon: "🏙️" },
  { id: "operator", name: "运营商", icon: "📡" },
  { id: "industry", name: "工业", icon: "🏭" },
  { id: "research", name: "科研", icon: "🔬" },
  { id: "office", name: "办公", icon: "💼" },
];

const categoryLabels: Record<string, { name: string; color: string }> = {
  education: { name: "教育", color: "bg-blue-100 text-blue-700" },
  medical: { name: "医疗", color: "bg-red-100 text-red-700" },
  finance: { name: "金融", color: "bg-green-100 text-green-700" },
  automotive: { name: "汽车", color: "bg-yellow-100 text-yellow-700" },
  city: { name: "城市", color: "bg-purple-100 text-purple-700" },
  operator: { name: "运营商", color: "bg-cyan-100 text-cyan-700" },
  industry: { name: "工业", color: "bg-orange-100 text-orange-700" },
  research: { name: "科研", color: "bg-pink-100 text-pink-700" },
  office: { name: "办公", color: "bg-indigo-100 text-indigo-700" },
};

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据，实际应从 API 获取
    setNews([]);
    setLoading(false);
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar categories={categories} />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              资讯精选
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              讯飞AI在各行业的最新动态与应用案例
            </p>
          </header>

          {/* 筛选栏 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm">
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 搜索框 */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="搜索资讯..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 资讯列表 */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                加载中...
              </div>
            ) : news.length > 0 ? (
              news.map((item) => {
                const category = categoryLabels[item.category] || { name: "其他", color: "bg-gray-100 text-gray-700" };
                return (
                  <article key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${category.color}`}>
                            {category.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>
                        <Link href={`/news/${item.id}`}>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
                            {item.title}
                          </h2>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                          {item.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <span>来源: {item.source}</span>
                            <span>发布: {item.submitter.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span>👁 {item.viewCount}</span>
                            <span>📤 {item.shareCount}</span>
                          </div>
                        </div>
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg mb-2">暂无资讯</p>
                <p className="text-sm">管理员发布的内容将显示在这里</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
