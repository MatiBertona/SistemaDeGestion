import { apiClient } from './apiClient';
import type { 
  Product, 
  Category, 
  StockMovement, 
  CreateProductDTO, 
  UpdateProductDTO, 
  CreateMovementDTO,
  CreateCategoryDTO
} from '../types/stock.types';

/**
 * Interfaces que representan la respuesta exacta del Backend (FastAPI)
 * Esto nos permite mantener el tipado estricto sin usar 'any'.
 */
interface BackendCategory {
  id: number;
  nombre: string;
}

interface BackendProduct {
  id: number;
  nombre: string;
  sku: string;
  precio_unitario: number;
  stock_actual: number;
  min_stock: number;
  max_stock: number;
  categoria?: BackendCategory;
}

interface BackendMovement {
  id: number;
  producto_id: number;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  fecha: string;
  motivo?: string;
  usuario?: string;
}

// Mappers para desacoplar el contrato del API del dominio del Frontend
const mapBackendProduct = (p: BackendProduct): Product => ({
  id: String(p.id),
  name: p.nombre,
  sku: p.sku || `PROD-${p.id}`,
  category_id: p.categoria ? String(p.categoria.id) : '',
  category_name: p.categoria ? p.categoria.nombre : 'Sin Categoría',
  price: p.precio_unitario,
  stock_actual: p.stock_actual,
  min_stock: p.min_stock || 0,
  max_stock: p.max_stock || 100,
});

export const stockService = {
  // Productos
  getProducts: async (category?: string): Promise<Product[]> => {
    const params = category && category !== 'Todos' ? { categoria: category } : {};
    const { data } = await apiClient.get<BackendProduct[]>('/productos', { params });
    return data.map(mapBackendProduct);
  },

  getProductById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<BackendProduct>(`/productos/${id}`);
    return mapBackendProduct(data);
  },

  createProduct: async (product: CreateProductDTO): Promise<Product> => {
    const backendPayload = {
      nombre: product.name,
      sku: product.sku,
      precio_unitario: product.price,
      min_stock: product.min_stock,
      max_stock: product.max_stock,
      categoria_id: parseInt(product.category_id)
    };
    const { data } = await apiClient.post<BackendProduct>('/productos', backendPayload);
    return mapBackendProduct(data);
  },

  updateProduct: async (id: string, product: UpdateProductDTO): Promise<Product> => {
    const { data } = await apiClient.patch<BackendProduct>(`/productos/${id}`, product);
    return mapBackendProduct(data);
  },

  // Categorías
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<BackendCategory[]>('/categorias');
    return data.map((c) => ({
      id: String(c.id),
      name: c.nombre,
    }));
  },

  createCategory: async (category: CreateCategoryDTO): Promise<Category> => {
    const { data } = await apiClient.post<BackendCategory>('/categorias', {
      nombre: category.name,
    });
    return {
      id: String(data.id),
      name: data.nombre,
    };
  },

  // Movimientos
  registerMovement: async (movement: CreateMovementDTO): Promise<StockMovement> => {
    const { data } = await apiClient.post<BackendMovement>('/productos/movimientos', movement);
    return {
      id: String(data.id),
      product_id: String(data.producto_id),
      type: data.tipo,
      amount: data.cantidad,
      reason: data.motivo || '',
      date: data.fecha,
      user: data.usuario
    };
  },

  getMovementsByProduct: async (productId: string): Promise<StockMovement[]> => {
    const { data } = await apiClient.get<BackendMovement[]>(`/productos/${productId}/movimientos`);
    return data.map(m => ({
      id: String(m.id),
      product_id: String(m.producto_id),
      type: m.tipo,
      amount: m.cantidad,
      reason: m.motivo || '',
      date: m.fecha,
      user: m.usuario
    }));
  }
};
