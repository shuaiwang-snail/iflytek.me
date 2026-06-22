import { prisma } from "../src/lib/prisma";

async function seedData() {
  console.log("开始添加测试数据...");

  // 获取管理员用户
  const admin = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  if (!admin) {
    console.error("管理员账号不存在，请先运行 npm run db:init");
    return;
  }

  // 创建测试资讯
  const testNews = [
    {
      title: "讯飞星火大模型4.0发布：多模态能力全面升级",
      summary: "科大讯飞正式发布星火大模型4.0版本，在文本理解、逻辑推理、数学能力等方面实现重大突破，同时新增图像理解和生成能力，为企业级应用提供更强大的AI支持。",
      content: `科大讯飞于今日正式发布星火大模型4.0版本，这是讯飞在大模型领域的又一重要里程碑。

星火大模型4.0在多个维度实现了全面升级：

1. **文本理解能力**：在复杂语境理解、长文本处理方面提升显著
2. **逻辑推理能力**：数学推理准确率提升至95%以上
3. **多模态能力**：新增图像理解和生成能力，支持图文混合输入输出
4. **代码能力**：支持多种编程语言，代码生成准确率大幅提升

讯飞表示，星火大模型4.0将面向企业客户提供API服务，助力各行业数字化转型。`,
      category: "research",
      source: "科大讯飞官方",
      sourceUrl: "https://www.iflytek.com",
      tags: "大模型,AI,发布会,星火",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
    {
      title: "讯飞智慧教育解决方案落地全国5000+所学校",
      summary: "截至2026年6月，讯飞智慧教育产品已覆盖全国31个省市自治区，服务超过5000所学校，累计服务师生超过2000万人次，助力教育数字化转型。",
      content: `讯飞智慧教育业务再传捷报！最新数据显示，讯飞智慧教育产品已在全国范围内实现规模化应用。

**核心数据：**
- 覆盖省份：31个省市自治区
- 服务学校：5000+所
- 服务师生：2000万+人次
- 智慧课堂：10万+间

**主要产品：**
1. 智慧课堂系统
2. 个性化学习手册
3. 智能评卷系统
4. 英语听说教考平台

讯飞智慧教育解决方案通过AI技术赋能教育教学，帮助教师减负增效，促进学生个性化发展。`,
      category: "education",
      source: "教育信息化周刊",
      sourceUrl: "https://edu.week.com",
      tags: "智慧教育,数字化转型,案例",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 86400000), // 昨天
    },
    {
      title: "讯飞医疗AI辅助诊断系统通过NMPA三类证认证",
      summary: "讯飞医疗自主研发的AI辅助诊断系统正式获得国家药品监督管理局三类医疗器械注册证，标志着讯飞医疗AI技术达到临床应用标准。",
      content: `讯飞医疗迎来重大里程碑！公司自主研发的AI辅助诊断系统正式获得NMPA三类医疗器械注册证。

**认证信息：**
- 产品名称：讯飞AI辅助诊断系统
- 注册证号：国械注准20263210001
- 适用范围：辅助医生进行医学影像诊断

**技术特点：**
1. 支持CT、MRI、X光等多种影像模态
2. 覆盖肺部、脑部、骨骼等多个部位
3. 诊断准确率超过95%
4. 平均诊断时间缩短70%

这是讯飞医疗首款获得三类证的产品，标志着讯飞医疗AI技术正式进入临床应用阶段。`,
      category: "medical",
      source: "医疗器械创新网",
      sourceUrl: "https://medical.device.com",
      tags: "医疗AI,认证,监管",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 172800000), // 前天
    },
    {
      title: "讯飞与某国有大行签署战略合作协议，共建智慧金融",
      summary: "双方将围绕智能客服、智能风控、智能营销等领域展开深度合作，共同打造银行业数字化转型标杆项目。",
      content: `讯飞与某国有大型商业银行签署战略合作协议，双方将在智慧金融领域展开全方位合作。

**合作内容：**
1. **智能客服**：部署讯飞智能客服系统，提升客户服务体验
2. **智能风控**：应用AI技术提升风险识别能力
3. **智能营销**：基于大数据和AI的精准营销解决方案
4. **智能办公**：语音识别技术在银行内部办公场景的应用

**合作目标：**
- 打造银行业数字化转型标杆
- 提升银行运营效率30%以上
- 降低运营成本20%以上

此次合作是讯飞在金融科技领域的重要突破。`,
      category: "finance",
      source: "金融科技时报",
      sourceUrl: "https://fintech.news.com",
      tags: "智慧金融,合作,银行",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 200000), // 几分钟前
    },
    {
      title: "讯飞智能汽车解决方案获某头部车企定点",
      summary: "讯飞车载语音交互系统成功获得某头部新能源车企全系车型定点，预计2027年量产装车超过50万辆。",
      content: `讯飞智能汽车业务再获重大突破！公司车载语音交互系统成功获得某头部新能源车企全系车型定点。

**项目信息：**
- 定点车型：全系车型
- 预计量产时间：2027年
- 预计装车量：50万辆+

**技术优势：**
1. 全双工语音交互
2. 多音区识别
3. 方言识别支持
4. 离线语音识别
5. 多轮对话能力

讯飞车载语音交互系统已在多家车企实现量产，累计装车量超过100万辆。`,
      category: "automotive",
      source: "汽车商业评论",
      sourceUrl: "https://auto.review.com",
      tags: "智能汽车,语音交互,定点",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 259200000), // 3天前
    },
    {
      title: "讯飞城市大脑助力某省会城市获评智慧城市示范",
      summary: "依托讯飞城市大脑平台，该市在政务服务、交通管理、公共安全等领域实现智能化升级，获评2026年度智慧城市示范城市。",
      content: `某省会城市凭借讯飞城市大脑平台的建设成果，成功获评2026年度智慧城市示范城市。

**建设成果：**
1. **政务服务**："一网通办"覆盖率达95%
2. **交通管理**：拥堵指数下降15%
3. **公共安全**：应急响应时间缩短50%
4. **环境保护**：空气质量监测全覆盖

**核心技术：**
- 城市级AI中台
- 大数据治理平台
- 物联网感知平台
- 城市数字孪生

讯飞城市大脑已在多个城市落地，助力城市数字化转型。`,
      category: "city",
      source: "智慧城市导刊",
      sourceUrl: "https://smartcity.news.com",
      tags: "城市大脑,智慧城市,案例",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 345600000), // 4天前
    },
  ];

  for (const newsData of testNews) {
    const existing = await prisma.news.findFirst({
      where: { title: newsData.title },
    });

    if (!existing) {
      await prisma.news.create({
        data: {
          ...newsData,
          submittedBy: admin.id,
        },
      });
      console.log(`✓ 创建资讯: ${newsData.title}`);
    } else {
      console.log(`✗ 资讯已存在: ${newsData.title}`);
    }
  }

  console.log("\n测试数据添加完成！");
  console.log(`管理员账号: ${admin.email}`);
  console.log(`管理员密码: admin123`);
}

seedData()
  .catch((e) => {
    console.error("添加测试数据失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
