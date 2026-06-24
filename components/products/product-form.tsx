// src/components/products/product-form.tsx
"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import Link from "next/link";
import { Product } from "@prisma/client";
import { ProductFormState } from "@/lib/actions/product.actions";

type ActionFn = (
  prevState: ProductFormState,
  formData: FormData,
) => Promise<ProductFormState>;

interface ProductFormProps {
  action: ActionFn;
  product?: Product;
  title: string;
}

export function ProductForm({ action, product, title }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.message && (
            <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
              {state.message}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Wireless Mouse"
              defaultValue={product?.name}
              className={state?.errors?.name ? "border-red-400" : ""}
            />
            <FieldError errors={state?.errors?.name} />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of the product"
              defaultValue={product?.description ?? ""}
              rows={3}
            />
            <FieldError errors={state?.errors?.description} />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="price">Price (₱)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={product?.price}
                className={state?.errors?.price ? "border-red-400" : ""}
              />
              <FieldError errors={state?.errors?.price} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                placeholder="0"
                defaultValue={product?.stock}
                className={state?.errors?.stock ? "border-red-400" : ""}
              />
              <FieldError errors={state?.errors?.stock} />
            </div>
          </div>

          {/* Low Stock Threshold */}
          <div className="space-y-1">
            <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
            <Input
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              min="1"
              placeholder="10"
              defaultValue={product?.lowStockThreshold ?? 10}
              className={
                state?.errors?.lowStockThreshold ? "border-red-400" : ""
              }
            />
            <FieldError errors={state?.errors?.lowStockThreshold} />
            <p className="text-xs text-muted-foreground">
              You&apos;ll be alerted when stock drops below this number.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Product"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/products">Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
