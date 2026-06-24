// src/components/sales/sale-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSale } from "@/lib/actions/sale.actions";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface SaleLineItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export function SaleForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SaleLineItem[]>([
    { productId: "", quantity: 1, unitPrice: 0 },
  ]);

  function addItem() {
    setItems((prev) => [...prev, { productId: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(
    index: number,
    field: keyof SaleLineItem,
    value: string | number,
  ) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        if (field === "productId") {
          const product = products.find((p) => p.id === value);
          return {
            ...item,
            productId: value as string,
            unitPrice: product?.price ?? 0,
          };
        }

        return { ...item, [field]: Number(value) };
      }),
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  async function handleSubmit() {
    if (items.some((i) => !i.productId)) {
      toast.error("Please select a product for each line item.");
      return;
    }

    setLoading(true);
    const result = await createSale(items);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("Sale recorded successfully!");
  }

  if (products.length === 0) {
    return (
      <Card className="max-w-2xl dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">
            No products with available stock. Add products first.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push("/dashboard/products/new")}
          >
            Add Products
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Sale Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          <div className="col-span-5">Product</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-3">Unit Price</div>
          <div className="col-span-1">Subtotal</div>
          <div className="col-span-1"></div>
        </div>

        {/* Line Items */}
        {items.map((item, index) => {
          const selectedProduct = products.find((p) => p.id === item.productId);
          const subtotal = item.unitPrice * item.quantity;

          return (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              {/* Product Select */}
              <div className="col-span-5">
                <Select
                  value={item.productId}
                  onValueChange={(val) => updateItem(index, "productId", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.stock} left)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="col-span-2">
                <Input
                  type="number"
                  min={1}
                  max={selectedProduct?.stock ?? 1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                />
              </div>

              {/* Unit Price */}
              <div className="col-span-3">
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(index, "unitPrice", e.target.value)
                  }
                />
              </div>

              {/* Subtotal */}
              <div className="col-span-1 text-sm font-medium dark:text-gray-300">
                ₱{subtotal.toFixed(2)}
              </div>

              {/* Remove */}
              <div className="col-span-1">
                {items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Item */}
        <Button variant="outline" onClick={addItem} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Product
        </Button>

        {/* Total */}
        <div className="flex justify-end pt-2 border-t">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>

            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₱{total.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Recording..." : "Record Sale"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/history")}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
