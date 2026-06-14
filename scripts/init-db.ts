import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function initDb() {
  console.log("初始化数据库...");

  // 检查是否已存在管理员
  const existingAdmin = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  if (existingAdmin) {
    console.log("管理员账号已存在，跳过创建");
  } else {
    // 创建管理员账号
    const adminEmail = process.env.ADMIN_EMAIL || "admin@iflytek.me";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        name: "管理员",
        email: adminEmail,
        phone: "13800000000",
        password: hashedPassword,
        wechatQrCode: "https://example.com/qr.png",
        isApproved: true,
        isAdmin: true,
      },
    });

    console.log("管理员账号创建成功:", admin.email);
  }

  console.log("数据库初始化完成！");
}

initDb()
  .catch((e) => {
    console.error("初始化失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
