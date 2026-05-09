import type { FC } from 'react';
import type { Category } from '../../types/stock.types';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const InventoryControls: FC<Props> = ({ 
  searchTerm, 
  onSearchChange, 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="controlBar">
      <div className="searchWrapper">
        <div className="searchIcon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Buscar por nombre o SKU..." 
          className="iosSearch"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="filterGroup">
        <span className="filterLabel">Categoría</span>
        <div className="pillTabs">
          <button 
            className={`pillTab ${selectedCategory === 'Todos' ? 'active' : ''}`}
            onClick={() => onCategoryChange('Todos')}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`pillTab ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
