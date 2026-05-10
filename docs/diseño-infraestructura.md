# Especificación de Diseño: Infraestructura del Sistema

Este documento detalla la configuración de Docker y la orquestación para todos los servicios del sistema de inventario (Back-end y Front-end).

## 1. Estructura de Directorios
Se adopta una estructura modular para permitir la coexistencia de todos los servicios:
- `/backend`: Lógica de servidor (FastAPI).
- `/frontend`: Interfaz de usuario (React + Vite).
- `/basededatos`: Scripts de inicialización y configuración SQL.
- `/docs`: Documentación técnica y especificaciones de diseño.
- `/compose.yaml`: Archivo raíz para la orquestación base.

## 2. Infraestructura del Back-end (Python + FastAPI)

### Dockerfile Multi-stage
Para optimizar el tamaño de la imagen y la seguridad, se utiliza un proceso de construcción en dos etapas:
1. **Etapa 1 (Builder):** Instala dependencias en un entorno virtual (`/opt/venv`) usando `python:3.11-slim`.
2. **Etapa 2 (Runtime):** Copia solo el entorno virtual y ejecuta la aplicación con un usuario no privilegiado (`appuser`).

### Orquestación
- **Exposición:** Puerto 8000 en desarrollo.
- **Resiliencia:** Depende de que la base de datos esté "healthy".

## 3. Infraestructura del Front-end (React + Vite + Nginx)

### Dockerfile Multi-stage
Diseñado para maximizar el rendimiento y la ligereza en producción:
1. **Etapa 1 (Build):** Usa `node:20-slim` para instalar dependencias y compilar el código fuente (`npm run build`). Genera los activos estáticos en la carpeta `dist`.
2. **Etapa 2 (Production):** Usa `nginx:alpine` para servir los archivos estáticos.
    - **Por qué Nginx:** Servidor ultra ligero y eficiente para contenido estático.
    - **Por qué Alpine:** Imagen mínima que reduce la superficie de ataque.

### Orquestación en Desarrollo
En el entorno de desarrollo, el contenedor utiliza el servidor de desarrollo de Vite para habilitar **Hot Module Replacement (HMR)**:
- **Puerto:** 5173.
- **Volúmenes:** Se monta `./frontend` para reflejar cambios en tiempo real, protegiendo `node_modules` mediante un volumen anónimo.

## 4. Orquestación Global (Docker Compose)
El sistema utiliza múltiples archivos para separar la configuración base de la específica de producción:

- **`compose.yaml`:** Definiciones para desarrollo (puertos expuestos, volúmenes para hot-reload, modo debug).
- **`compose.prod.yaml`:** Configuraciones para producción (optimización de recursos, reinicio automático, seguridad reforzada).

### Redes y Comunicación
Se utiliza una red dedicada llamada `inventory_network` (driver: bridge) para aislar el tráfico del sistema:
- **Aislamiento:** Los contenedores se comunican entre sí usando sus nombres de servicio (ej: el backend se conecta a `db:5432`).
- **Seguridad:** Solo los puertos explícitamente declarados en los archivos `compose.yaml` o `compose.prod.yaml` son accesibles desde el host.

### Persistencia de Datos (Volúmenes)
- **`inventario_pg_data`:** Volumen nombrado para la base de datos PostgreSQL. Garantiza que la información no se pierda al destruir los contenedores.
- **Volúmenes de Desarrollo:** En `compose.yaml`, se montan las carpetas locales (`./backend` y `./frontend`) para permitir el desarrollo en tiempo real sin reconstruir imágenes.

## 5. Mantenimiento y Operación

### Gestión de Logs
Para monitorear el comportamiento de los servicios, se recomienda el uso de los siguientes comandos:
- **Ver todos los logs:** `docker compose logs -f`
- **Logs de un servicio específico:** `docker compose logs -f backend` (sustituir por `db` o `frontend`).

### Inspección de Recursos
- **Ver estado de red:** `docker network inspect inventory_network`
- **Ver volúmenes activos:** `docker volume ls`
- **Estado de salud:** `docker compose ps` (permite verificar el estado `healthy` de la base de datos).

## 6. Dependencias Técnicas Clave
- **Backend:** `fastapi`, `uvicorn`, `sqlalchemy`, `asyncpg`.
- **Frontend:** `react`, `vite`, `typescript`, `sass`.
- **Servidor:** `nginx:alpine`.

