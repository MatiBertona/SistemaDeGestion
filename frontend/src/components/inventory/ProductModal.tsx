import type { FC } from 'react';
import { useState } from 'react';
import type { Category, CreateProductDTO } from '../../types/stock.types';
import styles from '../../styles/components/inventory/MovementModal.module.scss'; // Reusing modal styles

interface Props {
  categories: Category[];
  onClose: () => void;
  onSubmit: (product: CreateProductDTO) => void;
}

export const ProductModal: FC<Props> = ({ categories, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateProductDTO>({
    name: '',
    sku: '',
    category_id: categories[0]?.id || '',
    price: 0,
    min_stock: 10,
    max_stock: 100
  });

  const isValid = formData.name.trim() !== '' && 
                  formData.sku.trim() !== '' && 
                  formData.category_id !== '' && 
                  formData.price > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(formData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <header className={styles.modalHeader}>
            <h3>Nuevo Producto</h3>
            <button type="button" onClick={onClose} className={styles.closeBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </header>

          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label>Nombre del Producto</label>
              <input 
                type="text" 
                className={styles.inputField}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ej: Laptop Pro 15"
              />
            </div>

            <div className={styles.formGroup}>
              <label>SKU (Código único)</label>
              <input 
                type="text" 
                className={styles.inputField}
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
                placeholder="PROD-001"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoría</label>
              <select 
                className={styles.inputField}
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Precio Unitario ($)</label>
              <input 
                type="number" 
                className={styles.inputField}
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label>Stock Mínimo</label>
                <input 
                  type="number" 
                  className={styles.inputField}
                  value={formData.min_stock}
                  onChange={e => setFormData({...formData, min_stock: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Stock Máximo</label>
                <input 
                  type="number" 
                  className={styles.inputField}
                  value={formData.max_stock}
                  onChange={e => setFormData({...formData, max_stock: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
            </div>
          </div>

          <footer className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={!isValid}>
              Crear Producto
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
