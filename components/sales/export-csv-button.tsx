// src/components/sales/export-csv-button.tsx
"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SaleItem {
  product: { name: string };
  quantity: number;
  unitPrice: number;
}

interface Sale {
  id: string;
  createdAt: Date;
  total: number;
  items: SaleItem[];
}

interface ExportCSVButtonProps {
  sales: Sale[];
}

export function ExportCSVButton({ sales }: ExportCSVButtonProps) {
  const [loading, setLoading] = useState(false);

  function exportToCSV() {
    if (sales.length === 0) {
      toast.error("No sales data to export.");
      return;
    }

    setLoading(true);

    try {
      // Build CSV rows
      const headers = [
        "Transaction ID",
        "Date",
        "Product",
        "Quantity",
        "Unit Price (₱)",
        "Subtotal (₱)",
        "Sale Total (₱)",
      ];

      const rows: string[][] = [];

      for (const sale of sales) {
        const date = new Date(sale.createdAt).toLocaleDateString("en-PH", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        if (sale.items.length === 0) {
          rows.push([
            sale.id,
            date,
            "—",
            "0",
            "0.00",
            "0.00",
            sale.total.toFixed(2),
          ]);
          continue;
        }

        sale.items.forEach((item, index) => {
          const subtotal = item.quantity * item.unitPrice;
          rows.push([
            index === 0 ? sale.id : "", // Only show ID on first row of sale
            index === 0 ? date : "", // Only show date on first row
            item.product.name,
            String(item.quantity),
            item.unitPrice.toFixed(2),
            subtotal.toFixed(2),
            index === 0 ? sale.total.toFixed(2) : "", // Only show total on first row
          ]);
        });
      }

      // Convert to CSV string
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row
            .map((cell) =>
              // Wrap in quotes if cell contains comma or quotes
              cell.includes(",") || cell.includes('"')
                ? `"${cell.replace(/"/g, '""')}"`
                : cell,
            )
            .join(","),
        ),
      ].join("\n");

      // Trigger download
      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `businessflow-sales-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Sales exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={exportToCSV} disabled={loading}>
      <Download className="h-4 w-4 mr-2" />
      {loading ? "Exporting..." : "Export CSV"}
    </Button>
  );
}
