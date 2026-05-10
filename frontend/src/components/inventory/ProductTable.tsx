import React, { useMemo, useState } from 'react';
import type { Product } from '../../types/stock.types';
import styles from '../../styles/components/inventory/ProductTable.module.scss';

interface Props {
  products: Product[];
  onSelect: (p: Product) => void;
  onQuickMovement: (p: Product) => void;
}

export const ProductTable: React.FC<Props> = ({ products, onSelect, onQuickMovement }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className={styles.tableContainer} onClick={() => setActiveDropdown(null)}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Precio</th>
            <th className={styles.actions}>Opciones</th>
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
              >
                <td>
                  <div className={styles.productRow}>
                    <span className={styles.name}>{p.name}</span>
                    <span className={styles.sku}>{p.sku}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.category}>{p.category_name}</span>
                </td>
                <td>
                  <div className={styles.stockColumn}>
                    <div className={styles.stockInfo}>
                      <span className={styles.value}>{p.stock_actual}</span>
                      <span className={styles.total}>Cap: {p.max_stock}</span>
                    </div>
                    <div className={styles.capacityTrack}>
                      <div 
                        className={`${styles.capacityFill} ${
                          p.stock_actual === 0 ? styles.fillCritical : 
                          p.stock_actual <= p.min_stock ? styles.fillWarning : 
                          styles.fillHealthy
                        }`}
                        style={{ width: `${Math.min((p.stock_actual / p.max_stock) * 100, 100)}%` }}
                      />
                      <div 
                        className={styles.thresholdMarker}
                        style={{ left: `${(p.min_stock / p.max_stock) * 100}%` }}
                      />
                    </div>
                  </div>
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
                <td className={styles.actions}>
                  <div className={styles.dropdownContainer}>
                    <button 
                      className={styles.optionsBtn}
                      onClick={(e) => toggleDropdown(e, p.id)}
                    >
                      <svg width="16" height="4" viewBox="0 0 16 4" fill="currentColor">
                        <circle cx="2" cy="2" r="2" />
                        <circle cx="8" cy="2" r="2" />
                        <circle cx="14" cy="2" r="2" />
                      </svg>
                    </button>
                    
                    {activeDropdown === p.id && (
                      <div className={styles.dropdownMenu}>
                        <button 
                          className={styles.dropdownItem}
                          onClick={(e) => { e.stopPropagation(); onQuickMovement(p); setActiveDropdown(null); }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="10" y1="14" x2="21" y2="3"></line><polyline points="7 21 2 21 2 16"></polyline><line x1="14" y1="10" x2="2" y2="21"></line></svg>
                          Movimiento
                        </button>
                        <button 
                          className={styles.dropdownItem}
                          onClick={(e) => { e.stopPropagation(); onSelect(p); setActiveDropdown(null); }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          Ver Detalles
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
