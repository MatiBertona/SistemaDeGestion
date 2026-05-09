import React from 'react';
import type { Product } from '../../types/stock.types';
import styles from '../../styles/components/inventory/ComparativeStockChart.module.scss';

interface Props {
  products: Product[];
}

export const ComparativeStockChart: React.FC<Props> = ({ products }) => {
  const chartData = products.slice(0, 10);
  
  // Find global max to scale bars
  const globalMax = Math.max(...chartData.map(p => p.max_stock), 1);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>Comparativa de Stock vs Máximo</h3>
      <div className={styles.barsWrapper}>
        {chartData.map(p => {
          const maxPercent = (p.max_stock / globalMax) * 100;
          const actualPercent = (p.stock_actual / p.max_stock) * 100;

          return (
            <div key={p.id} className={styles.barGroup}>
              <div 
                className={styles.maxBar} 
                style={{ height: `${maxPercent}%` }}
                title={`Máximo: ${p.max_stock}`}
              >
                <div 
                  className={styles.actualBar} 
                  style={{ height: `${actualPercent}%` }}
                  title={`Actual: ${p.stock_actual}`}
                />
              </div>
              <span className={styles.label}>{p.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
