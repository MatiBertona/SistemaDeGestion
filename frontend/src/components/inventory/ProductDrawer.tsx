import type { FC } from 'react';
import type { Product } from '../../types/stock.types';
import { StockChart } from './StockChart';
import { useProductMovements } from '../../hooks/useStock';
import styles from '../../styles/components/inventory/ProductDrawer.module.scss';

interface Props {
  product: Product | null;
  onClose: () => void;
  onMovement: () => void;
}

export const ProductDrawer: FC<Props> = ({ product, onClose, onMovement }) => {
  const { data: movements = [], isLoading: isLoadingMovements } = useProductMovements(product?.id || '');

  if (!product) return null;

  const isCritical = product.stock_actual === 0;
  const isLow = !isCritical && product.stock_actual <= product.min_stock;

  const getBadgeClass = () => {
    if (isCritical) return styles.badgeCritical;
    if (isLow) return styles.badgeLow;
    return styles.badgeHealthy;
  };

  const getStatusText = () => {
    if (isCritical) return 'Sin Existencias';
    if (isLow) return 'Stock Bajo';
    return 'Stock Saludable';
  };

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <h3>{product.name}</h3>
            <p className={styles.sku}>{product.sku}</p>
          </div>
          <button onClick={onClose} className={styles.closeCircle} aria-label="Cerrar">
            <svg width="12" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <div className={styles.content}>
          <div className={styles.statusSection}>
            <span className={getBadgeClass()}>{getStatusText()}</span>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.label}>Stock</span>
              <span className={styles.value}>{product.stock_actual}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.label}>Precio</span>
              <span className={styles.value}>${product.price.toLocaleString()}</span>
            </div>
          </div>

          <section className={styles.section}>
            <h4>Nivel de Inventario</h4>
            <StockChart 
              actual={product.stock_actual} 
              min={product.min_stock} 
              max={product.max_stock} 
            />
          </section>

          <section className={styles.section}>
            <h4>Detalles</h4>
            <div className={styles.settingsList}>
              <div className={styles.item}>
                <span className={styles.itemLabel}>Categoría</span>
                <span className={styles.itemValue}>{product.category_name}</span>
              </div>
              <div className={styles.item}>
                <span className={styles.itemLabel}>Umbral Mínimo</span>
                <span className={styles.itemValue}>{product.min_stock} un.</span>
              </div>
              <div className={styles.item}>
                <span className={styles.itemLabel}>Capacidad Máx</span>
                <span className={styles.itemValue}>{product.max_stock} un.</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4>Historial</h4>
              <span className={styles.badgeHealthy} style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{movements.length}</span>
            </div>
            
            <div className={styles.movementList} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
              {isLoadingMovements ? (
                <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>Cargando historial...</p>
              ) : movements.length > 0 ? (
                movements.map(m => (
                  <div key={m.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase',
                        color: m.type === 'ENTRADA' ? 'var(--stat-success)' : 'var(--stat-danger)'
                      }}>
                        {m.type === 'ENTRADA' ? 'Entrada' : 'Salida'}
                      </span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                        {new Date(m.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{m.type === 'ENTRADA' ? '+' : '-'}{m.amount} un.</span>
                      <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0, textAlign: 'right', maxWidth: '60%' }}>{m.reason}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>Sin movimientos</p>
              )}
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <button className={styles.btnBlue} onClick={() => onMovement()}>
            Registrar Movimiento
          </button>
          <button className={styles.btnGhost} onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
};
