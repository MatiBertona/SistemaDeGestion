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

export const stockService = {
  // Productos
  getProducts: async (category?: string): Promise<Product[]> => {
    const params = category && category !== 'Todos' ? { categoria: category } : {};
    const { data } = await apiClient.get<Product[]>('/productos', { params });
    return data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/productos/${id}`);
    return data;
  },

  createProduct: async (product: CreateProductDTO): Promise<Product> => {
    const { data } = await apiClient.post<Product>('/productos', product);
    return data;
  },

  updateProduct: async (id: string, product: UpdateProductDTO): Promise<Product> => {
    const { data } = await apiClient.patch<Product>(`/productos/${id}`, product);
    return data;
  },

  // Categorías
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categorias');
    return data;
  },

  createCategory: async (category: CreateCategoryDTO): Promise<Category> => {
    const { data } = await apiClient.post<Category>('/categorias', category);
    return data;
  },

  // Movimientos
  registerMovement: async (movement: CreateMovementDTO): Promise<StockMovement> => {
    const { data } = await apiClient.post<StockMovement>('/movimientos', movement);
    return data;
  },

  getMovementsByProduct: async (productId: string): Promise<StockMovement[]> => {
    const { data } = await apiClient.get<StockMovement[]>(`/productos/${productId}/movimientos`);
    return data;
  }
};
