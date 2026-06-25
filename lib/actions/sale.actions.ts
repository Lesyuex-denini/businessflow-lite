// src/lib/actions/sale.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const SaleItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  unitPrice: z.coerce.number().positive("Unit price must be positive"),
});

const CreateSaleSchema = z.object({
  items: z.array(SaleItemSchema).min(1, "Add at least one item"),
});

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return { userId: session.user.id as string };
}

export async function createSale(
  items: { productId: string; quantity: number; unitPrice: number }[],
) {
  const { userId } = await getSession();

  const parsed = CreateSaleSchema.safeParse({ items });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  for (const item of parsed.data.items) {
    const product = await db.product.findFirst({
      where: { id: item.productId, userId },
    });
    if (!product) return { error: "Product not found." };
    if (product.stock < item.quantity) {
      return {
        error: `Not enough stock for "${product.name}". Available: ${product.stock}`,
      };
    }
  }

  const total = parsed.data.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  await db.$transaction(
    async (tx: Parameters<Parameters<typeof db.$transaction>[0]>[0]) => {
      const sale = await tx.sale.create({
        data: {
          total,
          userId,
          items: {
            create: parsed.data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });

      for (const item of parsed.data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return sale;
    },
  );

  revalidatePath("/dashboard/sales");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  redirect("/dashboard/history");
}

export async function getSales() {
  const { userId } = await getSession();

  return db.sale.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPaginatedSales(
  page: number = 1,
  perPage: number = 10,
) {
  const { userId } = await getSession();

  const [sales, total] = await Promise.all([
    db.sale.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.sale.count({
      where: { userId },
    }),
  ]);

  return {
    sales,
    total,
    totalPages: Math.ceil(total / perPage),
    currentPage: page,
  };
}

export async function getSalesTotals() {
  const { userId } = await getSession();

  const [totalRevenue, totalUnits] = await Promise.all([
    db.sale.aggregate({
      where: { userId },
      _sum: { total: true },
    }),
    db.saleItem.aggregate({
      where: {
        sale: { userId },
      },
      _sum: { quantity: true },
    }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalUnits: totalUnits._sum.quantity ?? 0,
  };
}

export async function getAllSalesForExport() {
  const { userId } = await getSession();

  return db.sale.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
