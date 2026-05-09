import { useState } from 'react';
import { ProductTable } from './components/inventory/ProductTable';
import { ProductDrawer } from './components/inventory/ProductDrawer';
import type { Product } from './types/inventory';
import './App.css';

// Datos Mock para desarrollo inicial
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
        onMovement={() => console.log('Abrir Modal')}
      />
    </div>
  );
}

export default App;
