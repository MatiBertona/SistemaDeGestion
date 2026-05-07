# Especificación de Diseño: Sistema de Inventario (DB Relacional)

Este documento detalla la arquitectura, el esquema y la estrategia de seguridad implementada para la base de datos del sistema de gestión de inventario.

## 1. Infraestructura y Despliegue
- **Tecnología:** PostgreSQL 15 (Alpine) para garantizar estabilidad y un tamaño de imagen reducido.
- **Orquestación:** Docker Compose para facilitar el despliegue y la reproducibilidad del entorno.
- **Persistencia:** Se utiliza un volumen nombrado (`inventario_pg_data`) para asegurar que los datos persistan ante reinicios o eliminación de contenedores.
- **Variables de Entorno:** Se utiliza un archivo `.env` para la gestión segura de credenciales y configuración del contenedor.

## 2. Organización y Seguridad (RBAC)
Se ha implementado una separación por esquemas y roles para seguir las mejores prácticas de seguridad:

### Esquema `inventario`
Todas las tablas relacionadas con el negocio residen en el esquema `inventario`, manteniendo el esquema `public` limpio y aislado.

### Roles y Permisos
- **Administrador (postgres):** Acceso total para mantenimiento y tareas de superusuario.
- **dev_user:** Rol de desarrollo con privilegios completos sobre el esquema `inventario` para agilizar las pruebas.
- **prod_user:** Rol limitado que aplica el **Principio de Menor Privilegio**:
    - Permisos: `SELECT`, `INSERT`, `UPDATE` sobre tablas y secuencias.
    - Restricción de Seguridad: Se ha denegado explícitamente el permiso de `DELETE` para prevenir borrados accidentales o malintencionados de registros históricos.

## 3. Modelo de Datos y Reglas de Negocio

### Tabla: `inventario.categoria`
- Maestro de categorías para clasificar productos.

### Tabla: `inventario.producto`
- Almacena la información de productos.
- **Constraint de Integridad:** El campo `stock_actual` cuenta con un `CHECK` para garantizar que nunca sea menor a 0.
- **Relación:** `categoria_id` posee un `ON DELETE RESTRICT` para evitar la eliminación de categorías que tengan productos asociados.

### Tabla: `inventario.movimiento`
- Registro histórico de entradas y salidas de stock.
- **Integridad:** El campo `tipo` está restringido a los valores 'entrada' o 'salida'.
- **Relación:** `producto_id` posee un `ON DELETE CASCADE` para limpiar el historial si el producto es removido.
- **Auditoría:** Se registra el `id_usuario` responsable del movimiento.

## 4. Índices y Optimización
Para garantizar un alto rendimiento en consultas frecuentes, se han creado los siguientes índices:
- **`idx_producto_categoria`**: Optimiza filtros y agrupaciones por categoría.
- **`idx_movimiento_producto`**: Agiliza la obtención del historial de stock de un producto específico.
- **`idx_movimiento_fecha`**: Optimiza reportes temporales y auditorías por rango de fechas.
- **`idx_producto_nombre`**: Índice B-Tree para búsquedas rápidas por nombre de producto.

## 5. Estrategia de Inicialización
El sistema utiliza el mecanismo nativo de PostgreSQL en Docker para inicializar el esquema y los datos de ejemplo automáticamente mediante el script `init.sql`, garantizando que cualquier desarrollador pueda levantar el entorno completo con un solo comando: `docker compose up -d`.
