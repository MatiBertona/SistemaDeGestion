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
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map(p => {
            const isCritical = p.stock_actual === 0;
            const isLow = !isCritical && p.stock_actual <= p.min_stock;
            
            return (
              <tr 
                key={p.id} 
                onClick={() => onSelect(p)}
                className={isCritical ? styles.critical : isLow ? styles.low : ''}
              >
                <td>
                  <div className={styles.productInfo}>
                    <span className={styles.name}>{p.name}</span>
                    <span className={styles.sku}>{p.sku}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.categoryBadge}>{p.category_name}</span>
                </td>
                <td className={styles.stock}>
                  {p.stock_actual}
                </td>
                <td>
                  {isCritical ? (
                    <span className={styles.statusCritical}>Sin Stock</span>
                  ) : isLow ? (
                    <span className={styles.statusLow}>Stock Bajo</span>
                  ) : (
                    <span className={styles.statusHealthy}>Saludable</span>
                  )}
                </td>
                <td className={styles.price}>${p.price.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
