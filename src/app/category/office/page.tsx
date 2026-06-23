"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

// 办公产品数据
const officeProducts = [
  // 智能办公本
  {
    id: "office-x5-lamy",
    name: "智能办公本 X5 Lamy",
    model: "X5 Lamy",
    series: "X5系列",
    category: "智能办公本",
    subtitle: "Lamy联名，商务旗舰",
    description: "10.3英寸E Ink墨水屏，Lamy定制电磁笔，专业办公手写体验，支持语音转写。",
    features: [
      "10.3英寸E Ink墨水屏",
      "Lamy定制电磁笔",
      "语音实时转写",
      "手写OCR识别",
      "邮件办公协同"
    ],
    specs: {
      screen: "10.3英寸 E Ink",
      storage: "4GB+128GB",
      battery: "4200mAh",
      system: "智能办公系统"
    },
    price: "¥5,999",
    tag: "Lamy联名",
    sortOrder: 10
  },
  {
    id: "office-x5-pro",
    name: "智能办公本 X5 Pro",
    model: "X5 Pro",
    series: "X5系列",
    category: "智能办公本",
    subtitle: "专业办公，高效记录",
    description: "10.3英寸E Ink墨水屏，支持语音转写、手写识别，专业办公首选。",
    features: [
      "10.3英寸E Ink墨水屏",
      "语音实时转写",
      "手写OCR识别",
      "邮件办公协同",
      "多设备同步"
    ],
    specs: {
      screen: "10.3英寸 E Ink",
      storage: "4GB+128GB",
      battery: "4200mAh",
      system: "智能办公系统"
    },
    price: "¥4,999",
    tag: "专业办公",
    sortOrder: 9
  },
  {
    id: "office-x5",
    name: "智能办公本 X5",
    model: "X5",
    series: "X5系列",
    category: "智能办公本",
    subtitle: "经典办公本，高效之选",
    description: "10.3英寸E Ink墨水屏，语音转写、手写识别，经典办公本。",
    features: [
      "10.3英寸E Ink墨水屏",
      "语音实时转写",
      "手写OCR识别",
      "邮件办公协同",
      "轻薄便携"
    ],
    specs: {
      screen: "10.3英寸 E Ink",
      storage: "4GB+64GB",
      battery: "4200mAh",
      system: "智能办公系统"
    },
    price: "¥3,999",
    tag: "经典之选",
    sortOrder: 8
  },
  {
    id: "office-air3-pro",
    name: "智能办公本 Air3 Pro",
    model: "Air3 Pro",
    series: "Air系列",
    category: "智能办公本",
    subtitle: "轻薄旗舰，随身办公",
    description: "7.8英寸E Ink墨水屏，轻薄便携，支持语音转写，随身办公利器。",
    features: [
      "7.8英寸E Ink墨水屏",
      "轻薄便携设计",
      "语音实时转写",
      "手写OCR识别",
      "长续航电池"
    ],
    specs: {
      screen: "7.8英寸 E Ink",
      storage: "4GB+64GB",
      battery: "3200mAh",
      system: "智能办公系统"
    },
    price: "¥3,499",
    tag: "轻薄旗舰",
    sortOrder: 7
  },
  {
    id: "office-air3",
    name: "智能办公本 Air3",
    model: "Air3",
    series: "Air系列",
    category: "智能办公本",
    subtitle: "轻薄便携，入门办公",
    description: "7.8英寸E Ink墨水屏，轻薄便携，支持语音转写，入门办公本。",
    features: [
      "7.8英寸E Ink墨水屏",
      "轻薄便携设计",
      "语音实时转写",
      "手写OCR识别",
      "长续航电池"
    ],
    specs: {
      screen: "7.8英寸 E Ink",
      storage: "3GB+32GB",
      battery: "3200mAh",
      system: "智能办公系统"
    },
    price: "¥2,799",
    tag: "轻薄入门",
    sortOrder: 6
  },
  {
    id: "office-ainote2-keyboard",
    name: "蝉翼墨水屏平板 AINOTE 2 键盘版",
    model: "AINOTE 2 键盘版",
    series: "AINOTE系列",
    category: "智能办公本",
    subtitle: "键盘套装，办公利器",
    description: "10.3英寸蝉翼墨水屏，搭配磁吸键盘，办公输入更高效。",
    features: [
      "10.3英寸蝉翼墨水屏",
      "磁吸键盘套装",
      "语音实时转写",
      "手写OCR识别",
      "多任务办公"
    ],
    specs: {
      screen: "10.3英寸 蝉翼墨水屏",
      storage: "4GB+128GB",
      battery: "4600mAh",
      system: "智能办公系统"
    },
    price: "¥4,299",
    tag: "键盘套装",
    sortOrder: 5
  },
  {
    id: "office-ainote2",
    name: "蝉翼墨水屏平板 AINOTE 2",
    model: "AINOTE 2",
    series: "AINOTE系列",
    category: "智能办公本",
    subtitle: "蝉翼墨水屏，轻薄办公",
    description: "10.3英寸蝉翼墨水屏，轻薄便携，支持语音转写，办公新选择。",
    features: [
      "10.3英寸蝉翼墨水屏",
      "轻薄便携设计",
      "语音实时转写",
      "手写OCR识别",
      "长续航电池"
    ],
    specs: {
      screen: "10.3英寸 蝉翼墨水屏",
      storage: "4GB+64GB",
      battery: "4600mAh",
      system: "智能办公系统"
    },
    price: "¥3,299",
    tag: "蝉翼墨水屏",
    sortOrder: 4
  },
  {
    id: "office-max2",
    name: "智能办公本 Max2",
    model: "Max2",
    series: "Max系列",
    category: "智能办公本",
    subtitle: "大屏办公，视野开阔",
    description: "13.3英寸E Ink墨水屏，大屏办公，视野更开阔，专业办公首选。",
    features: [
      "13.3英寸E Ink墨水屏",
      "大屏办公体验",
      "语音实时转写",
      "手写OCR识别",
      "邮件办公协同"
    ],
    specs: {
      screen: "13.3英寸 E Ink",
      storage: "6GB+128GB",
      battery: "4800mAh",
      system: "智能办公系统"
    },
    price: "¥6,999",
    tag: "大屏旗舰",
    sortOrder: 3
  },
  // 电子阅读器
  {
    id: "reader-fika",
    name: "阅读器 Fika",
    model: "Fika",
    series: "Fika系列",
    category: "电子阅读器",
    subtitle: "舒适阅读，护眼首选",
    description: "6英寸E Ink墨水屏，轻薄便携，支持多种格式电子书阅读。",
    features: [
      "6英寸E Ink墨水屏",
      "轻薄便携设计",
      "多格式支持",
      "护眼阅读",
      "长续航电池"
    ],
    specs: {
      screen: "6英寸 E Ink",
      storage: "2GB+32GB",
      battery: "1500mAh",
      system: "阅读系统"
    },
    price: "¥899",
    tag: "舒适阅读",
    sortOrder: 2
  },
  {
    id: "reader-qidian",
    name: "起点阅读器",
    model: "起点",
    series: "起点系列",
    category: "电子阅读器",
    subtitle: "网文阅读，追更神器",
    description: "6英寸E Ink墨水屏，起点读书深度合作，网文追更神器。",
    features: [
      "6英寸E Ink墨水屏",
      "起点读书深度整合",
      "网文追更提醒",
      "护眼阅读",
      "长续航电池"
    ],
    specs: {
      screen: "6英寸 E Ink",
      storage: "2GB+32GB",
      battery: "1500mAh",
      system: "阅读系统"
    },
    price: "¥699",
    tag: "网文追更",
    sortOrder: 1
  },
  {
    id: "reader-s2",
    name: "青少年阅读本 S2",
    model: "S2",
    series: "S系列",
    category: "电子阅读器",
    subtitle: "青少年专属，健康成长",
    description: "6英寸E Ink墨水屏，青少年专属阅读本，家长管控，健康成长。",
    features: [
      "6英寸E Ink墨水屏",
      "家长管控系统",
      "青少年内容推荐",
      "护眼阅读",
      "学习辅助功能"
    ],
    specs: {
      screen: "6英寸 E Ink",
      storage: "2GB+32GB",
      battery: "1500mAh",
      system: "青少年阅读系统"
    },
    price: "¥999",
    tag: "青少年专属",
    sortOrder: 0
  },
  {
    id: "reader-s2-shaoxin",
    name: "青少年阅读本 S2 邵鑫读书版",
    model: "S2 邵鑫读书版",
    series: "S系列",
    category: "电子阅读器",
    subtitle: "邵鑫读书，名师导读",
    description: "6英寸E Ink墨水屏，邵鑫读书深度合作，名师导读，提升阅读能力。",
    features: [
      "6英寸E Ink墨水屏",
      "邵鑫读书深度整合",
      "名师导读课程",
      "护眼阅读",
      "学习辅助功能"
    ],
    specs: {
      screen: "6英寸 E Ink",
      storage: "2GB+32GB",
      battery: "1500mAh",
      system: "青少年阅读系统"
    },
    price: "¥1,199",
    tag: "名师导读",
    sortOrder: -1
  },
  // 翻译
  {
    id: "translate-dual2",
    name: "双屏翻译机 2.0",
    model: "双屏2.0",
    series: "双屏系列",
    category: "翻译",
    subtitle: "双屏交互，沟通无界",
    description: "双屏设计，面对面翻译，支持83种语言，商务出行必备。",
    features: [
      "双屏交互设计",
      "83种语言互译",
      "离线翻译",
      "拍照翻译",
      "录音转写"
    ],
    specs: {
      screen: "双4.1英寸屏幕",
      storage: "3GB+32GB",
      battery: "2380mAh",
      system: "翻译系统 2.0"
    },
    price: "¥4,999",
    tag: "双屏旗舰",
    sortOrder: -2
  },
  {
    id: "translate-dual",
    name: "双屏翻译机",
    model: "双屏",
    series: "双屏系列",
    category: "翻译",
    subtitle: "双屏设计，高效沟通",
    description: "双屏设计，面对面翻译，支持60种语言，出国旅行必备。",
    features: [
      "双屏交互设计",
      "60种语言互译",
      "离线翻译",
      "拍照翻译",
      "录音转写"
    ],
    specs: {
      screen: "双4.1英寸屏幕",
      storage: "2GB+16GB",
      battery: "2380mAh",
      system: "翻译系统"
    },
    price: "¥3,999",
    tag: "双屏经典",
    sortOrder: -3
  },
  {
    id: "translate-4",
    name: "翻译机 4.0 星火版",
    model: "4.0星火版",
    series: "4.0系列",
    category: "翻译",
    subtitle: "星火大模型，智能翻译",
    description: "星火大模型加持，支持85种语言，智能翻译更精准。",
    features: [
      "星火大模型加持",
      "85种语言互译",
      "离线翻译",
      "拍照翻译",
      "AI对话翻译"
    ],
    specs: {
      screen: "5.05英寸高清屏",
      storage: "3GB+32GB",
      battery: "2200mAh",
      system: "翻译系统 4.0"
    },
    price: "¥3,299",
    tag: "星火版",
    sortOrder: -4
  },
  {
    id: "translate-earphone",
    name: "翻译耳机",
    model: "翻译耳机",
    series: "耳机系列",
    category: "翻译",
    subtitle: "随身翻译，听译同步",
    description: "真无线耳机，支持实时翻译，听译同步，出国旅行好帮手。",
    features: [
      "真无线设计",
      "实时语音翻译",
      "40种语言互译",
      "离线翻译",
      "长续航电池"
    ],
    specs: {
      screen: "无屏幕",
      storage: "内置存储",
      battery: "耳机30h+",
      system: "翻译系统"
    },
    price: "¥1,499",
    tag: "随身翻译",
    sortOrder: -5
  },
  // 录音转写
  {
    id: "recorder-s8",
    name: "AI录音笔 S8 离线版",
    model: "S8 离线版",
    series: "S系列",
    category: "录音转写",
    subtitle: "离线转写，安全保密",
    description: "支持离线语音转写，无需联网，安全保密，商务会议首选。",
    features: [
      "离线语音转写",
      "无需联网",
      "安全保密",
      "多语言支持",
      "长续航电池"
    ],
    specs: {
      screen: "2英寸屏幕",
      storage: "32GB",
      battery: "2000mAh",
      system: "AI录音系统"
    },
    price: "¥2,999",
    tag: "离线转写",
    sortOrder: -6
  },
  {
    id: "recorder-s6plus",
    name: "AI录音笔 S6 Plus",
    model: "S6 Plus",
    series: "S系列",
    category: "录音转写",
    subtitle: "专业录音，精准转写",
    description: "专业录音，支持实时转写，精准识别，会议记录好帮手。",
    features: [
      "专业录音",
      "实时语音转写",
      "精准识别",
      "多语言支持",
      "长续航电池"
    ],
    specs: {
      screen: "1.4英寸屏幕",
      storage: "16GB",
      battery: "1500mAh",
      system: "AI录音系统"
    },
    price: "¥1,999",
    tag: "专业录音",
    sortOrder: -7
  },
  {
    id: "recorder-s6",
    name: "AI录音笔 S6",
    model: "S6",
    series: "S系列",
    category: "录音转写",
    subtitle: "智能录音，轻松转写",
    description: "智能录音，支持实时转写，轻松记录，学习工作好帮手。",
    features: [
      "智能录音",
      "实时语音转写",
      "轻松记录",
      "多语言支持",
      "便携设计"
    ],
    specs: {
      screen: "1.4英寸屏幕",
      storage: "16GB",
      battery: "1500mAh",
      system: "AI录音系统"
    },
    price: "¥1,299",
    tag: "智能录音",
    sortOrder: -8
  },
  {
    id: "recorder-magic",
    name: "AI录音笔 Magic",
    model: "Magic",
    series: "Magic系列",
    category: "录音转写",
    subtitle: "魔法录音，一键转写",
    description: "魔法录音，一键转写，小巧便携，随身记录好帮手。",
    features: [
      "魔法录音",
      "一键转写",
      "小巧便携",
      "多语言支持",
      "时尚设计"
    ],
    specs: {
      screen: "无屏幕",
      storage: "16GB",
      battery: "20h续航",
      system: "AI录音系统"
    },
    price: "¥799",
    tag: "魔法录音",
    sortOrder: -9
  },
  {
    id: "recorder-pokee",
    name: "AI录音笔 Pokee",
    model: "Pokee",
    series: "Pokee系列",
    category: "录音转写",
    subtitle: "口袋录音，随时记录",
    description: "口袋录音笔，小巧便携，随时记录，学习工作好帮手。",
    features: [
      "口袋设计",
      "随时记录",
      "小巧便携",
      "多语言支持",
      "长续航电池"
    ],
    specs: {
      screen: "无屏幕",
      storage: "16GB",
      battery: "15h续航",
      system: "AI录音系统"
    },
    price: "¥499",
    tag: "口袋录音",
    sortOrder: -10
  }
];

// 按型号从高到低排序
const sortedProducts = [...officeProducts].sort((a, b) => b.sortOrder - a.sortOrder);

// 过滤产品
const filterProducts = (category: string) => {
  if (category === "全部") return sortedProducts;
  return sortedProducts.filter(p => p.category === category);
};

export default function OfficePage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const categories = ["全部", "智能办公本", "电子阅读器", "翻译", "录音转写"];
  const filteredProducts = filterProducts(activeCategory);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="max-w-6xl mx-auto px-8 py-6">
          {/* 标题区 */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              办公类产品
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              讯飞智能办公硬件产品 · 按型号排序
            </p>
          </div>

          {/* 分类标签 */}
          <div className="flex gap-2 mb-6 flex-wrap">
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
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 flex items-center justify-between">
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
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {product.series}
                    </span>
                  </div>

                  {/* 产品名称 */}
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {product.name}
                  </h2>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-3">
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
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
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
                  <button className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
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
