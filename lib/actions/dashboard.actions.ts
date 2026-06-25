// src/lib/actions/dashboard.actions.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return { userId: session.user.id as string };
}

export async function getDashboardMetrics() {
  const { userId } = await getSession();

  const [totalProducts, totalSales, revenueResult, allProducts] =
    await Promise.all([
      db.product.count({ where: { userId } }),
      db.sale.count({ where: { userId } }),
      db.sale.aggregate({
        where: { userId },
        _sum: { total: true },
      }),
      db.product.findMany({
        where: { userId },
        orderBy: { stock: "asc" },
      }),
    ]);

  const lowStockProducts = allProducts.filter(
    (p: { stock: number; lowStockThreshold: number }) =>
      p.stock <= p.lowStockThreshold,
  );

  return {
    totalProducts,
    totalSales,
    revenue: revenueResult._sum.total ?? 0,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
  };
}

export async function getLowStockProducts() {
  const { userId } = await getSession();

  const products = await db.product.findMany({
    where: { userId },
    orderBy: { stock: "asc" },
  });

  return products.filter(
    (p: { stock: number; lowStockThreshold: number }) =>
      p.stock <= p.lowStockThreshold,
  );
}

export async function getRevenueChartData() {
  const { userId } = await getSession();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sales = await db.sale.findMany({
    where: {
      userId,
      createdAt: { gte: thirtyDaysAgo },
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const revenueByDate = new Map<string, number>();

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    });
    revenueByDate.set(key, 0);
  }

  for (const sale of sales) {
    const key = new Date(sale.createdAt).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    });
    revenueByDate.set(key, (revenueByDate.get(key) ?? 0) + sale.total);
  }

  return Array.from(revenueByDate.entries()).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}
