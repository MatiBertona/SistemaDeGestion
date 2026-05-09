# Sistema de Gestión de Stock

Este documento describe la arquitectura, el proceso de diseño y las especificaciones técnicas del sistema de gestión de inventario transaccional.

## Índice

1. [Análisis y Prompts Iniciales](#1-análisis-y-prompts-iniciales)
   - [Pensando el problema](#pensando-el-problema)
   - [Hoja de Ruta de Implementación](#hoja-de-ruta-de-implementación)
2. [Especificaciones de Diseño](#2-especificaciones-de-diseño)
   - [Infraestructura y Orquestación](#infraestructura-y-orquestación)
   - [Base de Datos Relacional](#base-de-datos-relacional)
   - [Dominio de Productos (Arquitectura Hexagonal)](#dominio-de-productos-arquitectura-hexagonal)
   - [Frontend (React + TypeScript)](#frontend-react--typescript)
   - [Interfaz y Experiencia de Usuario (UI/UX)](#interfaz-y-experiencia-de-usuario-uiux)
3. [Resumen de Herramientas y Tecnologías](#3-resumen-de-herramientas-y-tecnologías)
4. [Guía de Construcción y Despliegue](#4-guía-de-construcción-y-despliegue)
   - [1. Clonar el repositorio y configurar el entorno](#1-clonar-el-repositorio-y-configurar-el-entorno)
   - [2. Iniciar en Entorno de Desarrollo (Recomendado)](#2-iniciar-en-entorno-de-desarrollo-recomendado)
   - [3. Iniciar en Entorno de Producción](#3-iniciar-en-entorno-de-producción)
   - [4. Acceso a los Servicios](#4-acceso-a-los-servicios)
   - [5. Ejecución de Pruebas](#5-ejecución-de-pruebas)
5. [Referencias y Documentación](#5-referencias-y-documentación)
6. [Respuestas a Preguntas Conceptuales (Evaluación)](#6-respuestas-a-preguntas-conceptuales-evaluación)

## 1. Análisis y Prompts Iniciales

### Pensando el problema

Tras leer la consigna, me tomé un momento para diagramar el proyecto en su totalidad. Si bien el requerimiento del deploy se engloba dentro del back-end, hago una distinción importante: la infraestructura también debe ser diseñada desde el día uno y no pensada como parte del back-end. Es vital entender cómo se van a comunicar todas las partes involucradas para lograr una integración segura, fluida, rastreable y fácilmente configurable.

Para organizar todo esto, inicié una búsqueda con prompts orientativos en el chat de Gemini. Mi intención era validar mis primeras ideas y corregir el rumbo si mi planteo resultaba ser muy rebuscado, lento, o desproporcionado para el alcance real del proyecto (ya sea definido por mi criterio, el equipo o el cliente), además de mostrarles como implemento el uso de las herramientas de IA en mi dia a dia.

La experiencia (y también la teoria) me ha enseñado que subestimar un proyecto y optar por herramientas "empaquetadas" o demasiado simples suele traer problemas graves de escalabilidad cuando los requerimientos cambian, y el problema no es que cambien, sino que cambien muy rapido. A continuación, adjunto los prompts iniciales que utilicé para guiar estas primeras decisiones, divididos por las áreas del sistema que me parecen necesarias diagramar:

1. Deployment/Orquestación/Infraestructura:
   
   Tengo que diagramar una arquitectura para un sistema de gestión de stock, donde se me pide una base de datos relacional SQL (producto-categoria-movimientos-hitorial) preferentemente postgres sql, Python para el backend, React para el front-end, mi propuesta inicial es hacer uso de Dockerfiles Multi-stage builds para el frontend y el backend, considerado un nginx para el front. Orquestado por un Compose, el mismo tendrá las conexiónes de red    y los volumenes necesarios para los datos/logs/archivos, además de un uso importante del .env y multiples compose.yaml: uno para producción y otro para desarrollo. Inicialización de la base de datos con el script `init.sql` en la       carpeta `basededatos/` para el entorno de desarrollo y/o local.

2. Base de datos:
   
   Tengo que diagramar una base de datos para un sistema de gestión de stock, donde se me pide una base de datos relacional SQL (producto-categoria-movimientos-hitorial) para transacciones en PostgreSQL, con usuarios separados para    desarrollo y producción y permisos diferenciados, para evitar los DELETE en la base de datos de producción. Además, contemplar migraciones (me surge acá recordar sobre migraciones) y volúmenes para asegurar la consistencia de los    datos. Script inicial para correr los contenedores con datos:

   ```sql
   
        -- 1. Crear la tabla de Categorías
       CREATE TABLE categoria (     
           id SERIAL PRIMARY KEY,     
           nombre VARCHAR(100) NOT NULL,     
           descripcion TEXT  );
       -- 2. Crear la tabla de Productos
       CREATE TABLE producto (     
           id SERIAL PRIMARY KEY,     
           nombre VARCHAR(150) NOT NULL,     
           categoria_id INTEGER NOT NULL,     
           precio_unitario NUMERIC(12, 2) NOT NULL DEFAULT 0.00,      stock_actual INTEGER NOT NULL DEFAULT 0,                
           CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE RESTRICT
           );
       -- 3. Crear la tabla de Movimientos
       CREATE TABLE movimiento (     
           id SERIAL PRIMARY KEY,     
           producto_id INTEGER NOT NULL,     
            tipo VARCHAR(10) NOT NULL,
            -- entrada o salida     
           cantidad INTEGER NOT NULL,     
           fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     
           motivo VARCHAR(255),     
           usuario VARCHAR(100),
       CONSTRAINT check_tipo_movimiento          
       CHECK (tipo IN ('entrada', 'salida')),           
       -- Relación con la tabla producto     
       CONSTRAINT fk_producto FOREIGN KEY (producto_id)  REFERENCES producto(id) ON DELETE CASCADE  );
   ```

3. Back End:

   Tengo que diagramar el back-end para un sistema de gestión de stock (productos-categorias-movimientos-historial ) con el uso de Python (Fast-Api). Propongo una estructura del mismo siguiendo Clean Architecture / Arquitectura    Hexagonal separando el núcleo del negocio en el dominio con sus respectivos modelos, repositorios y servicios y el mecanismo de presentación http donde convivan los controllers, request, resources entre otros. Como se trabaja en Fast-   Api con esta estructura?
   En el mismo me proponen un sistema de login donde haya roles, perfiles y contraseñas. Mi propuesta, siguiendo la arquitectura mencionada; implementaria las tablas en la base de datos de usuarios, roles, perfiles con sus respectivas    relaciones. Para las contraseñas usuaria algún metodo de encriptación o hashing ¿Qué alternativas me propones para estó último ? Como puedo proteger los endpoint según el rol del usuario? Se me ocurre plantear a nivel front end un    bloqueo de opciónes, es decir, ciertas opciones serán visibles para ciertos roles, ejemplo: admin podrá ver la opción de borrar, pero un operador no.

4. Front:
   
   Tengo que diagramar el frontend para un sistema de gestión de stock (productos-categorias-movimientos-historial ) con el uso de React o Streamlit. Propongo un entorno contenerizado multi-stage con docker y uso de nginx para tener un servidor de alto rendimiento, aprovechando que es reconocido por su bajo consumo de recursos y gran capacidad para gestionar múltiples conexiones simultáneas sirviendo contenido estático, orquestado con compose con un build tool como vite, react y typescript. Para tener control total de la ui/ux uso de scss. Una creación de tokens.scss a gustos personales o del cliente, para mis gustos personales prefiero estilos minimalistas que respeten las leyes ui/ux.
   Es mejor Streamlit de lo que yo propongo? Por qué?

   Teniendo en cuenta el contexto actual del proyecto, el stack definido y la configuración base ya existente, necesito implementar el dominio de "Gestión de Stock" (Productos, Categorías y Movimientos).
Debes aplicar estrictamente un patrón de Separación de Capas (Services -> Custom Hooks -> Componentes) para no acoplar el estado del servidor en la UI.
Genera el código para la siguiente estructura vertical, asegurando un tipado estricto:
    Tipos (src/types/stock.types.ts): Define las interfaces completas para Product, Category y Movement (tipo de movimiento: entrada/salida, fechas, cantidades), junto con sus DTOs para creación y edición.
    Capa de Servicios (src/services/stock.service.ts): Funciones puras que utilicen la instancia existente de Axios (apiClient) para el CRUD de estas tres entidades. Ninguna de estas funciones debe depender de React.
    Capa de Hooks / Orquestación (src/hooks/useStock.ts o separados por entidad): Crea los custom hooks utilizando TanStack Query (useQuery para lecturas, useMutation para escrituras). Asegúrate de configurar correctamente la invalidación de caché (ej. al registrar un Movement, se debe invalidar la caché de Product para refrescar el stock actual).
    Capa de Presentación (src/features/stock/StockDashboard.tsx o similar): Un componente contenedor principal que consuma estos hooks de forma limpia. Debe manejar los estados isLoading e isError delegados por TanStack Query y renderizar la información utilizando clases CSS, sin lógica de fetching directa ni useEffect.

6. UI/UX:

   Tengo que diagramar la UI/UX para un sistema de gestión de stock (productos-categorias-movimientos-historial ) con el uso de .scss. Propongo un estilo minimalista, que siga un pulido quirurgico, estructura para distintas resoluciones desde dispositivos moviles, tablets y monitores y una estructura de tokens.scss como variables principales que los demás componentes scss tomarán como base para su creación. Los mismos deberan seguir las leyes principales ui/ux, como colores de los semaforos para alertar, llamar la atención o mostras que está todo bien.

### Hoja de Ruta de Implementación

A continuación, detallo el procedimiento técnico seguido para la construcción del sistema, destacando el rol fundamental de Gemini CLI y sus Specialized Skills en la toma de decisiones y ejecución.
Con el repositorio base ya inicializado, el proceso se estructuró en fases incrementales de diseño y ejecución, utilizando la potencia de la CLI para automatizar tareas complejas y garantizar la calidad arquitectónica.

1. Infraestructura y Orquestación Inicial: Una vez implementado el repositorio, procedí a la creación de la base de datos y la configuración del entorno de contenedores:
   - Configuración de Base de Datos: Se definió el esquema inicial en init.sql.
   - Docker Compose: Configuré el archivo compose.yaml integrando PostgreSQL con healthchecks para asegurar que los servicios dependientes solo iniciaran cuando la base de datos estuviera lista.
   - Verificación: Utilicé comandos de la CLI para validar la conectividad y persistencia de los volúmenes de datos.

2. Containerización y Backend Progresivo: Con la infraestructura base operativa, utilicé Gemini CLI para la creación del Dockerfile del backend:
   - Optimización: La CLI generó un Dockerfile multi-stage (builder y runtime) basado en Python 3.11-slim, priorizando la seguridad (usuario no privilegiado) y la eficiencia del tamaño de imagen.
   - Integración: Instancié el backend en el compose.yaml vinculándolo a la red interna y configurando las variables de entorno necesarias para la conexión asíncrona.

3. Arquitectura DDD y Selección de Tecnologías: Una vez que el contenedor del backend estuvo en ejecución, procedí con la implementación de las capas de software:
   - Estructura Hexagonal / DDD: Siguiendo algunas recomendaciones de la CLI en como podia implementar esto en un lenguaje no familiarizado, organicé el código en capas de Domain, Application e Infrastructure etc.
   - Selección de ORM (SQLAlchemy vs. Alternativas): Al venir de un entorno de PHP/Laravel, utilicé la capacidad de investigación de la CLI para comparar SQLAlchemy (con SQLModel) frente a otras alternativas en Python. La conclusión fue
     optar por SQLAlchemy con asyncpg para aprovechar al máximo la programación asíncrona de FastAPI, manteniendo un patrón de repositorio sólido.

4. Frontend y Cierre de Ciclo: Finalmente, repliqué el proceso riguroso para el frontend:
   - Desarrollo: Implementé una Single Page Application (SPA) con React y TypeScript, utilizando SCSS para el diseño visual, tal como se definió en la fase de diseño.
   - Despliegue: Integré el contenedor del frontend en la orquestación global, asegurando la comunicación fluida con la API del backend.
   - Integración: plantie el diseño Services -> Custom Hooks -> Componentes y posteriomente, integré la api al axios, corregi el .env para las urls y corroboré que todo anduviera.
  ---

  Sobre Gemini CLI y sus Skills

  Este proyecto fue desarrollado utilizando Gemini CLI, una herramienta avanzada de ingeniería de software que utiliza agentes especializados llamados Skills. Estos agentes actúan como expertos en áreas específicas del ciclo de vida del
  desarrollo:

   * brainstorming: Utilizado para definir desiciones y debatir las ventajas de por ejemplo SQLAlchemy sobre otras opciones.
   * writing-plans: Empleado para generar planes de implementación paso a paso, asegurando que cada cambio fuera atómico y verificable.
   * executing-plans: El motor que ejecutó las tareas técnicas, desde la escritura de código hasta la configuración de Docker.
   * verification-before-completion: Aplicado rigurosamente antes de dar por finalizada cada fase, garantizando que los contenedores levantaran correctamente y los tests pasaran.

  Para más información sobre estas herramientas, pueden consultar la documentación oficial de Gemini CLI Skills [(https://github.com/google/gemini-cli).](https://github.com/obra/superpowers)


## 2. Especificaciones de Diseño

### Infraestructura y Orquestación

Podés ver los detalles en la [Documentación de la infraestructura](./docs/diseño-infraestructura.md).

### Base de Datos Relacional

Podés ver los detalles en la [Documentación de la base de datos](./docs/diseño-base-de-datos.md).

### Dominio de Productos (Arquitectura Hexagonal)

Podés ver los detalles en la [Documentación del Backend](./docs/diseño-backend.md).

### Frontend (React + TypeScript)

Podés ver los detalles en la [Documentación del Frontend](./docs/diseño-frontend.md).

### Interfaz y Experiencia de Usuario (UI/UX)

Podés ver los detalles en la [Documentación de UI/UX](./docs/diseño-ui-ux.md).

## 3. Resumen de Herramientas y Tecnologías

El sistema utiliza las siguientes herramientas para garantizar un entorno profesional:

- **Backend:** Python 3.11, FastAPI, SQLAlchemy 2.0 (Async).
- **Base de Datos:** PostgreSQL 15.
- **Frontend:** React, TypeScript, Vite.
- **Estilos:** SCSS con arquitectura de tokens.
- **Infraestructura:** Docker, Docker Compose, Nginx.
- **Calidad de Código:** Pytest para pruebas unitarias en el backend.

## 4. Guía de Construcción y Despliegue

El entorno está totalmente automatizado con Docker y soporta configuraciones específicas por entorno.

### 1. Clonar el repositorio y configurar el entorno

```bash
cp .env.example .env
```

### 2. Iniciar en Entorno de Desarrollo (Recomendado)

Incluye **Hot Reload** del código y exposición de la base de datos (puerto `5432`) para herramientas locales.

```bash
docker compose -f compose.yaml -f compose.dev.yaml up -d --build
```

### 3. Iniciar en Entorno de Producción

Configuración optimizada y segura (base de datos aislada, sin volúmenes de desarrollo).

```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d --build
```

### 4. Acceso a los Servicios

Una vez iniciados los contenedores, los servicios estarán disponibles en:

- **Backend API:** http://localhost:8000
- **Documentación interactiva (Swagger):** http://localhost:8000/docs
- **Frontend (Desarrollo):** http://localhost:5173
- **Frontend (Producción):** http://localhost:80

### 5. Ejecución de Pruebas

Para ejecutar las pruebas unitarias dentro del contenedor:

```bash
docker compose exec backend pytest
```

## 5. Referencias y Documentación

https://es.vite.dev/guide/

https://www.ovhcloud.com/es/learn/what-is-nginx/

https://docs.docker.com/build/building/multi-stage/

https://docs.docker.com/compose/

https://fastapi.tiangolo.com/

https://docs.streamlit.io/get-started/fundamentals/main-concepts

https://es.react.dev/

https://www.godaddy.com/resources/latam/tecnologia/log-que-es

https://lawsofux-com.translate.goog/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc

## 6. Respuestas a Preguntas Conceptuales (Evaluación)

A continuación se detallan las decisiones arquitectónicas y técnicas tomadas durante el desarrollo, respondiendo a los puntos de la evaluación:

### 1. Base de Datos
*   **Elección de DB:** Se seleccionó **PostgreSQL**. Es la opción estándar de la industria por su robustez, soporte de integridad referencial y rendimiento asíncrono.
*   **Uso de ORM:** Se utilizó **SQLAlchemy 2.0 (Async)**.
    *   *Ventajas:* Prevención de SQL Injection, facilidad de migraciones, tipado fuerte y desacoplamiento mediante el patrón Repository.
    *   *Desventajas:* Sobrecarga en queries extremadamente complejas (mitigado permitiendo SQL crudo si es necesario).
*   **Garantía de Stock No Negativo:** Implementada mediante una doble validación:
    1.  **Nivel DB:** `CheckConstraint` en la tabla `producto` (`stock_actual >= 0`).
    2.  **Nivel Aplicación:** Validación en `RegistrarMovimientoService` antes de persistir la transacción.
*   **Convivencia del Stack:** El ORM mapea modelos a entidades de dominio. Se recomienda el uso de **Alembic** para el versionado del esquema en entornos reales.

### 2. Backend (Arquitectura y Seguridad)
*   **Patrón:** **Arquitectura Hexagonal**. Desacopla la lógica de negocio (Dominio) de la infraestructura (FastAPI/SQLAlchemy), facilitando el mantenimiento y testing.
*   **Deploy:** Sistema completamente **Dockerizado**. Paridad entre entornos mediante `compose.dev.yaml` y `compose.prod.yaml`.
*   **Seguridad:**
    *   **CORS:** Configurado quirúrgicamente en `main.py` para permitir solo el origen del frontend.
    *   **Contraseñas:** (Propuesta) Hashing con **Bcrypt/Argon2** y autenticación vía **JWT**.
    *   **Roles:** Protección de endpoints mediante dependencias de FastAPI inyectando permisos según el rol del usuario.

### 3. Frontend (Tecnología y UX)
*   **¿Por qué React?** Ofrece control total sobre el ciclo de vida, rendimiento optimizado y permite un sistema de diseño a medida con **TanStack Query** para la gestión de estado de servidor.
*   **Arquitectura de Estilos:** Sistema de **Tokens Premium** con jerarquía de elevación multi-capa y gradientes semánticos. Organización quirúrgica de archivos para escalabilidad y soporte nativo de **Modo Oscuro**.
*   **Analítica de Datos:** El Dashboard no solo visualiza, sino que procesa información:
    *   **Risk Index:** Algoritmo que calcula la criticidad de la operación en tiempo real.
    *   **Operational Capacity:** Análisis porcentual de ocupación de almacén por SKU.
*   **UX Operativa:** Implementación de **Acciones Rápidas (Dropdowns)**, **Drawer Lateral** para análisis profundo y **Validaciones en tiempo real** para una experiencia fluida y profesional.

### 4. Uso de Inteligencia Artificial (Gemini CLI)
*   **Potenciación:** La IA actuó como un copiloto de ingeniería, acelerando la curva de aprendizaje en FastAPI y SQLAlchemy.
*   **Refactorización:** Permitió ejecutar refactors quirúrgicos (modularización de componentes, mapeo de servicios) garantizando el cumplimiento de principios SOLID y Clean Code.
*   **Decisión Estratégica:** Facilitó la transición de una mentalidad monolítica a una arquitectura por capas limpia y desacoplada.

### 5. Historial de Cambios (Auditoría)
*   **Estrategia:** Para cambios en campos críticos (como precio o nombre), utilizaría una tabla separada de auditoría (ej. `producto_auditoria`). Guardar estos cambios en la misma tabla ensucia el modelo, y en sistemas externos de logeo se pierde la integridad referencial y la capacidad de realizar consultas relacionales fácilmente.
*   **Estructura:** La tabla guardaría `producto_id`, `campo_modificado`, `valor_anterior`, `valor_nuevo`, `usuario_id` y `fecha`. Se alimentaría mediante *Triggers* en la base de datos para asegurar consistencia, o en la capa de aplicación (Servicios) si se requiere enriquecer con contexto de negocio adicional.

### 6. Escalabilidad (500.000 productos y miles de movimientos)
*   **Rendimiento de Búsqueda:** Implementaría particionamiento (Table Partitioning) de la tabla de movimientos por rango de fechas (ej. mensual o trimestral) para evitar que la tabla principal crezca indefinidamente en lecturas pesadas.
*   **Stock Histórico:** En lugar de recalcular los movimientos desde el día cero (lo cual sería insostenible), implementaría **Snapshots de Stock** (cierres de inventario mensuales/diarios) en una tabla auxiliar. Para saber el stock de una fecha pasada, se tomaría el último snapshot anterior a la fecha objetivo y se le aplicarían/sumarían solo los movimientos intermedios.
*   **Caché:** Uso de bases de datos en memoria (ej. Redis) para lecturas rápidas del catálogo de productos activos y su stock actual.

### 7. Logs del Sistema
*   **Eventos a registrar:** Errores no controlados (500), latencia de endpoints, fallos de autenticación, y excepciones de negocio puras (ej. "intento de movimiento con stock negativo o no autorizado").
*   **Almacenamiento:** Archivos de texto estructurado (JSON logs) recolectados por agentes (ej. Filebeat, Promtail) y enviados a un sistema centralizado de observabilidad (ELK Stack, Datadog, Grafana Loki).
*   **Diferenciación:** La auditoría de stock (los movimientos y cambios de producto) pertenece al modelo de negocio y se guarda en la base relacional transaccional. Los logs de aplicación son de naturaleza inmutable, masivos y técnicos, su ciclo de vida es diferente (rotación y expiración corta), por lo que van a sistemas especializados y no a la base de datos principal.

### 8. Alerta de Stock Bajo (Umbrales y UX)
*   **Definición de Umbral:** Debe ser configurable a nivel de producto (`min_stock`), con un valor *fallback* o por defecto en la categoría. 
*   **Cambios en el Modelo de Datos:** Ya contamos con `min_stock` a nivel producto. Se podría añadir `min_stock_default` en la tabla `categoria` para soportar la herencia de configuración si el producto no define uno.
*   **Consideraciones de UX (Para evitar fatiga de alertas):**
    *   No utilizar modales o pop-ups intrusivos (ej. `alert()` nativo del navegador) que interrumpan el flujo de trabajo del usuario.
    *   Agrupar notificaciones en un centro de alertas o badge en el panel de navegación (ej. "N productos críticos").
    *   Añadir un estado lógico de "En Reposición / Compra en Proceso" para permitirle al usuario silenciar o "marcar como atendidas" las alertas de productos que ya están siendo gestionados por el área de compras, reduciendo el ruido visual.

