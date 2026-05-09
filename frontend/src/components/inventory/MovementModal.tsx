import type { FC } from 'react';
import { useState, useMemo } from 'react';
import type { Product, StockMovement } from '../../types/inventory';
import styles from './MovementModal.module.scss';

interface Props {
  product: Product;
  onClose: () => void;
  onSubmit: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
}

export const MovementModal: FC<Props> = ({ product, onClose, onSubmit }) => {
  const [type, setType] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState('');

  const numAmount = parseInt(amount) || 0;
  
  // Lógica de Validación (Regla de negocio: stock no negativo)
  const resultingStock = useMemo(() => {
    if (type === 'ENTRADA') return product.stock_actual + numAmount;
    return product.stock_actual - numAmount;
  }, [type, numAmount, product.stock_actual]);

  const isInvalidAmount = numAmount <= 0;
  const isNegativeStock = resultingStock < 0;
  const isValid = !isInvalidAmount && !isNegativeStock && reason.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    onSubmit({
      product_id: product.id,
      type,
      amount: numAmount,
      reason: reason.trim()
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <header className={styles.modalHeader}>
            <h3>Registrar Movimiento</h3>
            <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Cerrar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </header>

          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label>Producto Seleccionado</label>
              <input 
                type="text" 
                className={`${styles.inputField} ${styles.disabled}`} 
                value={`${product.name} (Stock: ${product.stock_actual})`} 
                disabled 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tipo de Operación</label>
              <div className={styles.segmentedControl}>
                <button 
                  type="button" 
                  className={type === 'ENTRADA' ? styles.active : ''} 
                  onClick={() => setType('ENTRADA')}
                >
                  Entrada
                </button>
                <button 
                  type="button" 
                  className={type === 'SALIDA' ? styles.active : ''} 
                  onClick={() => setType('SALIDA')}
                >
                  Salida
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Cantidad</label>
              <input 
                type="number" 
                className={`${styles.inputField} ${isNegativeStock ? styles.error : ''}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="1"
              />
              <div className={styles.validationHint}>
                {isNegativeStock ? (
                  <span className={styles.errorText}>Supera el stock actual</span>
                ) : (
                  <span></span>
                )}
                {numAmount > 0 && !isNegativeStock && (
                  <span className={styles.resultText}>Stock Resultante: {resultingStock}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Motivo / Observaciones</label>
              <textarea 
                className={styles.inputField}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: Compra a proveedor, Ajuste de inventario..."
              />
            </div>
          </div>

          <footer className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={!isValid}>
              Confirmar
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
