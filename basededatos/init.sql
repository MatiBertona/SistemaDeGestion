-- 1. Creación de Esquema
CREATE SCHEMA IF NOT EXISTS inventario;

-- 2. Creación de Usuarios y Roles
-- Note: Estos usuarios deberían gestionarse idealmente mediante variables de entorno en producción.
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'dev_user') THEN
        CREATE USER dev_user WITH PASSWORD 'dev_pass';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'prod_user') THEN
        CREATE USER prod_user WITH PASSWORD 'prod_pass';
    END IF;
END
$$;

-- Permisos iniciales a nivel de base de datos
GRANT ALL PRIVILEGES ON DATABASE inventario_db TO dev_user;

-- 3. Esquema de Tablas (dentro del esquema inventario)
CREATE TABLE IF NOT EXISTS inventario.categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS inventario.producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    categoria_id INTEGER REFERENCES inventario.categoria(id) ON DELETE RESTRICT,
    precio_unitario NUMERIC(12,2) NOT NULL,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 10,
    max_stock INTEGER NOT NULL DEFAULT 100,
    CONSTRAINT chk_stock_positivo CHECK (stock_actual >= 0)
);

CREATE TABLE IF NOT EXISTS inventario.movimiento (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES inventario.producto(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL,
    cantidad INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255),
    usuario VARCHAR(100)
);

-- 4. Índices de Optimización
CREATE INDEX IF NOT EXISTS idx_producto_categoria ON inventario.producto(categoria_id);
CREATE INDEX IF NOT EXISTS idx_movimiento_producto ON inventario.movimiento(producto_id);
CREATE INDEX IF NOT EXISTS idx_movimiento_fecha ON inventario.movimiento(fecha);
CREATE INDEX IF NOT EXISTS idx_producto_nombre ON inventario.producto(nombre);

-- 5. Datos de Ejemplo
INSERT INTO inventario.categoria (nombre, descripcion) VALUES 
('Electrónica', 'Dispositivos electrónicos y accesorios'),
('Hogar', 'Artículos para el hogar y decoración'),
('Oficina', 'Insumos y muebles de oficina')
ON CONFLICT DO NOTHING;

INSERT INTO inventario.producto (nombre, sku, categoria_id, precio_unitario, stock_actual, min_stock, max_stock) VALUES 
('Laptop Pro 15', 'PROD-1', 1, 1200.00, 10, 10, 100),
('Mouse Inalámbrico', 'PROD-2', 1, 25.50, 50, 15, 80),
('Silla Ergonómica', 'PROD-3', 3, 150.00, 15, 5, 40),
('Cafetera Express', 'PROD-4', 2, 85.00, 8, 10, 30)
ON CONFLICT DO NOTHING;

INSERT INTO inventario.movimiento (producto_id, tipo, cantidad, motivo, usuario) VALUES 
(1, 'ENTRADA', 10, 'Carga inicial de inventario', 'admin'),
(2, 'ENTRADA', 50, 'Compra a proveedor X', 'admin'),
(3, 'ENTRADA', 15, 'Carga inicial de inventario', 'admin'),
(4, 'ENTRADA', 8, 'Carga inicial de inventario', 'admin')
ON CONFLICT DO NOTHING;

-- 6. Seguridad: Configuración de prod_user (Principio de Menor Privilegio)
GRANT USAGE ON SCHEMA inventario TO prod_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA inventario TO prod_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA inventario TO prod_user;
REVOKE DELETE ON ALL TABLES IN SCHEMA inventario FROM prod_user;

-- El dev_user tiene todos los permisos sobre el esquema inventario
GRANT ALL PRIVILEGES ON SCHEMA inventario TO dev_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA inventario TO dev_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA inventario TO dev_user;
