# Especificación de Diseño: Front-end (React + TypeScript)

Este documento justifica las decisiones técnicas tomadas para la capa de presentación del sistema de inventario.

## 1. ¿Por qué React y no Streamlit?
Aunque Streamlit permite crear interfaces rápidas en Python, para un sistema de gestión transaccional se optó por React por las siguientes razones:
- **Control y Escalabilidad:** React permite un control total sobre el estado de la aplicación y la interfaz de usuario (UI), permitiendo crear componentes complejos y reutilizables.
- **Rendimiento:** Al ser una Single Page Application (SPA), la carga de procesamiento ocurre en el navegador del cliente. Streamlit, por el contrario, re-ejecuta el script de servidor en cada interacción, lo que no escala bien con muchos usuarios.
- **Ecosistema:** React posee el ecosistema de librerías de componentes (UI) y gestión de estado más grande del mercado.

## 2. ¿Por qué TypeScript (TS) en lugar de JavaScript (JS)?
Para un proyecto de nivel profesional, TS es el estándar por:
- **Seguridad de Tipado:** Detecta errores en tiempo de compilación (ej. pasar un string donde se espera un número de stock), reduciendo bugs en producción.
- **Autocompletado y Mantenibilidad:** Facilita el trabajo en equipo y la navegación por el código gracias a la definición clara de interfaces para los datos que vienen del Backend.

## 3. ¿Por qué Vite?
Vite ha reemplazado a herramientas tradicionales como Create-React-App/Webpack por ser:
- **Instantáneo:** Utiliza módulos ES nativos en el navegador para un desarrollo extremadamente rápido.
- **Configuración Moderna:** Genera bundles de producción mucho más pequeños y optimizados.

## 4. Estrategia de Despliegue: Docker Multi-stage y Nginx

### Docker Multi-stage
Se implementó un build en dos etapas para optimizar la imagen final:
1.  **Etapa de Construcción (Node.js):** Se instalan dependencias y se compila el código TS a archivos estáticos (HTML, JS, CSS). Las herramientas de desarrollo pesadas se quedan en esta capa.
2.  **Etapa de Ejecución (Nginx):** Se copian solo los archivos compilados a una imagen limpia de Nginx.

### ¿Por qué Nginx?
- **Eficiencia:** Nginx es uno de los servidores web más rápidos del mundo para servir contenido estático.
- **Ligereza:** La imagen final es significativamente más pequeña comparada con una que incluya Node.js en tiempo de ejecución.
- **Seguridad:** Reduce la superficie de ataque al no exponer el entorno de ejecución de Node.js al exterior.

## 5. Fuentes Oficiales y Referencias
Para profundizar en las bondades de estas tecnologías, se consultó la documentación oficial:
- **React:** [https://react.dev/](https://react.dev/) - "The library for web and native user interfaces."
- **Vite:** [https://vitejs.dev/](https://vitejs.dev/) - "Next Generation Frontend Tooling."
- **TypeScript:** [https://www.typescriptlang.org/](https://www.typescriptlang.org/) - "JavaScript with syntax for types."
- **Nginx (Docker Hub):** [https://hub.docker.com/_/nginx](https://hub.docker.com/_/nginx) - "Official build of Nginx."
- **FastAPI (Referencia para integración):** [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
