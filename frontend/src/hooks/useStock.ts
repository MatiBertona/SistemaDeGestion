import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockService } from '../services/stock.service';
import type { CreateMovementDTO, CreateProductDTO } from '../types/stock.types';

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ['products', category],
    queryFn: () => stockService.getProducts(category),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: stockService.getCategories,
  });
};

export const useStockMutations = () => {
  const queryClient = useQueryClient();

  const registerMovement = useMutation({
    mutationFn: (movement: CreateMovementDTO) => stockService.registerMovement(movement),
    onSuccess: (_, variables) => {
      // Invalidar caché de productos para refrescar el stock actual
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // También invalidar el producto específico y sus movimientos
      queryClient.invalidateQueries({ queryKey: ['products', variables.product_id] });
      queryClient.invalidateQueries({ queryKey: ['movements', variables.product_id] });
    },
  });

  const createProduct = useMutation({
    mutationFn: (product: CreateProductDTO) => stockService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    registerMovement,
    createProduct,
  };
};

export const useProductMovements = (productId: string) => {
  return useQuery({
    queryKey: ['movements', productId],
    queryFn: () => stockService.getMovementsByProduct(productId),
    enabled: !!productId,
  });
};
