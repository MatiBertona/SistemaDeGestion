import './App.css'

function App() {
  const mockProducts = [
    { id: 1, nombre: 'Laptop Pro 15', stock: 10, estado: 'ok', precio: '$1.200' },
    { id: 2, nombre: 'Mouse Inalámbrico', stock: 3, estado: 'warning', precio: '$25' },
    { id: 3, nombre: 'Monitor 4K', stock: 0, estado: 'danger', precio: '$450' },
  ];

  return (
    <div className="showcase-container">
      <header className="showcase-header">
        <h1>Sistema de Gestión</h1>
        <p className="text-secondary">Visualización de tokens y componentes premium</p>
      </header>

      <section className="kpi-grid">
        <div className="kpi-card">
          <span className="text-secondary">Total Productos</span>
          <div className="metric">1.240</div>
        </div>
        <div className="kpi-card">
          <span className="text-secondary">Stock Crítico</span>
          <div className="metric text-danger">12</div>
        </div>
      </section>

      <section className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map(p => (
              <tr key={p.id}>
                <td className="font-medium">{p.nombre}</td>
                <td className="text-secondary">{p.precio}</td>
                <td>{p.stock}</td>
                <td>
                  <span className={`badge is-${p.estado}`}>
                    {p.estado === 'ok' ? 'Saludable' : p.estado === 'warning' ? 'Bajo' : 'Crítico'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App
