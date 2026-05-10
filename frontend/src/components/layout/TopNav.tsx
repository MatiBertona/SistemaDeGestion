import { FC, useState } from 'react';
import type { Product } from '../../types/stock.types';
import { AlertPanel } from '../inventory/AlertPanel';

interface Props {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const TopNav: FC<Props> = ({ isDarkMode, onThemeToggle, products, onSelectProduct }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const lowStockCount = products.filter(p => p.stock_actual <= p.min_stock).length;

  return (
    <nav className="topNav">
      <div className="navContent">
        <div className="brand">
          <div className="brandIcon"></div>
          <span>Inventario</span>
        </div>
        
        <div className="navActions">
          <button 
            className="navIconBtn themeToggle" 
            onClick={onThemeToggle}
            title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
          >
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
          
          <div style={{ position: 'relative' }}>
            <button 
              className="navIconBtn" 
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              {lowStockCount > 0 && <span className="badge">{lowStockCount}</span>}
            </button>

            {showNotifications && (
              <div className="notificationDropdown" onClick={(e) => e.stopPropagation()}>
                <AlertPanel 
                  products={products} 
                  onSelectProduct={(p) => {
                    onSelectProduct(p);
                    setShowNotifications(false);
                  }} 
                />
              </div>
            )}
          </div>
          
          <div className="userProfile">
            <div className="avatar">JS</div>
            <span className="userName">Juan Segovia</span>
          </div>
        </div>
      </div>
      {showNotifications && (
        <div className="dropdownOverlay" onClick={() => setShowNotifications(false)} />
      )}
    </nav>
  );
};
