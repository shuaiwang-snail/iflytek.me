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

const categoryLabels: Record<string, string> = {
  education: "教育",
  medical: "医疗",
  finance: "金融",
  automotive: "汽车",
  city: "城市",
  operator: "运营商",
  industry: "工业",
  research: "科研",
  office: "办公",
};

export default function AllNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/news?limit=30&page=${page}`);
      if (!res.ok) throw new Error("获取失败");
      const data = await res.json();
      
      if (page === 1) {
        setNews(data.news || []);
      } else {
        setNews((prev) => [...prev, ...(data.news || [])]);
      }
      
      setHasMore(data.news?.length === 30);
    } catch (error) {
      console.error("获取资讯失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-8 py-6">
          {/* 标题区 */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              全部资讯
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              浏览所有已发布的讯飞资讯
            </p>
          </div>

          {/* 资讯列表 */}
          <div className="space-y-4">
            {loading && page === 1 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                加载中...
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                暂无资讯
              </div>
            ) : (
              news.map((item) => (
                <article
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                          {categoryLabels[item.category] || item.category}
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

          {/* 加载更多 */}
          {hasMore && !loading && (
            <div className="text-center mt-6">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                加载更多
              </button>
            </div>
          )}

          {loading && page > 1 && (
            <div className="text-center mt-6 text-gray-500 dark:text-gray-400">
              加载中...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
