export type MovementType = 'ENTRADA' | 'SALIDA';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_id: string;
  category_name: string;
  price: number;
  stock_actual: number;
  min_stock: number;
  max_stock: number;
}

export interface StockMovement {
  id: string;
  product_id: string;
  type: MovementType;
  amount: number;
  reason: string;
  date: string; // ISO 8601
  user?: string;
}

// DTOs (Data Transfer Objects)
export interface CreateProductDTO {
  name: string;
  sku: string;
  category_id: string;
  price: number;
  min_stock: number;
  max_stock: number;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface CreateMovementDTO {
  product_id: string;
  type: MovementType;
  amount: number;
  reason: string;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}
