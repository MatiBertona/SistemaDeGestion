import { useState, useMemo, useEffect } from 'react';

// Componentes de Layout
import { TopNav } from './components/layout/TopNav';
import { PageHeader } from './components/layout/PageHeader';

// Componentes de Dominio (Stock)
import { ProductTable } from './components/inventory/ProductTable';
import { ProductDrawer } from './components/inventory/ProductDrawer';
import { MovementModal } from './components/inventory/MovementModal';
import { InventoryControls } from './components/inventory/InventoryControls';
import { AlertPanel } from './components/inventory/AlertPanel';
import { ComparativeStockChart } from './components/inventory/ComparativeStockChart';

// Capas de Servicio y Orquestación
import { useProducts, useCategories, useStockMutations } from './hooks/useStock';
import type { Product, CreateMovementDTO } from './types/stock.types';

// Estilos
import './styles/App.scss';

function App() {
  // --- Estado Global de UI (Tema) ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // --- Capa de Datos (Hooks / TanStack Query) ---
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: products = [], isLoading, isError, refetch } = useProducts(selectedCategory);
  const { data: categories = [] } = useCategories();
  const { registerMovement } = useStockMutations();

  // --- Estado de UI de Negocio ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  // --- Lógica de Negocio Local (Filtrado) ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // --- Handlers de Acciones ---
  const handleQuickMovement = (product: Product) => {
    setSelectedProduct(product);
    setIsMovementModalOpen(true);
  };

  const handleMovementSubmit = async (movementData: CreateMovementDTO) => {
    await registerMovement.mutateAsync(movementData);
    setIsMovementModalOpen(false);
  };

  // --- Renderizado de Estados de Error ---
  if (isError) {
    return (
      <div className="errorContainer">
        <p>Error al cargar el inventario. Por favor, intente nuevamente.</p>
        <button className="btnPrimary" onClick={() => refetch()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="appWrapper">
      <TopNav 
        isDarkMode={isDarkMode} 
        onThemeToggle={() => setIsDarkMode(!isDarkMode)} 
      />

      <main className="mainContainer">
        <PageHeader 
          onCreateProduct={() => alert('Próximamente: Crear Producto')}
          onExport={() => alert('Próximamente: Exportar Datos')}
        />

        <div className="dashboardGrid">
          <AlertPanel products={products} />
          <ComparativeStockChart products={products} />
        </div>

        <section className="inventorySection">
          <InventoryControls 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          <div className="contentCard">
            {isLoading ? (
              <div className="skeletonContainer">
                <p>Cargando inventario...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductTable 
                products={filteredProducts} 
                onSelect={setSelectedProduct} 
                onQuickMovement={handleQuickMovement}
              />
            ) : (
              <div className="emptyState">
                <div className="emptyIcon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <p>No se encontraron productos</p>
                <button className="btnGhost" onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}>
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Capa de Modales y Detalle */}
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
