// src/app/(dashboard)/dashboard/products/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";
import { getProductById, updateProduct } from "@/lib/actions/product.actions";
import { ProductFormState } from "@/lib/actions/product.actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const action = async (
    prevState: ProductFormState,
    formData: FormData,
  ): Promise<ProductFormState> => {
    "use server";
    return updateProduct(id, prevState, formData);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Edit Product</h2>
      <p className="text-gray-500 mb-6">Update your product details</p>
      <ProductForm action={action} product={product} title="Edit Product" />
    </div>
  );
}
