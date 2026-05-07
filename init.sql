-- 1. Creación de Usuarios y Roles
-- Note: These users should ideally be managed via environment variables in production,
-- but for this initialization script, we follow the provided specification.
CREATE USER dev_user WITH PASSWORD 'dev_pass';
CREATE USER prod_user WITH PASSWORD 'prod_pass';

-- Permisos iniciales
GRANT ALL PRIVILEGES ON DATABASE inventario_db TO dev_user;

-- 2. Esquema de Tablas
CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria_id INTEGER REFERENCES categoria(id) ON DELETE RESTRICT,
    precio_unitario NUMERIC(12,2) NOT NULL,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT chk_stock_positivo CHECK (stock_actual >= 0)
);

CREATE TABLE movimiento (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES producto(id) ON DELETE CASCADE,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'salida')),
    cantidad INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255),
    usuario VARCHAR(100)
);

-- 3. Índices de Optimización
CREATE INDEX idx_producto_categoria ON producto(categoria_id);
CREATE INDEX idx_movimiento_producto ON movimiento(producto_id);
CREATE INDEX idx_movimiento_fecha ON movimiento(fecha);
CREATE INDEX idx_producto_nombre ON producto(nombre);

-- 4. Seguridad: Configuración de prod_user (Principio de Menor Privilegio)
-- Conectar a la base de datos y asignar permisos en el esquema público
GRANT USAGE ON SCHEMA public TO prod_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO prod_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO prod_user;

-- Denegar DELETE explícitamente para prod_user
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM prod_user;

-- El dev_user hereda permisos sobre las nuevas tablas
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dev_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dev_user;
