// src/components/dashboard/revenue-chart.tsx
"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 shadow-lg">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900 dark:text-white">
        ₱
        {payload[0].value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

function formatYAxis(value: number): string {
  if (value >= 1000000) return `₱${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₱${(value / 1000).toFixed(0)}K`;
  return `₱${value}`;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tickColor = !mounted
    ? "#6b7280"
    : resolvedTheme === "dark"
      ? "#9ca3af"
      : "#6b7280";

  const gridColor = !mounted
    ? "#e5e7eb"
    : resolvedTheme === "dark"
      ? "#374151"
      : "#e5e7eb";

  const hasData = data.some((d) => d.revenue > 0);
  const tickInterval = Math.floor(data.length / 6);

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No revenue data yet.
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600">
          Record some sales to see your chart.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.6}
            />
            <stop
              offset="60%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.2}
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={gridColor}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: tickColor }}
          tickLine={false}
          axisLine={false}
          interval={tickInterval}
          dy={8}
        />
        <YAxis
          tick={{ fontSize: 11, fill: tickColor }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatYAxis}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{
            r: 6,
            strokeWidth: 2,
            stroke: "#fff",
            fill: "hsl(var(--primary))",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
