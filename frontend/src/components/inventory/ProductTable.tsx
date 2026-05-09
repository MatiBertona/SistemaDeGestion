import React, { useMemo } from 'react';
import type { Product } from '../../types/inventory';
import styles from './ProductTable.module.scss';

interface Props {
  products: Product[];
  onSelect: (p: Product) => void;
}

export const ProductTable: React.FC<Props> = ({ products, onSelect }) => {
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const getPriority = (p: Product) => {
        if (p.stock_actual === 0) return 0;
        if (p.stock_actual <= p.min_stock) return 1;
        return 2;
      };
      return getPriority(a) - getPriority(b);
    });
  }, [products]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Producto / SKU</th>
          <th>Categoría</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        {sortedProducts.map(p => (
          <tr 
            key={p.id} 
            onClick={() => onSelect(p)}
            className={p.stock_actual === 0 ? styles.critical : p.stock_actual <= p.min_stock ? styles.low : ''}
          >
            <td>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.sku}>{p.sku}</div>
            </td>
            <td><span className={styles.categoryBadge}>{p.category_name}</span></td>
            <td><strong>{p.stock_actual}</strong></td>
            <td>
              {p.stock_actual === 0 ? (
                <span className={styles.statusBadgeCritical}>SIN STOCK</span>
              ) : p.stock_actual <= p.min_stock ? (
                <span className={styles.statusBadgeLow}>STOCK BAJO</span>
              ) : (
                <span className={styles.statusHealthy}>● Saludable</span>
              )}
            </td>
            <td>${p.price.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
