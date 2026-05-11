import { useState, useMemo, useEffect } from 'react';

// Componentes de Layout
import { TopNav } from './components/layout/TopNav';
import { PageHeader } from './components/layout/PageHeader';

// Componentes de Dominio (Stock)
import { ProductTable } from './components/inventory/ProductTable';
import { ProductDrawer } from './components/inventory/ProductDrawer';
import { MovementModal } from './components/inventory/MovementModal';
import { ProductModal } from './components/inventory/ProductModal';

// Capas de Servicio y Orquestación
import { useProducts, useCategories, useStockMutations } from './hooks/useStock';
import type { Product, CreateMovementDTO, CreateProductDTO } from './types/stock.types';

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
  
  // Traemos TODOS los productos para que las notificaciones sean globales (independientes del filtro)
  const { data: products = [], isLoading, isError, refetch } = useProducts();
  const { data: categories = [] } = useCategories();
  const { registerMovement, createProduct } = useStockMutations();

  // --- Estado de UI de Negocio ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // --- Lógica de Negocio Local (Filtrado Combinado) ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Todos' || p.category_name === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // --- Handlers de Acciones ---
  const handleQuickMovement = (product: Product) => {
    setSelectedProduct(product);
    setIsMovementModalOpen(true);
  };

  const handleMovementSubmit = async (movementData: CreateMovementDTO) => {
    await registerMovement.mutateAsync(movementData);
    setIsMovementModalOpen(false);
  };

  const handleCreateProductSubmit = async (productData: CreateProductDTO) => {
    await createProduct.mutateAsync(productData);
    setIsProductModalOpen(false);
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
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <main className="mainContainer">
        {/* Sidebar Izquierda: Categorías */}
        <aside className="sidebarLeft">
          <h3 className="sidebarTitle">Categorías</h3>
          <nav className="sideNavList">
            <button 
              className={`navItem ${selectedCategory === 'Todos' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Todos')}
            >
              Todos los Productos
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`navItem ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Área Central: Contenido Principal */}
        <div className="contentArea">
          <PageHeader 
            onCreateProduct={() => setIsProductModalOpen(true)}
            onExport={() => alert('Próximamente: Exportar Datos')}
          />

          <section className="inventorySection">
            <div className="controlBar">
              <div className="searchWrapper" style={{ maxWidth: '100%' }}>
                <div className="searchIcon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Buscar productos por nombre o SKU..." 
                  className="iosSearch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
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
                  <p>No se encontraron productos</p>
                </div>
              )}
            </div>
          </section>
        </div>
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

      {isProductModalOpen && (
        <ProductModal 
          categories={categories}
          onClose={() => setIsProductModalOpen(false)} 
          onSubmit={handleCreateProductSubmit} 
        />
      )}
    </div>
  );
}

export default App;
