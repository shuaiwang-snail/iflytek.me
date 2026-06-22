"use client";

import { Sidebar } from "@/components/sidebar";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-8 py-6">
          {/* 标题区 */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              关于
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              了解 iflytek.me
            </p>
          </div>

          {/* 内容 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                🎙️ 我为讯飞代言
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                iflytek.me 是一个专为讯飞人打造的资讯分享平台。我们致力于收集、整理和分享
                科大讯飞在各行业的最新动态、技术突破和应用案例。
              </p>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                我们的使命
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                让每一位讯飞人都能及时了解公司的最新动态，让外界更好地认识讯飞的技术实力和
                行业影响力。我们相信，信息的流通和分享能够创造更大的价值。
              </p>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                平台特色
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>
                  <strong>精选资讯</strong> - 每天精选讯飞在各行业的最新动态
                </li>
                <li>
                  <strong>分类浏览</strong> - 教育、医疗、金融、汽车等多领域覆盖
                </li>
                <li>
                  <strong>讯飞日报</strong> - 每日定时推送，不错过重要信息
                </li>
                <li>
                  <strong>分享推广</strong> - 每位用户都可以成为讯飞代言人
                </li>
                <li>
                  <strong>社区共建</strong> - 注册用户可投稿，管理员审核发布
                </li>
              </ul>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                内容覆盖领域
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  { name: "教育", desc: "智慧教育解决方案" },
                  { name: "医疗", desc: "AI辅助诊断" },
                  { name: "金融", desc: "智能客服与风控" },
                  { name: "汽车", desc: "车载语音交互" },
                  { name: "城市", desc: "城市大脑" },
                  { name: "运营商", desc: "智能客服" },
                  { name: "工业", desc: "工业互联网" },
                  { name: "科研", desc: "大模型技术" },
                  { name: "办公", desc: "智能办公" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                加入我们
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                欢迎讯飞员工注册成为内容贡献者。通过审核后，您可以投稿分享您所了解的
                讯飞动态，成为讯飞代言人！
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                  联系方式
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  如有任何问题或建议，请通过反馈页面与我们联系。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
