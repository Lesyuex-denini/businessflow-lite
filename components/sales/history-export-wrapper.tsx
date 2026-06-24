// src/components/sales/history-export-wrapper.tsx
import { getAllSalesForExport } from "@/lib/actions/sale.actions";
import { ExportCSVButton } from "@/components/sales/export-csv-button";

export async function HistoryExportWrapper() {
  const sales = await getAllSalesForExport();
  return <ExportCSVButton sales={sales} />;
}
