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
  isFeatured?: boolean;
  score?: number;
}

const categories = [
  { id: "all", name: "全部" },
  { id: "education", name: "教育" },
  { id: "medical", name: "医疗" },
  { id: "finance", name: "金融" },
  { id: "automotive", name: "汽车" },
  { id: "city", name: "城市" },
  { id: "operator", name: "运营商" },
  { id: "industry", name: "工业" },
  { id: "research", name: "科研" },
  { id: "office", name: "办公" },
];

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

// 热点数据（模拟）
const hotNews = [
  { id: "h1", title: "讯飞星火大模型4.0正式发布", sources: 12, time: "2小时前" },
  { id: "h2", title: "科大讯飞智慧教育解决方案获国家级奖项", sources: 8, time: "5小时前" },
  { id: "h3", title: "讯飞医疗AI辅助诊断系统通过NMPA认证", sources: 6, time: "8小时前" },
  { id: "h4", title: "讯飞与某国有大行签署战略合作协议", sources: 5, time: "12小时前" },
  { id: "h5", title: "讯飞智能汽车解决方案获头部车企定点", sources: 4, time: "1天前" },
];

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNews();
  }, [activeCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/news?category=${activeCategory}&limit=50`);
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

  // 按日期分组
  const groupByDate = (news: News[]) => {
    const groups: Record<string, News[]> = {};
    news.forEach((item) => {
      const date = new Date(item.publishedAt).toLocaleDateString("zh-CN", {
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  };

  const filteredNews = news.filter(
    (item) =>
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedNews = groupByDate(filteredNews);

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
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              资讯精选
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              科大讯飞在各行业的AI最新动态与应用案例
            </p>
          </div>

          {/* 分类筛选 + 搜索 - AIHOT 风格 */}
          <div className="mb-6">
            <div className="flex items-center gap-1 text-sm mb-3">
              <span className="text-gray-500 dark:text-gray-400 mr-2">分类筛选</span>
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-2 py-1 transition-colors ${
                  activeCategory === "all"
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                全部
              </button>
              {categories.filter(c => c.id !== "all").map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2 py-1 transition-colors ${
                    activeCategory === cat.id
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="搜索标题/摘要..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-60"
              />
              <button 
                onClick={() => fetchNews()}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                搜索
              </button>
            </div>
          </div>

          {/* 当前热点 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🔥</span>
              <span className="font-medium text-gray-900 dark:text-white text-sm">当前热点</span>
              <span className="text-xs text-gray-400">多信源热度 · 随时间消退</span>
            </div>
            <div className="space-y-1.5">
              {hotNews.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400 w-4 text-xs">{index + 1}</span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1 text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                    {item.title}
                  </span>
                  <span className="text-gray-400 text-xs">{item.sources} 个信源</span>
                  <span className="text-gray-400 text-xs">·</span>
                  <span className="text-gray-400 text-xs">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 资讯列表 - 按日期分组 */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                加载中...
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                暂无资讯
              </div>
            ) : (
              Object.entries(groupedNews).map(([date, items]) => (
                <div key={date}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-900 dark:text-white font-medium text-sm">{date}</span>
                  </div>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <article key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-400 mt-0.5">{formatTime(item.publishedAt)}</span>
                          <div className="flex-1">
                            {/* 来源和标签 */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">{item.source}</span>
                              {item.isFeatured && (
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                  ✦ 精选
                                </span>
                              )}
                              {item.score && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  推荐分 {item.score}
                                </span>
                              )}
                            </div>
                            
                            {/* 标题 */}
                            <Link href={`/news/${item.id}`}>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1.5 hover:text-blue-600 dark:hover:text-blue-400">
                                {item.title}
                              </h3>
                            </Link>
                            
                            {/* 摘要 */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {item.summary}
                            </p>
                            
                            {/* 分类标签 */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {categoryLabels[item.category] || item.category}
                              </span>
                              {item.tags && typeof item.tags === 'string' && item.tags.split(',').filter(Boolean).map((tag) => (
                                <span key={tag} className="text-xs text-gray-500 dark:text-gray-400">
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                            
                            {/* 推荐理由 + 统计 */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>👁 {item.viewCount} 阅读</span>
                              <span>🔗 {item.shareCount} 分享</span>
                              <span>投稿: {item.submitter?.name}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
