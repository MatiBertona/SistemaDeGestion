# Inventory UI Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `AlertPanel` and `ComparativeStockChart` components and integrate them into the frontend dashboard.

**Architecture:** Functional React components using SCSS Modules for styling. Data is passed down from `App.tsx` which manages the global state via hooks.

**Tech Stack:** React, TypeScript, SCSS.

---

### Task 1: Create `AlertPanel` Component

**Files:**
- Create: `frontend/src/components/inventory/AlertPanel.tsx`
- Create: `frontend/src/styles/components/inventory/AlertPanel.module.scss`

- [ ] **Step 1: Create `AlertPanel.module.scss`**

```scss
@import "../../config/tokens.scss";

.panelContainer {
  display: flex;
  flex-direction: column;
  gap: $space-md;
  padding: $space-md;
  background: var(--sys-surface);
  border-radius: var(--rad-lg);
  border: 1px solid var(--sep-standard);
  height: 100%;
}

.title {
  font-size: $f-size-md;
  font-weight: $f-weight-bold;
  color: var(--txt-primary);
  margin-bottom: $space-xs;
}

.alertList {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  overflow-y: auto;
  max-height: 300px;
}

.alertCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-sm;
  border-radius: var(--rad-md);
  border-left: 4px solid transparent;
  background: var(--sys-surface-hover);
}

.alertCardCritical {
  border-left-color: var(--stat-danger);
}

.alertCardLow {
  border-left-color: var(--stat-warning);
}

.productInfo {
  display: flex;
  flex-direction: column;
}

.productName {
  font-weight: $f-weight-semibold;
  font-size: $f-size-sm;
}

.productSku {
  font-size: $f-size-xxs;
  color: var(--txt-muted);
}

.stockInfo {
  text-align: right;
}

.stockValue {
  font-weight: $f-weight-bold;
  font-size: $f-size-sm;
}

.emptyMsg {
  color: var(--txt-muted);
  font-size: $f-size-sm;
  font-style: italic;
}
```

- [ ] **Step 2: Create `AlertPanel.tsx`**

```tsx
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
```

### Task 2: Create `ComparativeStockChart` Component

**Files:**
- Create: `frontend/src/components/inventory/ComparativeStockChart.tsx`
- Create: `frontend/src/styles/components/inventory/ComparativeStockChart.module.scss`

- [ ] **Step 1: Create `ComparativeStockChart.module.scss`**

```scss
@import "../../config/tokens.scss";

.chartContainer {
  display: flex;
  flex-direction: column;
  gap: $space-md;
  padding: $space-md;
  background: var(--sys-surface);
  border-radius: var(--rad-lg);
  border: 1px solid var(--sep-standard);
  height: 100%;
}

.title {
  font-size: $f-size-md;
  font-weight: $f-weight-bold;
  color: var(--txt-primary);
}

.barsWrapper {
  display: flex;
  align-items: flex-end;
  gap: $space-sm;
  height: 200px;
  padding-bottom: $space-xl;
  position: relative;
}

.barGroup {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-xxs;
  height: 100%;
  justify-content: flex-end;
  position: relative;
}

.maxBar {
  width: 100%;
  background: var(--sep-standard);
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.actualBar {
  width: 100%;
  background: var(--brand-primary);
  border-radius: 4px 4px 0 0;
  transition: var(--mot-standard);
}

.label {
  position: absolute;
  bottom: -35px;
  font-size: 9px;
  font-weight: $f-weight-semibold;
  color: var(--txt-muted);
  text-transform: uppercase;
  transform: rotate(-45deg);
  white-space: nowrap;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

- [ ] **Step 2: Create `ComparativeStockChart.tsx`**

```tsx
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
```

### Task 3: Integration in `App.tsx`

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Import new components and add styles in `App.tsx`**

```tsx
// Add these imports
import { AlertPanel } from './components/inventory/AlertPanel';
import { ComparativeStockChart } from './components/inventory/ComparativeStockChart';

// Update the JSX in App.tsx
// Insert between <PageHeader ... /> and <section className="inventorySection">
```

- [ ] **Step 2: Update JSX structure in `App.tsx`**

```tsx
// Inside mainContainer
<main className="mainContainer">
  <PageHeader ... />

  <div className="dashboardGrid" style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
    gap: '1.5rem',
    marginBottom: '2rem'
  }}>
    <AlertPanel products={products} />
    <ComparativeStockChart products={products} />
  </div>

  <section className="inventorySection">
    ...
  </section>
</main>
```

### Task 4: Validation

- [ ] **Step 1: Run build**

Run: `npm run build` in `frontend/` directory.
Expected: Build successful without TypeScript errors.
