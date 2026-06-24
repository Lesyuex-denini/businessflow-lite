// src/app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { RevenueChartWrapper } from "@/components/dashboard/revenue-chart-wrapper";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Metrics */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>

      {/* Revenue Chart */}
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChartWrapper />
      </Suspense>
    </div>
  );
}
