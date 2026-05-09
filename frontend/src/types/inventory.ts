export type StockStatus = 'CRITICAL' | 'LOW' | 'HEALTHY';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_name: string;
  price: number;
  stock_actual: number;
  min_stock: number;
  max_stock: number;
}

export interface StockMovement {
  product_id: string;
  type: 'ENTRADA' | 'SALIDA';
  amount: number;
  reason: string;
}
