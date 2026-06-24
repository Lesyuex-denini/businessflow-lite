// src/components/dashboard/revenue-chart-wrapper.tsx
import { getRevenueChartData } from "@/lib/actions/dashboard.actions";
import { RevenueChart } from "@/components/dashboard/revenue-chart";

export async function RevenueChartWrapper() {
  const data = await getRevenueChartData();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mt-6 mb-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Revenue — Last 30 Days
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Daily revenue trend
        </p>
      </div>
      <RevenueChart data={data} />
    </div>
  );
}
