# Especificación de Diseño: Back-end (FastAPI + Arquitectura Hexagonal)

Este documento detalla la arquitectura, el diseño de dominios y la configuración técnica del servidor API.

## 1. Arquitectura General
El sistema sigue los principios de **Arquitectura Hexagonal (Puertos y Adaptadores)** y **Domain-Driven Design (DDD)**. Esta estructura garantiza que la lógica de negocio esté aislada de las preocupaciones técnicas (bases de datos, frameworks web), facilitando el testing y la mantenibilidad.

### Estructura de Directorios (Modular por Dominio)
```text
backend/app/
├── core/               # Configuraciones transversales (Base de Datos, Seguridad)
├── productos/          # Dominio de Productos
│   ├── domain/         # Entidades e interfaces de repositorio
│   ├── application/    # Casos de uso (Servicios)
│   └── infrastructure/ # Adaptadores (DB, HTTP, Schemas)
└── categorias/         # Dominio de Categorías
```

## 2. Configuración Core (`app.core`)

### Base de Datos Asíncrona (`database.py`)
Se utiliza **SQLAlchemy 2.0** con soporte nativo para `asyncio` y el driver `asyncpg`.
- **Motor:** `create_async_engine` configurado mediante la variable de entorno `DATABASE_URL`.
- **Sesión:** `async_sessionmaker` para gestionar transacciones asíncronas.
- **Inyección de Dependencia:** Función `get_db` que provee una sesión de base de datos a los controladores de FastAPI mediante `Depends`.

## 3. Diseño de Dominios (Ejemplo: Productos)

El dominio se organiza en tres capas concéntricas:

### Capa de Dominio (Domain)
Contiene la "verdad" del negocio.
- **Entidades (`entities.py`):** Clases puras de Python (POPOs) que representan los datos.
- **Interfaces (`repository_interface.py`):** Clases abstractas que definen el contrato de acceso a datos sin implementar la tecnología.

### Capa de Aplicación (Application)
Implementa los casos de uso.
- **Servicios (`services.py`):** Coordina la lógica. Por ejemplo, `ListarProductosService` recibe un repositorio (la interfaz) y ejecuta la lógica de filtrado.

### Capa de Infraestructura (Infrastructure)
Implementa los detalles técnicos.
- **Repositorio SQL (`database/repository.py`):** Implementación concreta usando SQLAlchemy. Mapea modelos de tabla a entidades de dominio.
- **Controlador HTTP (`http/controller.py`):** Define los endpoints de FastAPI y gestiona la inyección de dependencias (`db`).
- **Esquemas Pydantic (`http/schemas.py`):** Define la estructura de entrada/salida para la validación y serialización JSON.

## 4. Flujo de una Petición (Request Lifecycle)
1. **Request:** `GET /productos?categoria=X`.
2. **Controller:** Recibe la petición, inyecta la sesión `db`.
3. **Dependencia:** Instancia el Repositorio concreto y el Servicio de Aplicación.
4. **Negocio:** El Servicio solicita los datos al Repositorio (usando el contrato de la interfaz).
5. **Persistencia:** El Repositorio consulta la BD, mapea a Entidades de Dominio y las devuelve.
6. **Response:** El Controller recibe las Entidades y las serializa mediante un Schema de Pydantic.

## 5. Pruebas (Testing)
Se utiliza **Pytest** para verificar la lógica. Gracias a la arquitectura hexagonal, es posible testear los servicios de aplicación utilizando "mocks" de los repositorios sin necesidad de levantar una base de datos real.

## 6. Referencias
- **FastAPI:** [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- **SQLAlchemy Async:** [https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- **Hexagonal Architecture:** [https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
