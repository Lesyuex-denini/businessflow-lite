// src/components/dashboard/metric-card.tsx
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
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
        "bg-white rounded-xl border p-6 flex items-start justify-between",
        highlight === "warning" && "border-yellow-300 bg-yellow-50",
        highlight === "danger" && "border-red-300 bg-red-50",
        highlight === "default" && "border-gray-200",
      )}
    >
      <div>
        <p
          className={cn(
            "text-sm font-medium",
            highlight === "warning" && "text-yellow-700",
            highlight === "danger" && "text-red-700",
            highlight === "default" && "text-gray-500",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-3xl font-bold mt-1",
            highlight === "warning" && "text-yellow-900",
            highlight === "danger" && "text-red-900",
            highlight === "default" && "text-gray-900",
          )}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div
        className={cn(
          "p-3 rounded-lg",
          highlight === "warning" && "bg-yellow-100",
          highlight === "danger" && "bg-red-100",
          highlight === "default" && "bg-gray-100",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            highlight === "warning" && "text-yellow-600",
            highlight === "danger" && "text-red-600",
            highlight === "default" && "text-gray-600",
          )}
        />
      </div>
    </div>
  );
}
