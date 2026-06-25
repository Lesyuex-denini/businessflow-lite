// src/lib/actions/dashboard.actions.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

export async function getDashboardMetrics() {
  const session = await getSession();
  const userId = session.user!.id as string;

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
  const session = await getSession();

  const products = await db.product.findMany({
    where: { userId: session.user!.id as string },

    orderBy: { stock: "asc" },
  });

  return products.filter(
    (p: { stock: number; lowStockThreshold: number }) =>
      p.stock <= p.lowStockThreshold,
  );
}

export async function getRevenueChartData() {
  const session = await getSession();

  // Get last 30 days of sales
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sales = await db.sale.findMany({
    where: {
      userId: session.user.id,
      createdAt: { gte: thirtyDaysAgo },
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Build a map of date → revenue
  const revenueByDate = new Map<string, number>();

  // Pre-fill all 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    });
    revenueByDate.set(key, 0);
  }

  // Add actual sales
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
