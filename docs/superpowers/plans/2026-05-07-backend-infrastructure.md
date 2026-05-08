# Plan de Implementación: Infraestructura Back-end (Docker Multi-stage)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configurar el entorno Docker para un servicio FastAPI utilizando un build multi-stage e integrarlo en el Docker Compose existente.

**Architecture:** Docker multi-stage (Builder/Runtime), FastAPI, Docker Compose con Healthchecks.

**Tech Stack:** Docker, Python 3.11, FastAPI.

---

### Task 1: Preparación del Directorio y Dependencias

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/main.py` (App mínima para prueba)

- [ ] **Step 1: Crear el directorio backend**
```bash
mkdir -p backend
```

- [ ] **Step 2: Crear requirements.txt**
```text
fastapi==0.104.1
uvicorn[standard]==0.24.0.post1
sqlalchemy[asyncio]==2.0.23
asyncpg==0.29.0
pydantic-settings==2.1.0
```

- [ ] **Step 3: Crear main.py (Smoke Test)**
```python
from fastapi import FastAPI

app = FastAPI(title="Inventory API")

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "backend"}
```

- [ ] **Step 4: Commit**
```bash
git add backend/
git commit -m "chore: initialize backend directory with dependencies and smoke test app"
```

### Task 2: Dockerfile Multi-stage

**Files:**
- Create: `backend/Dockerfile`

- [ ] **Step 1: Crear el Dockerfile**
Implementar las etapas de Builder y Runtime.

```dockerfile
# Stage 1: Builder
FROM python:3.11-slim as builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Crear usuario no privilegiado
RUN adduser --disabled-password --gecos "" appuser

# Copiar entorno virtual desde el builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copiar código fuente
COPY . .

# Cambiar permisos al usuario appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 2: Commit**
```bash
git add backend/Dockerfile
git commit -m "feat: add multi-stage Dockerfile for backend"
```

### Task 3: Integración en Docker Compose

**Files:**
- Modify: `compose.yaml`

- [ ] **Step 1: Agregar Healthcheck al servicio db**
Modificar el servicio existente en `compose.yaml`.

- [ ] **Step 2: Agregar el servicio backend**
Configurar el build y las dependencias.

```yaml
# Fragmento a integrar en compose.yaml
services:
  db:
    # ... (configuración existente)
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
    container_name: inventario_backend_container
    restart: always
    environment:
      - DATABASE_URL=postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - inventory_network
```

- [ ] **Step 3: Validar y Commit**
```bash
docker compose config
git add compose.yaml
git commit -m "feat: integrate backend service and database healthcheck in compose"
```

### Task 4: Verificación del Entorno

- [ ] **Step 1: Construir y Levantar**
```bash
docker compose build backend
docker compose up -d
```

- [ ] **Step 2: Probar API**
```bash
curl http://localhost:8000/health
```
Expected: `{"status": "ok", "service": "backend"}`

- [ ] **Step 3: Commit de verificación**
```bash
git commit --allow-empty -m "test: verify backend infrastructure and connectivity"
```
