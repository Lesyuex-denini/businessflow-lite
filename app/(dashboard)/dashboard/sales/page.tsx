// src/app/(dashboard)/dashboard/sales/page.tsx
import { getProductsForSale } from "@/lib/actions/product.actions";
import { SaleForm } from "@/components/sales/sale-form";

export default async function SalesPage() {
  const products = await getProductsForSale();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          New Sale
        </h2>

        <p className="text-gray-500 dark:text-gray-400">
          Record a new sale transaction
        </p>
      </div>
      <SaleForm products={products} />
    </div>
  );
}
