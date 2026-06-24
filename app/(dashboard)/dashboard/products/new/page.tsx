// src/app/(dashboard)/dashboard/products/new/page.tsx
import { ProductForm } from "@/components/products/product-form";
import { createProduct } from "@/lib/actions/product.actions";

export default function NewProductPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Add Product</h2>
      <p className="text-gray-500 mb-6">Add a new product to your inventory</p>
      <ProductForm action={createProduct} title="Product Details" />
    </div>
  );
}
