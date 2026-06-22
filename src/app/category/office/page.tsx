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
  tags: string;
  submitter: { name: string };
}

export default function OfficePage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/news?category=office&limit=50`);
      if (!res.ok) throw new Error("获取失败");
      const data = await res.json();
      setNews(data.news || []);
    } catch (error) {
      console.error("获取资讯失败:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-8 py-6">
          {/* 标题区 */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              办公类产品
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              讯飞智能办公解决方案与产品动态
            </p>
          </div>

          {/* 资讯列表 */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                加载中...
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                暂无办公类资讯
              </div>
            ) : (
              news.map((item) => (
                <article key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                          办公
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.publishedAt).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                      <Link href={`/news/${item.id}`}>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {item.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>来源: {item.source}</span>
                        <span>👁 {item.viewCount}</span>
                        <span>🔗 {item.shareCount}</span>
                        <span>投稿: {item.submitter?.name}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
