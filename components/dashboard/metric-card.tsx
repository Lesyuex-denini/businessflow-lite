// src/components/dashboard/metric-card.tsx
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  highlight?: "default" | "warning" | "danger";
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  sub,
  highlight = "default",
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 rounded-xl border p-6 flex items-start justify-between",
        highlight === "warning" &&
          "border-yellow-300 bg-yellow-50 dark:bg-yellow-950",
        highlight === "danger" && "border-red-300 bg-red-50 dark:bg-red-950",
        highlight === "default" && "border-gray-200 dark:border-gray-800",
      )}
    >
      <div>
        <p
          className={cn(
            "text-sm font-medium",
            highlight === "warning" && "text-yellow-700 dark:text-yellow-400",
            highlight === "danger" && "text-red-700 dark:text-red-400",
            highlight === "default" && "text-gray-500 dark:text-gray-400",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-3xl font-bold mt-1",
            highlight === "warning" && "text-yellow-900 dark:text-yellow-100",
            highlight === "danger" && "text-red-900 dark:text-red-100",
            highlight === "default" && "text-gray-900 dark:text-white",
          )}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
        )}
      </div>
      <div
        className={cn(
          "p-3 rounded-lg",
          highlight === "warning" && "bg-yellow-100 dark:bg-yellow-900",
          highlight === "danger" && "bg-red-100 dark:bg-red-900",
          highlight === "default" && "bg-gray-100 dark:bg-gray-800",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            highlight === "warning" && "text-yellow-600 dark:text-yellow-400",
            highlight === "danger" && "text-red-600 dark:text-red-400",
            highlight === "default" && "text-gray-600 dark:text-gray-400",
          )}
        />
      </div>
    </div>
  );
}
