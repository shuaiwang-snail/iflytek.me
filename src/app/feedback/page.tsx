"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    type: "suggestion",
    content: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 这里可以接入真实的反馈 API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 ml-64">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                反馈已提交
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                感谢您的反馈，我们会尽快处理！
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                继续反馈
              </button>
            </div>
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
          {/* 标题区 */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              反馈
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              帮助我们改进 iflytek.me
            </p>
          </div>

          {/* 反馈表单 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  反馈类型
                </label>
                <div className="flex gap-4">
                  {[
                    { id: "suggestion", label: "功能建议" },
                    { id: "bug", label: "Bug 反馈" },
                    { id: "content", label: "内容问题" },
                    { id: "other", label: "其他" },
                  ].map((type) => (
                    <label
                      key={type.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        formData.type === type.id
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.id}
                        checked={formData.type === type.id}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="sr-only"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  反馈内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请详细描述您的问题或建议..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  联系方式（选填）
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="邮箱或手机号，方便我们联系您"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "提交中..." : "提交反馈"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                其他联系方式
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>📧 邮箱: feedback@iflytek.me</p>
                <p>💬 微信: iflytek_me</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
