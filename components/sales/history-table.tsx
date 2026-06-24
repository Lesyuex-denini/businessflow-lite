// src/components/sales/history-table.tsx
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
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
import { getPaginatedSales, getSalesTotals } from "@/lib/actions/sale.actions";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface HistoryTableProps {
  page?: number;
}

export async function HistoryTable({ page = 1 }: HistoryTableProps) {
  const [{ sales, totalPages, currentPage }, { totalRevenue, totalUnits }] =
    await Promise.all([getPaginatedSales(page), getSalesTotals()]);

  if (sales.length === 0 && page === 1) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No sales recorded yet.
        </p>
        <Button asChild>
          <Link href="/dashboard/sales">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Record your first sale
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Summary Bar — always shows all-time totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Transactions
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalPages * 10 - (10 - sales.length) + (currentPage - 1) * 10}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Revenue
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₱{totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Items Sold</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalUnits}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Items Sold</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {new Date(sale.createdAt).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {sale.items.reduce((s, i) => s + i.quantity, 0)} units
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {sale.items.map((item) => (
                      <span
                        key={item.id}
                        className="text-sm text-gray-600 dark:text-gray-300"
                      >
                        {item.product.name} ×{item.quantity}{" "}
                        <span className="text-gray-400 dark:text-gray-500">
                          @ ₱{item.unitPrice.toFixed(2)}
                        </span>
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold dark:text-white">
                  ₱{sale.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
