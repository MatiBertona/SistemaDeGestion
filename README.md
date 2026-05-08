# Sistema de Gestión de Inventario

Este proyecto es un sistema de gestión de inventario transaccional desarrollado como parte de un desafío técnico. Implementa una arquitectura moderna, escalable y segura utilizando contenedores.

## 🚀 Tecnologías Principales

*   **Backend:** Python 3.11 con **FastAPI**.
*   **Base de Datos:** **PostgreSQL 15** con esquemas personalizados e índices optimizados.
*   **ORM:** **SQLAlchemy 2.0** (Async) para operaciones asíncronas de alto rendimiento.
*   **Arquitectura:** **Clean Architecture / Arquitectura Hexagonal** siguiendo principios de **DDD (Domain-Driven Design)**.
*   **Contenerización:** **Docker** y **Docker Compose** con build multi-stage.

## 🏗️ Arquitectura del Proyecto

El sistema está organizado en dominios independientes (Contextos Delimitados):

*   `/backend/app/productos`: Gestión de productos (Capa de Dominio, Aplicación e Infraestructura).
*   `/backend/app/categorias`: Gestión de categorías.
*   `/backend/app/core`: Configuraciones transversales (Base de datos, seguridad).

### Características Técnicas
- **Seguridad:** Implementación de roles (RBAC) con usuario de producción restringido (sin permisos de DELETE físico).
- **Escalabilidad:** Separación clara entre la lógica de negocio (entidades puras) y adaptadores externos (FastAPI, SQLAlchemy).
- **Calidad:** Suite de pruebas unitarias implementada para la lógica de servicios.

## 🛠️ Cómo Levantar el Proyecto

El entorno está totalmente automatizado con Docker y soporta configuraciones específicas por entorno.

### 1. Clonar el repositorio y configurar el entorno
\`\`\`bash
cp .env.example .env
\`\`\`

### 2. Iniciar en Entorno de Desarrollo (Recomendado)
Incluye **Hot-Reload** del código y exposición de la base de datos (puerto 5432) para herramientas locales.
\`\`\`bash
docker compose -f compose.yaml -f compose.dev.yaml up -d --build
\`\`\`

### 3. Iniciar en Entorno de Producción
Configuración optimizada y segura (DB aislada, sin volúmenes de desarrollo).
\`\`\`bash
docker compose -f compose.yaml -f compose.prod.yaml up -d --build
\`\`\`

El backend estará disponible en [http://localhost:8000](http://localhost:8000).


El backend estará disponible en [http://localhost:8000](http://localhost:8000).
Podés explorar la documentación interactiva (Swagger) en [http://localhost:8000/docs](http://localhost:8000/docs).

## 🧪 Ejecución de Pruebas

Para ejecutar las pruebas unitarias dentro del contenedor:
```bash
docker compose exec backend pytest
```

---
Desarrollado por [Tu Nombre/MatiBertona] - 2026
