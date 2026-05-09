import { useState, useMemo, useEffect } from 'react';
import { ProductTable } from './components/inventory/ProductTable';
import { ProductDrawer } from './components/inventory/ProductDrawer';
import { MovementModal } from './components/inventory/MovementModal';
import type { Product, StockMovement } from './types/inventory';
import './App.scss';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Laptop Pro 14"', sku: 'LP-001', category_name: 'Electrónica', price: 1200, stock_actual: 45, min_stock: 15, max_stock: 60 },
  { id: '2', name: 'Mouse Inalámbrico', sku: 'MOU-001', category_name: 'Accesorios', price: 25, stock_actual: 8, min_stock: 15, max_stock: 50 },
  { id: '3', name: 'Teclado Mecánico RGB', sku: 'TEC-092', category_name: 'Electrónica', price: 85, stock_actual: 0, min_stock: 15, max_stock: 100 },
  { id: '4', name: 'Monitor 4K 27"', sku: 'MON-4K', category_name: 'Electrónica', price: 450, stock_actual: 12, min_stock: 10, max_stock: 30 },
  { id: '5', name: 'Silla Ergonómica', sku: 'FUR-001', category_name: 'Mobiliario', price: 299, stock_actual: 3, min_stock: 5, max_stock: 20 },
];

const CATEGORIES = ['Todos', 'Electrónica', 'Accesorios', 'Mobiliario'];

function App() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sincronización del tema con el DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || p.category_name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleMovementSubmit = (movement: Omit<StockMovement, 'id' | 'date'>) => {
    // Simulamos la actualización del stock
    setProducts(prev => prev.map(p => {
      if (p.id === movement.product_id) {
        const newStock = movement.type === 'ENTRADA' 
          ? p.stock_actual + movement.amount 
          : p.stock_actual - movement.amount;
        
        return { ...p, stock_actual: newStock };
      }
      return p;
    }));

    // Actualizar también el producto seleccionado si está abierto en el Drawer
    if (selectedProduct && selectedProduct.id === movement.product_id) {
      const newStock = movement.type === 'ENTRADA' 
        ? selectedProduct.stock_actual + movement.amount 
        : selectedProduct.stock_actual - movement.amount;
      setSelectedProduct({ ...selectedProduct, stock_actual: newStock });
    }

    setIsMovementModalOpen(false);
  };

  const handleQuickMovement = (product: Product) => {
    setSelectedProduct(product);
    setIsMovementModalOpen(true);
  };

  return (
    <div className="appWrapper">
      <nav className="topNav">
        <div className="navContent">
          <div className="brand">
            <div className="brandIcon"></div>
            <span>Inventario</span>
          </div>
          
          <div className="navActions">
            <button 
              className="navIconBtn themeToggle" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              )}
            </button>

            <button className="navIconBtn" title="Notificaciones">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="badge">3</span>
            </button>
            
            <div className="userProfile">
              <div className="avatar">JS</div>
              <span className="userName">Juan Segovia</span>
              <button className="logoutBtn" title="Cerrar Sesión">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mainContainer">
        <header className="pageHeader">
          <div className="titleGroup">
            <p className="date">Viernes, 8 de mayo</p>
            <h1>Panel General</h1>
          </div>
          <div className="headerActions">
            <button className="btnSecondary">
              Exportar
            </button>
            <button className="btnPrimary" onClick={() => alert('Abrir Modal')}>
              Nuevo Producto
            </button>
          </div>
        </header>

        <section className="inventorySection">
          <div className="controlBar">
            <div className="searchWrapper">
              <div className="searchIcon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                type="text" 
                placeholder="Buscar por nombre o SKU..." 
                className="iosSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filterGroup">
              <span className="filterLabel">Categoría</span>
              <div className="pillTabs">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    className={`pillTab ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="contentCard">
            {filteredProducts.length > 0 ? (
              <ProductTable 
                products={filteredProducts} 
                onSelect={setSelectedProduct} 
                onQuickMovement={handleQuickMovement}
              />
            ) : (
              <div className="emptyState">
                <div className="emptyIcon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <p>Sin coincidencias</p>
                <button className="btnGhost" onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}>
                  Ver todo
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <ProductDrawer 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        onMovement={() => setIsMovementModalOpen(true)}
      />

      {isMovementModalOpen && selectedProduct && (
        <MovementModal 
          product={selectedProduct} 
          onClose={() => setIsMovementModalOpen(false)} 
          onSubmit={handleMovementSubmit} 
        />
      )}
    </div>
  );
}

export default App;
