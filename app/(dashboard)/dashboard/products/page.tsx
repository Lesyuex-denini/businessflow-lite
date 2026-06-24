// src/app/(dashboard)/dashboard/products/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsSkeleton } from "@/components/skeletons/products-skeleton";
import { ProductsTable } from "@/components/products/products-table";
import { ProductSearch } from "@/components/products/product-search";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { search, status } = await searchParams;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your product inventory
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductSearch />

      <Suspense fallback={<ProductsSkeleton />} key={`${search}-${status}`}>
        <ProductsTable search={search} status={status} />
      </Suspense>
    </div>
  );
}
