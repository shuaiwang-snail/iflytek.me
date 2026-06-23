"use client";

import { Sidebar } from "@/components/sidebar";

// 教育产品数据
const educationProducts = [
  {
    id: "xuexiji-t30",
    name: "讯飞AI学习机 T30 Ultra",
    model: "T30 Ultra",
    subtitle: "旗舰顶配，AI精准学",
    description: "14.7英寸类自然光护眼屏，星火大模型加持，全科AI精准学，适合小学到高中全学段。",
    features: [
      "14.7英寸类自然光护眼屏",
      "星火大模型AI 1对1辅导",
      "全科AI精准学",
      "12000mAh超大电池",
      "12GB+512GB超大存储"
    ],
    specs: {
      screen: "14.7英寸 3K类纸屏",
      storage: "12GB+512GB",
      battery: "12000mAh",
      system: "AI学习系统 4.0"
    },
    price: "¥11,999",
    tag: "旗舰顶配",
    sortOrder: 5
  },
  {
    id: "xuexiji-t20",
    name: "讯飞AI学习机 T20 Pro",
    model: "T20 Pro",
    subtitle: "高端旗舰，精准提升",
    description: "13.3英寸护眼大屏，AI同步精准学，中高考同源评测技术，让学习更高效。",
    features: [
      "13.3英寸2K类纸护眼屏",
      "AI同步精准学",
      "中高考同源口语评测",
      "AI作文批改辅导",
      "10000mAh大电池"
    ],
    specs: {
      screen: "13.3英寸 2K类纸屏",
      storage: "8GB+512GB",
      battery: "10000mAh",
      system: "AI学习系统 4.0"
    },
    price: "¥8,999",
    tag: "高端旗舰",
    sortOrder: 4
  },
  {
    id: "xuexiji-s30",
    name: "讯飞AI学习机 S30",
    model: "S30",
    subtitle: "性价比之选",
    description: "11英寸护眼屏，AI精准学，适合小学到初中，性价比极高的学习伙伴。",
    features: [
      "11英寸护眼屏",
      "AI精准诊断",
      "同步课程学习",
      "家长管控",
      "轻薄便携"
    ],
    specs: {
      screen: "11英寸 FHD",
      storage: "6GB+128GB",
      battery: "7500mAh",
      system: "AI学习系统 3.0"
    },
    price: "¥4,999",
    tag: "性价比",
    sortOrder: 3
  },
  {
    id: "cidianbi-p20",
    name: "讯飞AI词典笔 P20 Plus",
    model: "P20 Plus",
    subtitle: "大屏旗舰，专业翻译",
    description: "3.7英寸大屏，支持多行扫描，离线翻译，适合大学生及专业人士。",
    features: [
      "3.7英寸高清大屏",
      "多行扫描翻译",
      "500万+海量词库",
      "离线翻译",
      "语音翻译"
    ],
    specs: {
      screen: "3.7英寸高清屏",
      storage: "32GB",
      battery: "1200mAh",
      recognition: "OCR多行扫描"
    },
    price: "¥1,699",
    tag: "大屏旗舰",
    sortOrder: 2
  },
  {
    id: "cidianbi-s10",
    name: "讯飞扫描词典笔 S10",
    model: "S10",
    subtitle: "一扫即查，高效学习",
    description: "3.2英寸屏幕，0.5秒快速识别，320万+词库，覆盖全学段英语学习需求。",
    features: [
      "3.2英寸高清屏",
      "0.5秒快速识别",
      "320万+海量词库",
      "真人发音",
      "离线使用"
    ],
    specs: {
      screen: "3.2英寸高清屏",
      storage: "16GB",
      battery: "1000mAh",
      recognition: "OCR文字识别"
    },
    price: "¥1,299",
    tag: "热销单品",
    sortOrder: 1
  }
];

// 按型号从高到低排序
const sortedProducts = [...educationProducts].sort((a, b) => b.sortOrder - a.sortOrder);

export default function EducationPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="max-w-6xl mx-auto px-8 py-6">
          {/* 标题区 */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              教育类产品
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              讯飞智慧教育硬件产品 · 按型号排序
            </p>
          </div>

          {/* 产品网格 - 窗口形式 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                {/* 产品头部 - 型号标识 */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-lg">{product.model}</span>
                    <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                      {product.tag}
                    </span>
                  </div>
                  <span className="text-white font-bold text-xl">{product.price}</span>
                </div>

                {/* 产品内容 */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* 产品名称 */}
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {product.name}
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-3">
                    {product.subtitle}
                  </p>

                  {/* 产品描述 */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* 核心功能 */}
                  <div className="mb-4 flex-1">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      核心功能
                    </h3>
                    <ul className="space-y-1.5">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 规格参数 - 标签形式 */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 底部操作 */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                  <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    了解详情
                  </button>
                  <button className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    立即购买
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
