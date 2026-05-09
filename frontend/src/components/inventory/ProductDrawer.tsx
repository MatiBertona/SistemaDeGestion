import React from 'react';
import type { Product } from '../../types/inventory';
import { StockChart } from './StockChart';
import styles from './ProductDrawer.module.scss';

interface Props {
  product: Product | null;
  onClose: () => void;
  onMovement: () => void;
}

export const ProductDrawer: React.FC<Props> = ({ product, onClose, onMovement }) => {
  if (!product) return null;

  const isLow = product.stock_actual <= product.min_stock;

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <header>
          <h3>Detalles del Producto</h3>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </header>

        {product.stock_actual === 0 && (
          <div className={styles.alertCritical}>
            <strong>⚠️ ¡Sin Stock disponible!</strong>
            <p>Reposición inmediata requerida para este producto.</p>
          </div>
        )}

        <section className={styles.statsSection}>
          <div className={styles.stat}>
            <span className={styles.label}>Stock Actual</span>
            <span className={isLow ? styles.valueLow : styles.valueHealthy}>{product.stock_actual}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Precio</span>
            <span className={styles.value}>${product.price.toFixed(2)}</span>
          </div>
        </section>

        <section className={styles.chartSection}>
          <h4>Niveles de Stock vs Umbral</h4>
          <StockChart 
            actual={product.stock_actual} 
            min={product.min_stock} 
            max={product.max_stock} 
          />
        </section>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={onMovement}>+ Registrar Movimiento</button>
          <button className={styles.secondary} onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};
