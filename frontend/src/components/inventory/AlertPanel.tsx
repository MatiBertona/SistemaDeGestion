import React from 'react';
import type { Product } from '../../types/stock.types';
import styles from '../../styles/components/inventory/AlertPanel.module.scss';

interface Props {
  products: Product[];
}

export const AlertPanel: React.FC<Props> = ({ products }) => {
  const critical = products.filter(p => p.stock_actual === 0);
  const low = products.filter(p => p.stock_actual <= p.min_stock && p.stock_actual > 0);

  return (
    <div className={styles.panelContainer}>
      <h3 className={styles.title}>Alertas de Inventario</h3>
      <div className={styles.alertList}>
        {critical.length === 0 && low.length === 0 && (
          <p className={styles.emptyMsg}>No hay alertas pendientes</p>
        )}
        
        {critical.map(p => (
          <div key={p.id} className={`${styles.alertCard} ${styles.alertCardCritical}`}>
            <div className={styles.productInfo}>
              <span className={styles.productName}>{p.name}</span>
              <span className={styles.productSku}>{p.sku}</span>
            </div>
            <div className={styles.stockInfo}>
              <span className={styles.stockValue}>STOCK: {p.stock_actual}</span>
            </div>
          </div>
        ))}

        {low.map(p => (
          <div key={p.id} className={`${styles.alertCard} ${styles.alertCardLow}`}>
            <div className={styles.productInfo}>
              <span className={styles.productName}>{p.name}</span>
              <span className={styles.productSku}>{p.sku}</span>
            </div>
            <div className={styles.stockInfo}>
              <span className={styles.stockValue}>STOCK: {p.stock_actual}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
