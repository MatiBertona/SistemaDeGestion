# Especificación de Diseño: Dominio de Productos (DDD + Hexagonal)

Este documento detalla la implementación del endpoint de listado de productos siguiendo los principios de Domain-Driven Design (DDD) y Arquitectura Hexagonal.

## 1. Estructura de Capas (Dominio: Productos)

El dominio se organiza en tres capas concéntricas:

### Capa de Dominio (Domain) - El Núcleo
Contiene la lógica de negocio pura, sin dependencias de frameworks o bases de datos.
- **`entities.py`**: Clase `Producto` (dataclass o POPO) y `Categoria`.
- **`repository_interface.py`**: Interfaz abstracta `ProductoRepository` que define cómo se accede a los datos.

### Capa de Aplicación (Application)
Coordina las acciones del negocio.
- **`services.py`**: Caso de uso `ListarProductosService`. Recibe el repositorio inyectado y aplica filtros.

### Capa de Infraestructura (Infrastructure) - Los Adaptadores
Implementaciones técnicas y frameworks.
- **`database/models.py`**: Modelos de SQLAlchemy (Persistencia). Mapean el esquema `inventario`.
- **`database/repository.py`**: Implementación concreta de `ProductoRepository` usando SQLAlchemy Async. Realiza la conversión de Modelos de BD a Entidades de Dominio.
- **`http/controller.py`**: Adaptador de entrada (FastAPI). Gestiona el request HTTP.
- **`http/schemas.py`**: Recursos (Pydantic) para la serialización del JSON de respuesta.

## 2. Flujo de Datos
1. `GET /productos?categoria=electronica` -> **Controller** (Infrastructure).
2. El **Controller** llama al **Application Service**.
3. El **Service** llama al **Repository** (Interface).
4. El **Repository Implementation** (Infrastructure) consulta la BD mediante el **ORM**, carga la relación `categoria` y mapea los resultados a **Entities** (Domain).
5. El **Service** devuelve las **Entities**.
6. El **Controller** serializa las **Entities** usando **Schemas** (Pydantic) para emitir el JSON final.

## 3. Requerimientos Cumplidos
- **JSON:** Formato de salida estándar mediante Pydantic.
- **Filtro por Categoría:** Soportado en el Repositorio y Servicio.
- **Nombre de Categoría:** Incluido mediante la relación cargada por el ORM y expuesta en el Schema.
- **Stock Actual:** Incluido en la Entidad y el Schema.
