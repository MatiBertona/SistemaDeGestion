import type { FC } from 'react';

interface Props {
  onCreateProduct: () => void;
  onExport: () => void;
}

export const PageHeader: FC<Props> = ({ onCreateProduct, onExport }) => {
  return (
    <header className="pageHeader">
      <div className="titleGroup">
        <p className="date">Viernes, 8 de mayo</p>
        <h1>Gestión de Stock</h1>
      </div>
      <div className="headerActions">
        <button className="btnSecondary" onClick={onExport}>Exportar</button>
        <button className="btnPrimary" onClick={onCreateProduct}>Nuevo Producto</button>
      </div>
    </header>
  );
};
