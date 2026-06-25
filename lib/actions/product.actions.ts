// src/lib/actions/product.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce
    .number()
    .int("Threshold must be a whole number")
    .min(1, "Threshold must be at least 1")
    .default(10),
});

export type ProductFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    stock?: string[];
    lowStockThreshold?: string[];
  };
  message?: string;
} | null;

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return { userId: session.user.id as string };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { userId } = await getSession();

  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    lowStockThreshold: formData.get("lowStockThreshold"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await db.product.create({
    data: {
      ...parsed.data,
      userId,
    },
  });

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { userId } = await getSession();

  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    lowStockThreshold: formData.get("lowStockThreshold"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const product = await db.product.findFirst({
    where: { id, userId },
  });

  if (!product) return { message: "Product not found." };

  await db.product.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function deleteProduct(id: string) {
  const { userId } = await getSession();

  const product = await db.product.findFirst({
    where: { id, userId },
  });

  if (!product) return { error: "Product not found." };

  await db.product.delete({ where: { id } });
  revalidatePath("/dashboard/products");
}

export async function getProducts(search?: string, status?: string) {
  const { userId } = await getSession();

  const products = await db.product.findMany({
    where: {
      userId,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
    orderBy: { createdAt: "desc" },
  });

  if (status === "low-stock") {
    return products.filter((p) => p.stock <= p.lowStockThreshold);
  }

  if (status === "in-stock") {
    return products.filter((p) => p.stock > p.lowStockThreshold);
  }

  return products;
}

export async function getProductById(id: string) {
  const { userId } = await getSession();

  return db.product.findFirst({
    where: { id, userId },
  });
}

export async function getProductsForSale() {
  const { userId } = await getSession();

  return db.product.findMany({
    where: {
      userId,
      stock: { gt: 0 },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
  });
}
