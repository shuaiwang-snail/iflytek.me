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

export default function DailyPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchDailyNews();
  }, [selectedDate]);

  const fetchDailyNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/news/daily?date=${selectedDate}`);
      if (!res.ok) throw new Error("获取失败");
      const data = await res.json();
      setNews(data.news || []);
    } catch (error) {
      console.error("获取日报失败:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // 生成最近7天的日期选项
  const getDateOptions = () => {
    const options = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const label = i === 0 ? "今天" : i === 1 ? "昨天" : `${date.getMonth() + 1}月${date.getDate()}日`;
      options.push({ value: dateStr, label });
    }
    return options;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-8 py-6">
          {/* 标题区 */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              讯飞日报
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              每日精选讯飞最新动态
            </p>
          </div>

          {/* 日期选择 */}
          <div className="flex gap-2 mb-6">
            {getDateOptions().map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedDate(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDate === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* 日报内容 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                讯飞日报 · {new Date(selectedDate).toLocaleDateString("zh-CN", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric",
                  weekday: "long"
                })}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                精选 {news.length} 条讯飞最新资讯
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                加载中...
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                该日期暂无资讯
              </div>
            ) : (
              <div className="space-y-6">
                {news.map((item, index) => (
                  <article
                    key={item.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                            {categoryLabels[item.category] || item.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(item.publishedAt).toLocaleTimeString("zh-CN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <Link href={`/news/${item.id}`}>
                          <h3 className="font-medium text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {item.summary}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>来源: {item.source}</span>
                          <span>👁 {item.viewCount} 阅读</span>
                          <span>投稿: {item.submitter?.name}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
