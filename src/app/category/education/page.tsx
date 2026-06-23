"use client";

import { Sidebar } from "@/components/sidebar";

// 教育产品数据
const educationProducts = [
  {
    id: "xuexiji",
    name: "讯飞AI学习机",
    subtitle: "个性化精准学",
    description: "基于科大讯飞二十余年的人工智能技术积累，通过AI精准诊断知识薄弱点，为每位学生定制专属学习路径。",
    features: [
      "AI同步精准学 - 精准定位薄弱项，高效提升",
      "AI作业诊断 - 拍照批改，智能分析",
      "AI口语评测 - 中高考同源技术",
      "AI作文辅导 - 智能批改，范文推荐",
      "护眼大屏 - 13.3英寸类纸屏，守护视力"
    ],
    specs: {
      screen: "13.3英寸 2K类纸屏",
      storage: "8GB+256GB",
      battery: "10000mAh",
      system: "AI学习系统"
    },
    price: "¥8,999起",
    tag: "旗舰爆款"
  },
  {
    id: "cidianbi",
    name: "讯飞扫描词典笔",
    subtitle: "一扫即查，高效学习",
    description: "集扫描查词、语音翻译、听力练习于一体的智能学习工具，让英语学习更高效。",
    features: [
      "0.5秒快速识别 - 一扫即查，无需等待",
      "320万+海量词库 - 覆盖全学段",
      "真人发音 - 欧美真人发音，地道纯正",
      "离线使用 - 无需联网，随时随地查",
      "多行扫描 - 整句翻译，阅读理解更轻松"
    ],
    specs: {
      screen: "3.7英寸高清屏",
      storage: "16GB",
      battery: "1000mAh",
      recognition: "OCR文字识别"
    },
    price: "¥1,299起",
    tag: "热销单品"
  }
];

export default function EducationPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-8 py-6">
          {/* 标题区 */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              教育类产品
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              讯飞智慧教育硬件产品
            </p>
          </div>

          {/* 产品列表 */}
          <div className="space-y-8">
            {educationProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 产品头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {product.name}
                      </h2>
                      <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                        {product.tag}
                      </span>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {product.subtitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {product.price}
                    </p>
                  </div>
                </div>

                {/* 产品描述 */}
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* 功能特点 */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    核心功能
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 规格参数 */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    规格参数
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {key === "screen" && "屏幕"}
                          {key === "storage" && "存储"}
                          {key === "battery" && "电池"}
                          {key === "system" && "系统"}
                          {key === "recognition" && "识别技术"}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
