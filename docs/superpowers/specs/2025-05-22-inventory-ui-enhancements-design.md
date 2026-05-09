# Design Doc: Inventory UI Enhancements - AlertPanel & ComparativeStockChart

## Overview
Implement new UI components to enhance inventory visibility: `AlertPanel` for immediate stock alerts and `ComparativeStockChart` for visual stock capacity comparison.

## Goals
1. Provide a quick summary of products in critical or low stock status.
2. Visualize current stock levels relative to maximum capacity for a subset of products.
3. Integrate these components seamlessly into the existing dashboard layout.

## Components

### 1. `AlertPanel`
- **File**: `frontend/src/components/inventory/AlertPanel.tsx`
- **Props**: `products: Product[]`
- **Internal Logic**:
  - Filter `critical`: `stock_actual === 0`
  - Filter `low`: `stock_actual <= min_stock && stock_actual > 0`
- **Visuals**:
  - A section with a title "Alertas de Inventario".
  - Two groups of cards: "Crítico" and "Bajo Stock".
  - Cards will show Product Name, SKU, and Stock Actual.
  - Colors: Red (`--stat-danger`) for critical, Orange (`--stat-warning`) for low.

### 2. `ComparativeStockChart`
- **File**: `frontend/src/components/inventory/ComparativeStockChart.tsx`
- **Props**: `products: Product[]`
- **Internal Logic**:
  - Take up to the first 10 products.
- **Visuals**:
  - A bar chart where each entry represents a product.
  - For each product, show a bar where the background is the `max_stock` (grey/muted) and the foreground is the `stock_actual` (brand-primary).
  - Include labels for product names (truncated if necessary).

## Integration
- **File**: `frontend/src/App.tsx`
- **Layout**: 
  - Wrap `AlertPanel` and `ComparativeStockChart` in a `dashboardGrid` (CSS Grid: 1fr 1fr).
  - Place this grid between the `PageHeader` and `inventorySection`.

## Styling
- Use SCSS Modules.
- Leverage existing tokens in `tokens.scss`.
- Ensure dark mode compatibility using the existing CSS variables.

## Validation
- `npm run build` in `frontend/` must pass without TypeScript errors.
- Visual inspection of the components in both light and dark modes (implied, though I can't see them, I'll ensure the code is correct).
