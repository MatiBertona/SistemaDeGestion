# Especificación de Diseño: Front-end (React + TypeScript)

Este documento detalla las decisiones técnicas y la arquitectura de la capa de presentación del sistema de gestión de stock.

## 1. Justificación de Tecnologías Core

### 1.1 ¿Por qué React y no Streamlit?
Aunque Streamlit permite crear interfaces rápidas en Python, para un sistema de gestión transaccional profesional se optó por React por las siguientes razones:
- **Control y Escalabilidad:** React permite un control total sobre el estado de la aplicación y la interfaz de usuario (UI), permitiendo crear componentes complejos y reutilizables.
- **Rendimiento:** Al ser una Single Page Application (SPA), la carga de procesamiento ocurre en el navegador del cliente, lo que garantiza una respuesta inmediata a las interacciones.
- **Ecosistema:** React posee el ecosistema de librerías más grande para la gestión de estados complejos y diseños de alta fidelidad.

### 1.2 ¿Por qué TypeScript (TS)?
- **Seguridad de Tipado:** Detecta errores en tiempo de compilación, lo cual es vital para el manejo de estructuras de datos de inventario.
- **Mantenibilidad:** Facilita el refactor y el autocompletado, asegurando que el contrato entre el Backend y el Frontend se respete estrictamente.

### 1.3 ¿Por qué Vite?
- **Instantáneo:** Ofrece un ciclo de desarrollo ultra rápido gracias al uso de módulos ES nativos.
- **Bundle Optimizado:** Genera archivos estáticos ligeros, ideales para ser servidos por Nginx.

## 2. Arquitectura de Capas (Surgical Pattern)

Se implementó un patrón de **Separación de Capas** estricto para desacoplar el estado del servidor de la lógica de presentación:

### 2.1 Capa de Servicios (`src/services/`)
- **apiClient.ts:** Instancia centralizada de Axios con interceptores para el manejo global de errores y configuración de baseURL.
- **stock.service.ts:** Funciones puras que realizan las llamadas HTTP. Incluye una capa de **Mapping (Mapeo)** que transforma los datos del Backend (ej. campos en español) a los modelos de dominio del Frontend, protegiendo a la UI de cambios en el contrato del API.

### 2.2 Capa de Orquestación y Hooks (`src/hooks/`)
Utilizamos **TanStack Query (React Query) v5** para gestionar el estado del servidor de forma eficiente:
- **useProducts / useCategories:** Abstraen la lógica de carga, cacheo y estados de error.
- **Invalidación de Caché:** Al registrar un movimiento exitoso, se dispara automáticamente la invalidación de las queries de productos, forzando una actualización reactiva de la UI sin necesidad de recargar la página.
- **StaleTime:** Configuración de tiempos de vida para los datos en caché para reducir el tráfico innecesario a la API.

### 2.3 Capa de Presentación (`src/components/` & `src/App.tsx`)
- **Componentes Modulares:** Organización jerárquica en carpetas por dominio (ej: `inventory`).
- **CSS Modules + SASS:** Uso de arquitectura de **Tokens Neutros** (`styles/config/tokens.scss`) para garantizar un estilo minimalista (Apple-style) consistente y soporte nativo para modo oscuro.

## 3. Estrategia de Despliegue: Docker Multi-stage y Nginx

### Docker Multi-stage
Se implementó un build en dos etapas:
1.  **Etapa de Construcción (Node.js):** Se instalan dependencias y se compila el código a archivos estáticos (HTML, JS, CSS).
2.  **Etapa de Ejecución (Nginx):** Se copian únicamente los archivos finales a una imagen de Nginx altamente optimizada.

### ¿Por qué Nginx?
- **Eficiencia:** Es el estándar de oro para servir contenido estático con bajo consumo de memoria.
- **Seguridad:** Aísla el código fuente y el entorno de construcción, sirviendo solo los activos necesarios en el puerto 80.

## 4. Fuentes Oficiales y Referencias
- **React:** [https://react.dev/](https://react.dev/)
- **TanStack Query:** [https://tanstack.com/query/v5](https://tanstack.com/query/v5)
- **Vite:** [https://vite.dev/](https://vite.dev/)
- **TypeScript:** [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
