"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

// 教育产品数据 - 按型号从高到低排序
const educationProducts = [
  // 学习机 T90 系列（最高端）
  {
    id: "xuexiji-t90-pro",
    name: "讯飞AI学习机 T90 Pro",
    model: "T90 Pro",
    series: "T90系列",
    category: "学习机",
    subtitle: "旗舰顶配，AI精准学",
    description: "14.7英寸类自然光护眼屏，星火大模型加持，全科AI精准学，适合小学到高中全学段。",
    features: [
      "14.7英寸类自然光护眼屏",
      "星火大模型AI 1对1辅导",
      "全科AI精准学",
      "12000mAh超大电池",
      "16GB+1TB超大存储"
    ],
    specs: {
      screen: "14.7英寸 3K类纸屏",
      storage: "16GB+1TB",
      battery: "12000mAh",
      system: "AI学习系统 5.0"
    },
    price: "¥12,999",
    tag: "旗舰顶配",
    sortOrder: 10
  },
  {
    id: "xuexiji-t90-lite",
    name: "讯飞AI学习机 T90 Lite",
    model: "T90 Lite",
    series: "T90系列",
    category: "学习机",
    subtitle: "高端旗舰，精准提升",
    description: "14.7英寸护眼大屏，AI同步精准学，中高考同源评测技术，让学习更高效。",
    features: [
      "14.7英寸2K类纸护眼屏",
      "AI同步精准学",
      "中高考同源口语评测",
      "AI作文批改辅导",
      "12000mAh大电池"
    ],
    specs: {
      screen: "14.7英寸 2K类纸屏",
      storage: "12GB+512GB",
      battery: "12000mAh",
      system: "AI学习系统 5.0"
    },
    price: "¥10,999",
    tag: "高端旗舰",
    sortOrder: 9
  },
  // 学习机 S90 系列
  {
    id: "xuexiji-s90-pro",
    name: "讯飞AI学习机 S90 Pro",
    model: "S90 Pro",
    series: "S90系列",
    category: "学习机",
    subtitle: "性能旗舰，全面升级",
    description: "13.3英寸护眼屏，AI精准学，适合小学到初中，性能全面升级。",
    features: [
      "13.3英寸类纸护眼屏",
      "AI精准诊断",
      "同步课程学习",
      "家长智能管控",
      "10000mAh大电池"
    ],
    specs: {
      screen: "13.3英寸 2K类纸屏",
      storage: "12GB+512GB",
      battery: "10000mAh",
      system: "AI学习系统 4.5"
    },
    price: "¥8,999",
    tag: "性能旗舰",
    sortOrder: 8
  },
  // 学习机 T30 系列
  {
    id: "xuexiji-t30-ultra",
    name: "讯飞AI学习机 T30 Ultra",
    model: "T30 Ultra",
    series: "T30系列",
    category: "学习机",
    subtitle: "经典旗舰，AI精准学",
    description: "13.3英寸护眼大屏，星火大模型加持，全科AI精准学，经典旗舰之选。",
    features: [
      "13.3英寸2K类纸护眼屏",
      "星火大模型AI辅导",
      "全科AI精准学",
      "AI作业诊断",
      "10000mAh大电池"
    ],
    specs: {
      screen: "13.3英寸 2K类纸屏",
      storage: "12GB+512GB",
      battery: "10000mAh",
      system: "AI学习系统 4.0"
    },
    price: "¥8,999",
    tag: "经典旗舰",
    sortOrder: 7
  },
  {
    id: "xuexiji-t30-pro",
    name: "讯飞AI学习机 T30 Pro",
    model: "T30 Pro",
    series: "T30系列",
    category: "学习机",
    subtitle: "高端之选，精准提升",
    description: "13.3英寸护眼大屏，AI同步精准学，中高考同源评测技术。",
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
    price: "¥7,999",
    tag: "高端之选",
    sortOrder: 6
  },
  {
    id: "xuexiji-t30-lite",
    name: "讯飞AI学习机 T30 Lite",
    model: "T30 Lite",
    series: "T30系列",
    category: "学习机",
    subtitle: "性价比之选",
    description: "13.3英寸护眼屏，AI精准学，适合小学到初中，高性价比。",
    features: [
      "13.3英寸护眼屏",
      "AI精准诊断",
      "同步课程学习",
      "家长管控",
      "轻薄便携"
    ],
    specs: {
      screen: "13.3英寸 FHD",
      storage: "8GB+256GB",
      battery: "8000mAh",
      system: "AI学习系统 4.0"
    },
    price: "¥6,999",
    tag: "性价比",
    sortOrder: 5
  },
  // AI词典笔 P30 系列
  {
    id: "cidianbi-p30-pro",
    name: "讯飞AI词典笔 P30 Pro",
    model: "P30 Pro",
    series: "P30系列",
    category: "词典笔",
    subtitle: "大屏旗舰，专业翻译",
    description: "4.0英寸大屏，支持多行扫描，离线翻译，适合大学生及专业人士。",
    features: [
      "4.0英寸高清大屏",
      "多行扫描翻译",
      "600万+海量词库",
      "离线翻译",
      "语音翻译"
    ],
    specs: {
      screen: "4.0英寸高清屏",
      storage: "32GB",
      battery: "1500mAh",
      recognition: "OCR多行扫描"
    },
    price: "¥1,999",
    tag: "大屏旗舰",
    sortOrder: 4
  },
  // AI词典笔 X9 系列
  {
    id: "cidianbi-x9-pro",
    name: "讯飞AI词典笔 X9 Pro",
    model: "X9 Pro",
    series: "X9系列",
    category: "词典笔",
    subtitle: "专业版，全面升级",
    description: "3.7英寸屏幕，0.5秒快速识别，500万+词库，专业版全面升级。",
    features: [
      "3.7英寸高清大屏",
      "0.3秒极速识别",
      "500万+海量词库",
      "真人发音",
      "离线使用"
    ],
    specs: {
      screen: "3.7英寸高清屏",
      storage: "32GB",
      battery: "1200mAh",
      recognition: "OCR多行扫描"
    },
    price: "¥1,699",
    tag: "专业版",
    sortOrder: 3
  },
  // AI词典笔 X8 系列
  {
    id: "cidianbi-x8-pro",
    name: "讯飞AI词典笔 X8 Pro",
    model: "X8 Pro",
    series: "X8系列",
    category: "词典笔",
    subtitle: "一扫即查，高效学习",
    description: "3.5英寸屏幕，0.5秒快速识别，400万+词库，覆盖全学段英语学习需求。",
    features: [
      "3.5英寸高清屏",
      "0.5秒快速识别",
      "400万+海量词库",
      "真人发音",
      "离线使用"
    ],
    specs: {
      screen: "3.5英寸高清屏",
      storage: "16GB",
      battery: "1000mAh",
      recognition: "OCR文字识别"
    },
    price: "¥1,299",
    tag: "热销单品",
    sortOrder: 2
  },
  {
    id: "cidianbi-x8",
    name: "讯飞AI词典笔 X8",
    model: "X8",
    series: "X8系列",
    category: "词典笔",
    subtitle: "入门首选，轻松学习",
    description: "3.2英寸屏幕，0.5秒快速识别，320万+词库，入门首选。",
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
    price: "¥999",
    tag: "入门首选",
    sortOrder: 1
  }
];

// 按型号从高到低排序
const sortedProducts = [...educationProducts].sort((a, b) => b.sortOrder - a.sortOrder);

// 过滤产品
const filterProducts = (category: string) => {
  if (category === "全部") return sortedProducts;
  return sortedProducts.filter(p => p.category === category);
};

export default function EducationPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const categories = ["全部", "学习机", "词典笔"];
  const filteredProducts = filterProducts(activeCategory);

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

          {/* 分类标签 */}
          <div className="flex gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 产品网格 - 窗口形式 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
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
                  {/* 系列标识 */}
                  <div className="mb-2">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {product.series}
                    </span>
                  </div>

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
