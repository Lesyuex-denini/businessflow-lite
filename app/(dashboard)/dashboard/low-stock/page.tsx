// src/app/(dashboard)/dashboard/low-stock/page.tsx
import Link from "next/link";
import { AlertTriangle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLowStockProducts } from "@/lib/actions/dashboard.actions";

export default async function LowStockPage() {
  const products = await getLowStockProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Low Stock Alerts
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Products that need to be restocked soon
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products">
            <Package className="h-4 w-4 mr-2" />
            Manage Products
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertTriangle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            All products are well stocked!
          </p>
          <p className="text-gray-400 text-sm mt-1">
            You&apos;ll see alerts here when stock drops below your thresholds.
          </p>
        </div>
      ) : (
        <>
          {/* Alert Banner */}
          <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 mb-6">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">
                {products.length} product{products.length > 1 ? "s" : ""}
              </span>{" "}
              {products.length > 1 ? "are" : "is"} running low on stock. Restock
              soon to avoid interruptions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium dark:text-white">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stock === 0
                            ? "text-red-600 font-bold"
                            : "text-yellow-600 font-semibold"
                        }
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {product.lowStockThreshold}
                    </TableCell>
                    <TableCell>
                      {product.stock === 0 ? (
                        <Badge variant="destructive">Out of Stock</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Low Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      ₱{product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                          Update Stock
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
