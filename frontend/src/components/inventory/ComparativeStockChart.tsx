import React, { useMemo } from 'react';
import type { Product } from '../../types/stock.types';
import styles from '../../styles/components/inventory/ComparativeStockChart.module.scss';

interface Props {
  products: Product[];
}

export const ComparativeStockChart: React.FC<Props> = ({ products }) => {
  // Solo comparamos los productos con mayor criticidad (proximidad al mínimo)
  const chartData = useMemo(() => {
    return [...products]
      .sort((a, b) => (a.stock_actual / a.max_stock) - (b.stock_actual / b.max_stock))
      .slice(0, 5);
  }, [products]);

  // Cálculo Analítico: Ocupación Global de Capacidad
  const globalStats = useMemo(() => {
    if (products.length === 0) return { percent: 0, total: 0, cap: 0 };
    const totalStock = products.reduce((acc, p) => acc + p.stock_actual, 0);
    const totalCap = products.reduce((acc, p) => acc + p.max_stock, 0);
    return {
      percent: Math.round((totalStock / totalCap) * 100),
      total: totalStock,
      cap: totalCap
    };
  }, [products]);

  return (
    <div className={styles.chartContainer}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h3>Capacidad Operativa</h3>
          <span className={styles.subtitle}>Análisis de Ocupación por SKU</span>
        </div>
        <div className={styles.globalMetric}>
          <span className={styles.value}>{globalStats.percent}%</span>
          <span className={styles.label}>Ocupación Total</span>
        </div>
      </header>
      
      <div className={styles.chartGrid}>
        {chartData.map(p => {
          const actualPercent = Math.min((p.stock_actual / p.max_stock) * 100, 100);
          const minPercent = (p.min_stock / p.max_stock) * 100;
          
          let statusClass = styles.fillNormal;
          if (p.stock_actual === 0) statusClass = styles.fillCritical;
          else if (p.stock_actual <= p.min_stock) statusClass = styles.fillWarning;

          return (
            <div key={p.id} className={styles.barWrapper}>
              <div className={styles.barHeader}>
                <div className={styles.productInfo}>
                  <span className={styles.name}>{p.name}</span>
                  <span className={styles.sku}>{p.sku}</span>
                </div>
                <div className={styles.metrics}>
                  <span className={styles.actual}>{p.stock_actual}</span>
                  <span className={styles.separator}>/</span>
                  <span className={styles.total}>{p.max_stock}</span>
                </div>
              </div>
              <div className={styles.track}>
                <div 
                  className={`${styles.fill} ${statusClass}`} 
                  style={{ width: `${actualPercent}%` }} 
                />
                <div 
                  className={styles.thresholdMarker} 
                  style={{ left: `${minPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <footer className={styles.footer}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.dotNormal}`} />
            <span>Saludable</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.dotWarning}`} />
            <span>Alerta</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.dotCritical}`} />
            <span>Crítico</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
