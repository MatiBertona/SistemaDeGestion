import React, { useMemo } from 'react';
import type { Product } from '../../types/stock.types';
import styles from '../../styles/components/inventory/AlertPanel.module.scss';

interface Props {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const AlertPanel: React.FC<Props> = ({ products, onSelectProduct }) => {
  const critical = products.filter(p => p.stock_actual === 0);
  const low = products.filter(p => p.stock_actual <= p.min_stock && p.stock_actual > 0);
  const allAlerts = [...critical, ...low];

  // Cálculo Analítico: Risk Index (0-100)
  const riskIndex = useMemo(() => {
    if (products.length === 0) return 0;
    const score = (critical.length * 2 + low.length * 1) / (products.length * 2);
    return Math.min(Math.round(score * 100), 100);
  }, [critical, low, products]);

  const getStatusColor = () => {
    if (riskIndex > 40) return 'var(--stat-danger)';
    if (riskIndex > 15) return 'var(--stat-warning)';
    return 'var(--stat-success)';
  };

  return (
    <div className={styles.panelContainer}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h3>Notificaciones Críticas</h3>
          <div className={styles.riskBadge} style={{ '--risk-color': getStatusColor() } as any}>
            Riesgo: {riskIndex}%
          </div>
        </div>
        {allAlerts.length > 0 && (
          <span className={styles.badgeCount}>{allAlerts.length}</span>
        )}
      </header>
      
      <div className={styles.alertList}>
        {allAlerts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <p>Operación Estable</p>
            <span>No se detectaron quiebres de stock.</span>
          </div>
        ) : (
          allAlerts.map(p => {
            const isCritical = p.stock_actual === 0;
            return (
              <div 
                key={p.id} 
                className={styles.alertItem} 
                onClick={() => onSelectProduct(p)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.itemMain}>
                  <div className={`${styles.dot} ${isCritical ? styles.dotCritical : styles.dotLow}`} />
                  <div className={styles.itemInfo}>
                    <span className={styles.name}>{p.name}</span>
                    <span className={styles.sku}>{p.sku}</span>
                  </div>
                </div>
                <div className={`${styles.stockBadge} ${isCritical ? styles.stockCritical : styles.stockLow}`}>
                   {p.stock_actual}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {allAlerts.length > 0 && (
        <footer className={styles.footer}>
          <span>Requiere atención inmediata en {allAlerts.length} productos</span>
        </footer>
      )}
    </div>
  );
};
