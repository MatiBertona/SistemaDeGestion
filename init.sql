-- 1. Creación de Esquema
CREATE SCHEMA IF NOT EXISTS inventario;

-- 2. Creación de Usuarios y Roles
-- Note: These users should ideally be managed via environment variables in production.
CREATE USER dev_user WITH PASSWORD 'dev_pass';
CREATE USER prod_user WITH PASSWORD 'prod_pass';

-- Permisos iniciales a nivel de base de datos
GRANT ALL PRIVILEGES ON DATABASE inventario_db TO dev_user;

-- 3. Esquema de Tablas (dentro del esquema inventario)
CREATE TABLE inventario.categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE inventario.producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria_id INTEGER REFERENCES inventario.categoria(id) ON DELETE RESTRICT,
    precio_unitario NUMERIC(12,2) NOT NULL,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT chk_stock_positivo CHECK (stock_actual >= 0)
);

CREATE TABLE inventario.movimiento (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES inventario.producto(id) ON DELETE CASCADE,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'salida')),
    cantidad INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255),
    id_usuario INTEGER NOT NULL
);

-- 4. Índices de Optimización
CREATE INDEX idx_producto_categoria ON inventario.producto(categoria_id);
CREATE INDEX idx_movimiento_producto ON inventario.movimiento(producto_id);
CREATE INDEX idx_movimiento_fecha ON inventario.movimiento(fecha);
CREATE INDEX idx_producto_nombre ON inventario.producto(nombre);

-- 5. Datos de Ejemplo
INSERT INTO inventario.categoria (nombre, descripcion) VALUES 
('Electrónica', 'Dispositivos electrónicos y accesorios'),
('Hogar', 'Artículos para el hogar y decoración'),
('Oficina', 'Insumos y muebles de oficina');

INSERT INTO inventario.producto (nombre, categoria_id, precio_unitario, stock_actual) VALUES 
('Laptop Pro 15', 1, 1200.00, 10),
('Mouse Inalámbrico', 1, 25.50, 50),
('Silla Ergonómica', 3, 150.00, 15),
('Cafetera Express', 2, 85.00, 8);

INSERT INTO inventario.movimiento (producto_id, tipo, cantidad, motivo, id_usuario) VALUES 
(1, 'entrada', 10, 'Carga inicial de inventario', 1),
(2, 'entrada', 50, 'Compra a proveedor X', 2),
(3, 'entrada', 15, 'Carga inicial de inventario', 1),
(4, 'entrada', 8, 'Carga inicial de inventario', 1);

-- 6. Seguridad: Configuración de prod_user (Principio de Menor Privilegio)
-- Asignar permisos en el esquema específico
GRANT USAGE ON SCHEMA inventario TO prod_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA inventario TO prod_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA inventario TO prod_user;

-- Denegar DELETE explícitamente para prod_user
REVOKE DELETE ON ALL TABLES IN SCHEMA inventario FROM prod_user;

-- El dev_user tiene todos los permisos sobre el esquema inventario
GRANT ALL PRIVILEGES ON SCHEMA inventario TO dev_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA inventario TO dev_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA inventario TO dev_user;
