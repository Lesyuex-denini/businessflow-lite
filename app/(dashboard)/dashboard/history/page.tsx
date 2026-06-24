// src/app/(dashboard)/dashboard/history/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistorySkeleton } from "@/components/skeletons/history-skeleton";
import { HistoryTable } from "@/components/sales/history-table";
import { HistoryExportWrapper } from "@/components/sales/history-export-wrapper";

interface HistoryPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page ?? "1");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transaction History
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            All your recorded sales and revenue
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Suspense
            fallback={
              <Button variant="outline" disabled>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            }
          >
            <HistoryExportWrapper />
          </Suspense>
          <Button asChild>
            <Link href="/dashboard/sales">
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Sale
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<HistorySkeleton />} key={currentPage}>
        <HistoryTable page={currentPage} />
      </Suspense>
    </div>
  );
}
