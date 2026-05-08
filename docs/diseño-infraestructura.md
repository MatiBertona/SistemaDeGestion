# Especificación de Diseño: Infraestructura del Back-end

Este documento detalla la configuración de Docker y la orquestación para el servicio Back-end del sistema de inventario.

## 1. Estructura de Directorios
Se adopta una estructura modular para permitir la coexistencia con futuros servicios (Frontend):
- `/backend`: Contiene todo el código fuente, dependencias y configuración de Docker del servicio FastAPI.
- `/compose.yaml`: Archivo raíz para la orquestación de todos los servicios.

## 2. Dockerfile Multi-stage
Para optimizar el tamaño de la imagen y la seguridad, se utiliza un proceso de construcción en dos etapas:

### Etapa 1: Builder
- **Base:** `python:3.11-slim`
- **Responsabilidad:** Instalación de herramientas de compilación y descarga de dependencias en un entorno virtual (`/opt/venv`).
- **Beneficio:** Mantiene las herramientas de compilación fuera de la imagen final.

### Etapa 2: Final (Runtime)
- **Base:** `python:3.11-slim`
- **Responsabilidad:** Ejecución de la aplicación.
- **Seguridad:** 
    - Copia solo el entorno virtual necesario.
    - Se crea y utiliza un usuario no privilegiado (`appuser`) para ejecutar el proceso.
- **Exposición:** Puerto 8000.

## 3. Orquestación (Docker Compose)
El servicio `backend` se integra con los siguientes parámetros:
- **Build:** Contexto en `./backend`, usando el Dockerfile multi-stage.
- **Dependencias:** `depends_on` con `condition: service_healthy` hacia el servicio `db`.
- **Variables de Entorno:** Mapeo de credenciales desde el archivo `.env` raíz.
- **Resiliencia:** Configuración de `healthcheck` en el servicio de base de datos para asegurar una inicialización ordenada.

## 4. Dependencias Iniciales
- `fastapi`: Framework web.
- `uvicorn[standard]`: Servidor ASGI.
- `sqlalchemy[asyncio]`: ORM con soporte asíncrono.
- `asyncpg`: Driver asíncrono para PostgreSQL.
- `pydantic-settings`: Gestión de configuraciones mediante variables de entorno.
