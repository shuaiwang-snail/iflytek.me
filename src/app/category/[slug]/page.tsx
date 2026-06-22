"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

const categoryDescriptions: Record<string, string> = {
  education: "智慧教育解决方案，AI赋能教育数字化转型",
  medical: "医疗AI辅助诊断，智慧医疗创新应用",
  finance: "智慧金融解决方案，AI助力金融服务升级",
  automotive: "智能汽车语音交互，车载AI技术应用",
  city: "城市大脑，智慧城市数字化建设",
  operator: "运营商智能客服，通信行业AI应用",
  industry: "工业互联网，智能制造解决方案",
  research: "大模型技术研究，AI前沿技术探索",
  office: "智能办公解决方案，企业数字化转型",
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [slug]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/news?category=${slug}&limit=50`);
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

  const categoryName = categoryLabels[slug] || slug;
  const categoryDesc = categoryDescriptions[slug] || "";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-8 py-6">
          {/* 标题区 */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {categoryName}资讯
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {categoryDesc}
            </p>
          </div>

          {/* 资讯列表 */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                加载中...
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                该分类暂无资讯
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
