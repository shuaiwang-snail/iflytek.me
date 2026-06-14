"use client";

import Link from "next/link";
import { News, User } from "@prisma/client";

interface NewsWithSubmitter extends News {
  submitter: Pick<User, "name">;
}

interface NewsCardProps {
  news: NewsWithSubmitter;
}

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

export function NewsCard({ news }: NewsCardProps) {
  const category = categoryLabels[news.category] || { name: "其他", color: "bg-gray-100 text-gray-700" };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* 封面图 */}
        {news.imageUrl && (
          <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* 分类标签 */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${category.color}`}>
              {category.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(news.publishedAt || news.createdAt)}
            </span>
          </div>

          {/* 标题 */}
          <Link href={`/news/${news.id}`}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
              {news.title}
            </h2>
          </Link>

          {/* 摘要 */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {news.summary}
          </p>

          {/* 底部信息 */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>来源: {news.source}</span>
              <span>发布: {news.submitter.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>👁 {news.viewCount}</span>
              <span>📤 {news.shareCount}</span>
            </div>
          </div>

          {/* 标签 */}
          {news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {news.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
