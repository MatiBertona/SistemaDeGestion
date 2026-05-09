# Prioritized Inventory Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the prioritized product table, drawer-based detail view with stock charts, and movement registration modal according to the approved design.

**Architecture:** Component-based UI using React + TypeScript, following the "Option A (Prioritized)" design. State management via React hooks and custom services.

**Tech Stack:** React 19, TypeScript 6, Sass (SCSS), Lucide-react (icons).

---

### Task 1: Setup Shared Types and Styles

**Files:**
- Create: `frontend/src/types/inventory.ts`
- Modify: `frontend/src/styles/_tokens.scss`

- [ ] **Step 1: Define inventory types**

```typescript
export type StockStatus = 'CRITICAL' | 'LOW' | 'HEALTHY';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_name: string;
  price: number;
  stock_actual: number;
  min_stock: number;
  max_stock: number;
}

export interface StockMovement {
  product_id: string;
  type: 'ENTRADA' | 'SALIDA';
  amount: number;
  reason: string;
}
```

- [ ] **Step 2: Update design tokens with semantic colors**

```scss
// frontend/src/styles/_tokens.scss
$status-critical: #ef4444;
$status-low: #f59e0b;
$status-healthy: #22c55e;
$bg-critical: rgba(239, 68, 68, 0.05);
$bg-low: rgba(245, 158, 11, 0.05);
$border-soft: #e2e8f0;
$text-soft: #64748b;
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/types/inventory.ts frontend/src/styles/_tokens.scss
git commit -m "feat: setup inventory types and design tokens"
```

---

### Task 2: Create Stock Bar Chart Component

**Files:**
- Create: `frontend/src/components/inventory/StockChart.tsx`
- Create: `frontend/src/components/inventory/StockChart.module.scss`

- [ ] **Step 1: Implement the Bar Chart component**

```tsx
import React from 'react';
import styles from './StockChart.module.scss';

interface Props {
  actual: number;
  min: number;
  max: number;
}

export const StockChart: React.FC<Props> = ({ actual, min, max }) => {
  const getPercent = (val: number) => Math.min((val / max) * 100, 100);
  
  return (
    <div className={styles.chartContainer}>
      <div className={styles.barGroup}>
        <div 
          className={styles.barActual} 
          style={{ height: `${getPercent(actual)}%` }} 
        />
        <span className={styles.label}>ACTUAL ({actual})</span>
      </div>
      <div className={styles.barGroup}>
        <div 
          className={styles.barMin} 
          style={{ height: `${getPercent(min)}%` }} 
        />
        <span className={styles.label}>BAJO ({min})</span>
      </div>
      <div className={styles.barGroup}>
        <div 
          className={styles.barMax} 
          style={{ height: '100%' }} 
        />
        <span className={styles.label}>MÁX ({max})</span>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Add styles for the chart**

```scss
.chartContainer {
  height: 150px;
  display: flex;
  align-items: flex-end;
  gap: 20px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 8px;
}

.barGroup {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  justify-content: flex-end;
}

.barActual { width: 100%; background: #3b82f6; border-radius: 4px; transition: height 0.3s ease; }
.barMin { width: 100%; background: #f59e0b; border-radius: 4px; opacity: 0.8; }
.barMax { width: 100%; background: #94a3b8; border-radius: 4px; opacity: 0.5; }

.label { font-size: 10px; font-weight: 700; color: #1e293b; }
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/inventory/StockChart.*
git commit -m "feat: add StockChart component"
```

---

### Task 3: Implement Prioritized Product Table

**Files:**
- Create: `frontend/src/components/inventory/ProductTable.tsx`
- Create: `frontend/src/components/inventory/ProductTable.module.scss`

- [ ] **Step 1: Implement table with prioritization logic**

```tsx
import React, { useMemo } from 'react';
import { Product } from '../../types/inventory';
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
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Producto / SKU</th>
          <th>Categoría</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        {sortedProducts.map(p => (
          <tr 
            key={p.id} 
            onClick={() => onSelect(p)}
            className={p.stock_actual === 0 ? styles.critical : p.stock_actual <= p.min_stock ? styles.low : ''}
          >
            <td>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.sku}>{p.sku}</div>
            </td>
            <td><span className={styles.categoryBadge}>{p.category_name}</span></td>
            <td><strong>{p.stock_actual}</strong></td>
            <td>
              {p.stock_actual === 0 ? (
                <span className={styles.statusBadgeCritical}>SIN STOCK</span>
              ) : p.stock_actual <= p.min_stock ? (
                <span className={styles.statusBadgeLow}>STOCK BAJO</span>
              ) : (
                <span className={styles.statusHealthy}>● Saludable</span>
              )}
            </td>
            <td>${p.price.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/inventory/ProductTable.*
git commit -m "feat: implement prioritized ProductTable"
```

---

### Task 4: Implement Product Detail Drawer

**Files:**
- Create: `frontend/src/components/inventory/ProductDrawer.tsx`

- [ ] **Step 1: Implement the Drawer component**

```tsx
import React from 'react';
import { Product } from '../../types/inventory';
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
          <button onClick={onClose}>×</button>
        </header>

        {product.stock_actual === 0 && (
          <div className={styles.alertCritical}>
            <strong>⚠️ ¡Sin Stock disponible!</strong>
            <p>Reposición inmediata requerida.</p>
          </div>
        )}

        <section>
          <h4>Niveles de Stock vs Umbral</h4>
          <StockChart 
            actual={product.stock_actual} 
            min={product.min_stock} 
            max={product.max_stock} 
          />
        </section>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={onMovement}>+ Registrar Movimiento</button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/inventory/ProductDrawer.tsx
git commit -m "feat: add ProductDrawer component"
```

---

### Task 5: Integration in App.tsx

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Integrate components and state**

```tsx
import React, { useState } from 'react';
import { ProductTable } from './components/inventory/ProductTable';
import { ProductDrawer } from './components/inventory/ProductDrawer';
import { Product } from './types/inventory';

// Mock data for initial dev
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Laptop Pro 14"', sku: 'LP-001', category_name: 'Electrónica', price: 1200, stock_actual: 45, min_stock: 15, max_stock: 60 },
  { id: '2', name: 'Mouse Inalámbrico', sku: 'MOU-001', category_name: 'Accesorios', price: 25, stock_actual: 8, min_stock: 15, max_stock: 50 },
  { id: '3', name: 'Teclado Mecánico RGB', sku: 'TEC-092', category_name: 'Electrónica', price: 85, stock_actual: 0, min_stock: 15, max_stock: 100 },
];

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="container">
      <header>
        <h1>Gestión de Inventario</h1>
      </header>
      
      <main>
        <ProductTable 
          products={MOCK_PRODUCTS} 
          onSelect={setSelectedProduct} 
        />
      </main>

      <ProductDrawer 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        onMovement={() => console.log('Open Modal')}
      />
    </div>
  );
}

export default App;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat: integrate inventory components in App"
```
