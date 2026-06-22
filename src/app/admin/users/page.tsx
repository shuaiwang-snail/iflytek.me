"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  wechatId: string | null;
  emailContact: string | null;
  wechatQrCode: string;
  isApproved: boolean;
  isAdmin: boolean;
  createdAt: string;
  _count: {
    newsPosts: number;
  };
}

export default function UsersManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (session && !(session.user as any)?.isAdmin) {
      router.push("/");
      return;
    }
    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("获取失败");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("获取用户失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("审核失败:", error);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("确定要拒绝该用户的注册申请吗？")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/reject`, {
        method: "POST",
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("拒绝失败:", error);
    }
  };

  const handleToggleAdmin = async (id: string, makeAdmin: boolean) => {
    if (!confirm(`确定要${makeAdmin ? "设为" : "取消"}管理员吗？`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: makeAdmin }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("设置管理员失败:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除该用户吗？此操作不可恢复！")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const filteredUsers = users
    .filter((user) => {
      if (filter === "all") return true;
      if (filter === "pending") return !user.isApproved;
      if (filter === "approved") return user.isApproved;
      if (filter === "admin") return user.isAdmin;
      return true;
    })
    .filter(
      (user) =>
        searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
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
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">用户管理</h1>
            </div>
            <Link
              href="/admin"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              返回后台
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">总用户数</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">待审核</div>
            <div className="text-2xl font-bold text-orange-600">
              {users.filter((u) => !u.isApproved).length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">已通过</div>
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.isApproved).length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">管理员</div>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter((u) => u.isAdmin).length}
            </div>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {[
              { id: "all", label: "全部" },
              { id: "pending", label: "待审核" },
              { id: "approved", label: "已通过" },
              { id: "admin", label: "管理员" },
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
              placeholder="搜索姓名、邮箱或手机号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* 用户列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">用户信息</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">联系方式</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">注册时间</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">资讯数</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    暂无用户
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {user.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div>📱 {user.phone}</div>
                        {user.wechatId && <div>💬 {user.wechatId}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!user.isApproved ? (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-orange-600 bg-orange-50">
                            待审核
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-50">
                            已通过
                          </span>
                        )}
                        {user.isAdmin && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-purple-600 bg-purple-50">
                            管理员
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {user._count?.newsPosts || 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!user.isApproved ? (
                          <>
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              通过
                            </button>
                            <button
                              onClick={() => handleReject(user.id)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              拒绝
                            </button>
                          </>
                        ) : (
                          <>
                            {user.isAdmin ? (
                              <button
                                onClick={() => handleToggleAdmin(user.id, false)}
                                className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                              >
                                取消管理员
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleAdmin(user.id, true)}
                                className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                              >
                                设管理员
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                        >
                          查看二维码
                        </button>
                        {!user.isAdmin && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                          >
                            删除
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* 二维码弹窗 */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedUser.name} 的微信二维码
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedUser.wechatQrCode}
              alt="微信二维码"
              className="w-full rounded-lg"
            />
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              {selectedUser.wechatId && <p>微信号: {selectedUser.wechatId}</p>}
              {selectedUser.emailContact && <p>联系邮箱: {selectedUser.emailContact}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
