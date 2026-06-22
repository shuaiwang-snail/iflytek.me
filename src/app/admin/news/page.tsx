"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface News {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SCHEDULED" | "PUBLISHED";
  submittedAt: string;
  publishedAt: string | null;
  scheduledAt: string | null;
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

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "待审核", color: "text-orange-600 bg-orange-50" },
  APPROVED: { label: "已通过", color: "text-blue-600 bg-blue-50" },
  REJECTED: { label: "已拒绝", color: "text-red-600 bg-red-50" },
  SCHEDULED: { label: "已排期", color: "text-purple-600 bg-purple-50" },
  PUBLISHED: { label: "已发布", color: "text-green-600 bg-green-50" },
};

export default function NewsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (session && !(session.user as any)?.isAdmin) {
      router.push("/");
      return;
    }
    fetchNews();
  }, [session, status, router]);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/admin/news");
      if (!res.ok) throw new Error("获取失败");
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error("获取资讯失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/news/${id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error("审核失败:", error);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("请输入拒绝原因:");
    if (!reason) return;
    try {
      const res = await fetch(`/api/admin/news/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error("拒绝失败:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条资讯吗？")) return;
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const filteredNews = news
    .filter((item) => filter === "all" || item.status === filter)
    .filter(
      (item) =>
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

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
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">资讯管理</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/news/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                + 发布资讯
              </Link>
              <Link
                href="/admin"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                返回后台
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 筛选和搜索 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {[
              { id: "all", label: "全部" },
              { id: "PENDING", label: "待审核" },
              { id: "APPROVED", label: "已通过" },
              { id: "SCHEDULED", label: "已排期" },
              { id: "PUBLISHED", label: "已发布" },
              { id: "REJECTED", label: "已拒绝" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === item.id
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索标题或摘要..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* 资讯列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">标题</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">分类</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">提交人</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">时间</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">统计</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    暂无资讯
                  </td>
                </tr>
              ) : (
                filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {item.source}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {categoryLabels[item.category] || item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          statusLabels[item.status]?.color || "text-gray-600 bg-gray-100"
                        }`}
                      >
                        {statusLabels[item.status]?.label || item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {item.submitter?.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.scheduledAt
                          ? `排期: ${new Date(item.scheduledAt).toLocaleString("zh-CN")}`
                          : item.publishedAt
                          ? `发布: ${new Date(item.publishedAt).toLocaleString("zh-CN")}`
                          : `提交: ${new Date(item.submittedAt).toLocaleString("zh-CN")}`}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      👁 {item.viewCount} · 🔗 {item.shareCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {item.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              通过
                            </button>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              拒绝
                            </button>
                          </>
                        )}
                        <Link
                          href={`/news/${item.id}`}
                          target="_blank"
                          className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          查看
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
