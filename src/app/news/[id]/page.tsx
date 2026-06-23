"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";

interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  source: string;
  sourceUrl: string | null;
  tags: string[];
  publishedAt: string;
  viewCount: number;
  shareCount: number;
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

export default function NewsDetailPage() {
  const params = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNews();
  }, [params.id]);

  const fetchNews = async () => {
    try {
      const res = await fetch(`/api/news/${params.id}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("资讯不存在");
        } else {
          setError("加载失败");
        }
        setLoading(false);
        return;
      }
      const data = await res.json();
      setNews(data);
      // 增加浏览量
      incrementViewCount(params.id as string);
    } catch (err) {
      setError("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (id: string) => {
    try {
      await fetch(`/api/news/${id}/view`, { method: "POST" });
    } catch (error) {
      // 忽略错误
    }
  };

  const handleShare = async (type: string) => {
    try {
      await fetch(`/api/news/${params.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      alert("分享成功！");
    } catch (error) {
      console.error("分享失败:", error);
    }
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("链接已复制到剪贴板");
    handleShare("copy");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">加载中...</div>
        </main>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-4">{error || "资讯不存在"}</div>
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              返回首页
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-8 py-6">
          {/* 面包屑 */}
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              首页
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/category/${news.category}`}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {categoryLabels[news.category] || news.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 dark:text-gray-300">资讯详情</span>
          </div>

          {/* 资讯内容 */}
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            {/* 标题区 */}
            <header className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                  {categoryLabels[news.category] || news.category}
                </span>
                {typeof news.tags === 'string' && (news.tags as string).split(',').filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {news.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>来源: {news.source}</span>
                <span>·</span>
                <span>
                  {new Date(news.publishedAt).toLocaleString("zh-CN")}
                </span>
                <span>·</span>
                <span>👁 {news.viewCount} 阅读</span>
                <span>·</span>
                <span>🔗 {news.shareCount} 分享</span>
                <span>·</span>
                <span>投稿: {news.submitter?.name}</span>
              </div>
            </header>

            {/* 摘要 */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {news.summary}
              </p>
            </div>

            {/* 正文 */}
            <div className="prose dark:prose-invert max-w-none mb-8">
              <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {news.content}
              </div>
            </div>

            {/* 原文链接 */}
            {news.sourceUrl && (
              <div className="mb-6">
                <a
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  查看原文 →
                </a>
              </div>
            )}

            {/* 分享按钮 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">分享到:</span>
                <button
                  onClick={() => handleShare("wechat")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  微信
                </button>
                <button
                  onClick={() => handleShare("friendcircle")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                >
                  朋友圈
                </button>
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  复制链接
                </button>
              </div>
            </div>
          </article>

          {/* 推广卡片 */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {news.submitter?.name?.[0] || "U"}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  分享自: {news.submitter?.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  讯飞资讯 - 让讯飞人分享最新动态
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  扫码关注更多资讯
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  iflytek.me
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
