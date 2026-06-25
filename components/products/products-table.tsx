// src/components/products/products-table.tsx
import Link from "next/link";
import { ProductType } from "@/lib/types";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProducts } from "@/lib/actions/product.actions";
import { DeleteProductButton } from "@/components/products/delete-product-button";

interface ProductsTableProps {
  search?: string;
  status?: string;
}

export async function ProductsTable({ search, status }: ProductsTableProps) {
  const products = await getProducts(search, status);

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {search || status
            ? "No products match your search."
            : "No products yet."}
        </p>
        {!search && !status && (
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add your first product
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: ProductType) => {
            const isLowStock = product.stock <= product.lowStockThreshold;
            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium dark:text-white">
                  {product.name}
                </TableCell>
                <TableCell className="text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {product.description ?? "—"}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  ₱{product.price.toFixed(2)}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {product.stock}
                </TableCell>
                <TableCell>
                  {isLowStock ? (
                    <Badge variant="destructive">Low Stock</Badge>
                  ) : (
                    <Badge variant="secondary">In Stock</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteProductButton id={product.id} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
