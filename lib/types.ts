// src/lib/types.ts
export interface ProductType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface SaleItemType {
  id: string;
  quantity: number;
  unitPrice: number;
  saleId: string;
  productId: string;
  product: ProductType;
}

export interface SaleType {
  id: string;
  total: number;
  createdAt: Date;
  userId: string;
  items: SaleItemType[];
}
