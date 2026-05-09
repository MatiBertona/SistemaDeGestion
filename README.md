# Sistema de Gestión de Stock

Este documento describe la arquitectura, el proceso de diseño y las especificaciones técnicas del sistema de gestión de inventario transaccional.

## Índice

1. [Análisis y Prompts Iniciales](#1-análisis-y-prompts-iniciales)
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

La experiencia (y también la teoria) me ha enseñado que subestimar un proyecto y optar por herramientas "empaquetadas" o demasiado simples suele traer problemas graves de escalabilidad cuando los requerimientos cambian. A continuación, adjunto los prompts iniciales que utilicé para guiar estas primeras decisiones, divididos por las áreas claves del sistema:

1. Deployment/Orquestación/Infraestructura:

   Tengo que diagramar una arquitectura para un sistema de gestión de stock, donde se me pide una base de datos relacional SQL (producto-categoria-movimientos-hitorial) preferentemente postgres sql, un back-end preferentemente Python,    front-end preferentemente React, mi propuesta inicial es hacer uso de Dockerfiles Multi-stage builds para el frontend y el backend, considerado un nginx para el front. Orquestado por un Compose, el mismo tendrá las conexiónes de red    y los volumenes necesarios para los datos/logs/archivos, además de un uso importante del .env y multiples compose.yaml: uno para producción y otro para desarrollo. Inicialización de la base de datos con el script `init.sql` en la       carpeta `basededatos/` para el entorno de desarrollo y/o local.

2. Base de datos:

Tengo que diagramar una base de datos para un sistema de gestión de stock, donde se me pide una base de datos relacional SQL (producto-categoria-movimientos-hitorial) para transacciones en PostgreSQL, con usuarios separados para desarrollo y producción y permisos diferenciados, para evitar los DELETE en la base de datos de producción. Además, contemplar migraciones (me surge acá recordar sobre migraciones) y volúmenes para asegurar la consistencia de los datos. Script inicial para correr los contenedores con datos:

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

Tengo que diagramar el back-end para un sistema de gestión de stock (productos-categorias-movimientos-historial ) con el uso de Python (Fast-Api). Propongo una estructura del mismo siguiendo Clean Architecture / Arquitectura Hexagonal separando el núcleo del negocio en el dominio con sus respectivos modelos, repositorios y servicios y el mecanismo de presentación http donde convivan los controllers, request, resources entre otros. Como se trabaja en Fast-Api con esta estructura?
En el mismo me proponen un sistema de login donde haya roles, perfiles y contraseñas. Mi propuesta, siguiendo la arquitectura mencionada; implementaria las tablas en la base de datos de usuarios, roles, perfiles con sus respectivas relaciones. Para las contraseñas usuaria algún metodo de encriptación o hashing ¿Qué alternativas me propones para estó último ? Como puedo proteger los endpoint según el rol del usuario? Se me ocurre plantear a nivel front end un bloqueo de opciónes, es decir, ciertas opciones serán visibles para ciertos roles, ejemplo: admin podrá ver la opción de borrar, pero un operador no.

4. Front:

Tengo que diagramar el frontend para un sistema de gestión de stock (productos-categorias-movimientos-historial ) con el uso de React o Streamlit. Propongo un entorno contenerizado multi-stage con docker y uso de nginx para tener un servidor de alto rendimiento, aprovechar el uso del proxy inverso y balanceador de carga de código abierto, y como intermediario seguro (proxy) para redirigir peticiones a un servidor backend y orquestado con compose con un build tool como vite, react y typescript. Para tener control total de la ui/ux uso de scss, para aprovechar nginx que es reconocido por su bajo consumo de recursos y gran capacidad para gestionar múltiples conexiones simultáneas. Una creación de tokens.scss a gustos personales o del cliente, para mis gustos personales prefiero estilos minimalistas que respeten las leyes ui/ux
Es mejor Streamlit de lo que yo propongo? Por qué?

5. UI/UX:

Tengo que diagramar la UI/UX para un sistema de gestión de stock (productos-categorias-movimientos-historial ) con el uso de .scss. Propongo un estilo minimalista, que siga un pulido quirurgico, estructura para distintas resoluciones desde dispositivos moviles, tablets y monitores y una estructura de tokens.scss como variables principales que los demás componentes scss tomarán como base para su creación. Los mismos deberan seguir las leyes principales ui/ux, como colores de los semaforos para alertar, llamar la atención o mostras que está todo bien.

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
- **Frontend:** http://localhost:80

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

A continuación se responden las preguntas teóricas planteadas en la consigna de evaluación:

### 1. Base de Datos
*   **¿Por qué elegir PostgreSQL?** Se eligió por ser un motor relacional robusto, de código abierto, con excelente cumplimiento ACID y capacidades avanzadas (como soporte nativo para JSON, crucial si los requerimientos de productos se vuelven dinámicos). Es el estándar de facto para sistemas transaccionales serios.
*   **Uso de ORM (Ventajas/Desventajas):** Sí, se utiliza SQLAlchemy.
    *   *Ventajas:* Acelera el desarrollo, abstrae las consultas SQL evitando inyecciones (SQL Injection), y facilita el mapeo directo a objetos de dominio (Entities) mediante Arquitectura Hexagonal.
    *   *Desventajas:* Curva de aprendizaje inicial, y en consultas *muy* masivas o reportes complejos, el ORM puede generar SQL menos eficiente que un query crudo optimizado (aunque SQLAlchemy permite bajar a SQL crudo si es necesario).
*   **Evitar Stock Negativo:** La primera capa de defensa es la lógica de negocio en el Backend, pero la garantía real (la "última frontera") se define en la base de datos mediante un constraint explícito: `CONSTRAINT chk_stock_positivo CHECK (stock_actual >= 0)`.
*   **Convivencia del Stack:** El ORM convive con el código de aplicación (FastAPI). Para el versionado de la estructura de la base de datos se utilizaría una herramienta de migraciones (como **Alembic**, que es parte del ecosistema de SQLAlchemy), garantizando que los cambios de esquema se apliquen de forma controlada en los distintos entornos. En este MVP inicial, la estructura base se carga mediante un script `init.sql` montado en el contenedor.

### 2. Historial de Cambios y Escalabilidad
*   **Auditoría de cambios (Nombre/Precio):** No guardaría la auditoría en la misma tabla del producto. Utilizaría una tabla dedicada (ej. `producto_auditoria`) o implementaría un enfoque de *Event Sourcing*, donde cada evento ("PrecioCambiado", "NombreModificado") se inserta en un log inmutable de base de datos.
*   **Escalar a 500,000 productos y miles de movimientos:**
    *   *Base de datos:* Implementaría **particionamiento de tablas** para `movimientos` (ej. particiones mensuales) para evitar que la tabla crezca infinitamente afectando el rendimiento de inserción.
    *   *Caché:* Integraría **Redis** delante de la base de datos para almacenar temporalmente el listado de productos y su stock actual, ya que las lecturas serán mucho más frecuentes que las escrituras.
    *   *Stock Histórico:* Para consultar el stock en una fecha pasada de forma eficiente, crearía un sistema de *Snapshots* (ej. guardar una foto del stock de cada producto al cierre de cada mes) y para consultar una fecha específica, tomaría el snapshot más cercano y le sumaría/restaría solo los movimientos de esos días de diferencia.

### 3. Backend (Decisiones y Seguridad)
*   **Deploy:** Dockerizado. Empaquetar la aplicación y sus dependencias (Vite/Nginx para front, FastAPI para back, Postgres para DB) en contenedores garantiza que funcione igual en local y en la nube (AWS/GCP).
*   **Seguridad y Roles:** Implementaría autenticación basada en **JWT (JSON Web Tokens)**. Los roles (Admin, Operador) se guardan en la base de datos y se adjuntan como *claims* dentro del payload del token.
*   **Protección de Endpoints:** Mediante dependencias de FastAPI (Decoradores de autorización), interceptando la petición, validando la firma del JWT y comprobando si el rol del usuario tiene el permiso necesario antes de ejecutar el controlador.
*   **Contraseñas:** **Nunca** se guardan en texto plano. Se utilizaría un algoritmo de hashing fuerte con salt, como **Bcrypt** o **Argon2** (vía la librería `passlib` en Python).
*   **Logs vs Auditoría:** Los logs de aplicación (errores técnicos, tiempos de respuesta, HTTP 500) irían a la salida estándar del contenedor (stdout) y serían recolectados por un sistema como Datadog o ELK, utilizando **Grafana** para la visualización y alertas de métricas críticas. Esto es diferente a la auditoría de negocio (quién movió stock), que vive estructurada en tablas relacionales para ser consultada por los usuarios desde la interfaz.

### 4. Frontend (Elección de Tecnología)
*   **¿React o Streamlit?** Elegí **React**.
*   **Contexto de uso:** Streamlit es excelente para prototipos rápidos de Data Science, paneles internos simples o cuando el equipo solo domina Python. Sin embargo, para un sistema transaccional robusto, React permite crear una **Single Page Application (SPA)** escalable, con control absoluto del ciclo de vida de los componentes, la gestión del estado global y el rendimiento (la carga gráfica recae en el cliente y no en el servidor).
*   **Sacrificios:** Al elegir React, sacrifiqué la "velocidad de construcción inicial" y la simplicidad de tener todo en un solo lenguaje (Python), asumiendo el costo de mantener un repositorio separado, configurar Node/Vite y manejar llamadas asíncronas HTTP hacia la API.

### 5. Uso de Inteligencia Artificial
*   **Herramienta usada:** Se utilizó **Gemini CLI**, una herramienta de inteligencia artificial integrada en la terminal.
*   **Propósito puntual:**
    *   **Adaptación Técnica:** El **CLI de Gemini** fue fundamental para facilitar la transición y adaptación a **FastAPI**. Viniendo de un entorno más familiarizado con **Laravel** y su sintaxis de Eloquent (ej. `with()->where()->`), la IA actuó como un guía experto para traducir esos conceptos a **SQLAlchemy** y los patrones asíncronos de Python.
    *   **Orquestación de Tareas:** Se utilizó para la gestión de la estructura de archivos, generación de *boilerplates* de Docker (Dockerfile multi-stage, docker-compose) y refactorización de código en tiempo real.
    *   **Documentación Técnica:** Generación y refinamiento de documentos Markdown asegurando coherencia técnica y profesionalismo.
*   **Experiencia del Desarrollador:** La organización de carpetas y la orquestación con Docker resultaron ser conceptos familiares y accesibles, lo que permitió que la transición a Python fuera fluida. En todo momento, el CLI sirvió como un copiloto que orientó y guio el proyecto hacia la dirección deseada, permitiendo mantener el control creativo y arquitectónico mientras se aceleraba la curva de aprendizaje.
*   **Cambio de decisión:** Inicialmente, el chat sugería usar scripts locales `.ini` para inicializar la base de datos. Sin embargo, a través del **CLI de Gemini**, decidimos cambiar el rumbo y aprovechar las capacidades nativas de PostgreSQL en Docker (montando el `init.sql` directamente en el contenedor), eliminando así la necesidad de ejecutar comandos manuales en el entorno local del desarrollador.
