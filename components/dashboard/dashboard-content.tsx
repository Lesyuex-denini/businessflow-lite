// src/components/dashboard/dashboard-content.tsx
import Link from "next/link";
import { Package, ShoppingCart, AlertTriangle, ArrowRight } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardMetrics } from "@/lib/actions/dashboard.actions";

export async function DashboardContent() {
  const metrics = await getDashboardMetrics();

  return (
    <>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Total Products"
          value={metrics.totalProducts}
          icon={Package}
          sub="in your inventory"
        />
        <MetricCard
          label="Total Sales"
          value={metrics.totalSales}
          icon={ShoppingCart}
          sub="transactions recorded"
        />
        <MetricCard
          label="Total Revenue"
          value={`₱${metrics.revenue.toFixed(2)}`}
          icon={() => (
            <span className="text-base font-bold leading-none">₱</span>
          )}
          sub="all time"
        />
        <MetricCard
          label="Low Stock Alerts"
          value={metrics.lowStockCount}
          icon={AlertTriangle}
          highlight={
            metrics.lowStockCount === 0
              ? "default"
              : metrics.lowStockCount <= 3
                ? "warning"
                : "danger"
          }
          sub={
            metrics.lowStockCount === 0
              ? "all products stocked"
              : "products need attention"
          }
        />
      </div>

      {/* Low Stock Preview */}
      {metrics.lowStockProducts.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-yellow-200 dark:border-yellow-900 overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-100 dark:border-yellow-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Low Stock Products
              </h3>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/low-stock">
                View all
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {metrics.lowStockProducts
              .slice(0, 5)
              .map(
                (product: {
                  id: string;
                  name: string;
                  stock: number;
                  lowStockThreshold: number;
                  price: number;
                  description: string | null;
                  createdAt: Date;
                  updatedAt: Date;
                  userId: string;
                }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Threshold: {product.lowStockThreshold} units
                      </p>
                    </div>
                    <Badge
                      variant={
                        product.stock === 0 ? "destructive" : "secondary"
                      }
                      className={
                        product.stock > 0 &&
                        product.stock <= product.lowStockThreshold
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : ""
                      }
                    >
                      {product.stock === 0
                        ? "Out of stock"
                        : `${product.stock} left`}
                    </Badge>
                  </div>
                ),
              )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/products/new"
          className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4 hover:border-primary hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary/10">
              <Package className="h-4 w-4 text-gray-600 group-hover:text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Add Product
              </p>

              <p className="text-xs text-gray-400">Add to your inventory</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
        </Link>

        <Link
          href="/dashboard/sales"
          className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4 hover:border-primary hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary/10">
              <ShoppingCart className="h-4 w-4 text-gray-600 group-hover:text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Record Sale
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                Log a new transaction
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
        </Link>
      </div>
    </>
  );
}
