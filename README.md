# LibraryFlow

Sistema de gestión bibliotecaria — prueba técnica.

Permite catalogar libros y registrar reservas con control de stock y manejo
seguro de concurrencia (varios usuarios reservando al mismo tiempo no pueden
sobre-reservar el mismo libro).

## Stack

- **Backend:** ASP.NET Core Web API (.NET 8) con arquitectura por capas
  (API · Application · Domain · Infrastructure), Repository Pattern,
  Service Layer, EF Core y manejo de concurrencia con `RowVersion` (optimistic
  locking) + `UPDLOCK, ROWLOCK` (pessimistic locking) y reintento exponencial.
- **Frontend:** React + TypeScript (modo estricto) + Vite + TailwindCSS,
  con custom hooks y polling de stock cada 5s.
- **Base de datos:** SQL Server 2022 (Developer Edition en Docker para dev).
- **Despliegue previsto:** Backend en Render, frontend en Vercel.

## Estructura del repositorio

```
libraryflow/
├── docker-compose.yml      # SQL Server local (Docker)
├── .env.example            # Plantilla de variables (.env real está git-ignored)
├── .editorconfig           # Reglas de formato compartidas
├── backend/                # Solución .NET (se inicializa en Fase 2)
└── frontend/               # App React + Vite (se inicializa en Fase 3)
```

## Setup local

### Prerrequisitos

- Docker Desktop con WSL2 (Windows) o motor nativo (macOS/Linux)
- .NET 8 SDK
- Node.js 18+ y npm
- Git

### 1. Clonar y configurar variables de entorno

```bash
git clone https://github.com/lairofbri/libraryflow.git
cd libraryflow
cp .env.example .env       # Windows PowerShell:  copy .env.example .env
```

Edita `.env` y elige una contraseña SA fuerte (min 8 chars, mayúscula,
minúscula, número, símbolo).

### 2. Levantar SQL Server

```bash
docker compose up -d
docker compose ps          # debe mostrar STATUS = Up ... (healthy)
```

El healthcheck tarda ~30-45s la primera vez en pasar a `healthy`.

### 3. Verificar la conexión

```bash
docker exec -it libraryflow-sqlserver \
  /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "<TU_PASSWORD>" -C \
  -Q "SELECT @@VERSION"
```

Debe imprimir el banner de SQL Server 2022 Developer Edition.

### 4. Backend y frontend

Pendiente — se documenta al cerrar las Fases 2 y 3.

## Comandos útiles de Docker

```bash
docker compose up -d              # Levantar
docker compose ps                 # Estado
docker compose logs -f sqlserver  # Logs en vivo
docker compose stop               # Detener (conserva datos)
docker compose down               # Detener y eliminar contenedor (conserva volumen)
docker compose down -v            # Eliminar TODO incluyendo el volumen de datos
```

## Roadmap por fases

| Fase | Estado | Contenido |
|------|--------|-----------|
| 1 — Base de datos | En progreso | Docker + SQL Server, estructura de carpetas |
| 2 — Backend | Pendiente | .NET 8 API por capas, EF Core, concurrencia, endpoints |
| 3 — Frontend | Pendiente | React + TS + Tailwind, hooks, polling, UI |

## Estrategia de ramas

- `main` solo recibe código revisado y funcional.
- Cada fase trabaja en su propia rama: `feature/phase-1-database`,
  `feature/phase-2-backend`, `feature/phase-3-frontend`.
- Al terminar y revisar la fase, se mergea a `main` y se elimina la rama.

## Licencia

Uso académico / prueba técnica.
