# LibraryFlow 📚

Sistema de gestión bibliotecaria que permite consultar el catálogo de libros, realizar reservas y garantizar la integridad del inventario bajo concurrencia.

## 🔗 Despliegue en vivo

| Servicio | URL |
|----------|-----|
| Frontend | https://libraryflow.vercel.app |
| Backend API | https://libraryflow.onrender.com |
| API Docs | https://libraryflow.onrender.com/scalar/v1 (solo en Development) |
| Base de datos | PostgreSQL en Railway |

---

## 🏗️ Decisiones Arquitectónicas

### Arquitectura por capas
El backend está dividido en 4 proyectos con responsabilidades claras:

- **LibraryFlow.Domain** — Entidades puras (`Book`, `Reservation`). Sin dependencias externas.
- **LibraryFlow.Application** — Interfaces, DTOs y servicios con lógica de negocio. No depende de EF Core.
- **LibraryFlow.Infrastructure** — Implementaciones de repositorios, DbContext y UnitOfWork.
- **LibraryFlow.API** — Controllers, Middleware y configuración.

### Estrategia de concurrencia
Para evitar sobre-reservas cuando múltiples usuarios intentan reservar el último ejemplar simultáneamente se implementaron dos capas:

1. **Pessimistic locking** — `SELECT ... FOR UPDATE` dentro de una transacción explícita. Bloquea la fila a nivel de base de datos durante toda la operación.
2. **Optimistic locking** — Campo `Version` como token de concurrencia. Si dos transacciones modifican el mismo registro, EF Core lanza `DbUpdateConcurrencyException`.
3. **Retry con backoff exponencial** — Máximo 3 reintentos con espera de 200ms, 400ms antes de devolver `409 Conflict`.

### Repository Pattern + UnitOfWork
Los repositorios abstraen el acceso a datos. El `UnitOfWork` gestiona las transacciones sin exponer EF Core hacia las capas superiores.

### Middleware global de errores
Todas las excepciones son capturadas por `ErrorHandlingMiddleware` y devueltas con formato consistente:
```json
{
  "title": "Operación no permitida",
  "status": 409,
  "detail": "El libro no tiene stock disponible."
}
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite + TailwindCSS |
| Backend | ASP.NET Core Web API (.NET 10) |
| ORM | Entity Framework Core 9 + Npgsql |
| Base de datos | PostgreSQL (Railway) |
| Deploy backend | Render (Docker) |
| Deploy frontend | Vercel |

---

## 🚀 Ejecución Local

### Prerequisitos
- Node.js 22.12+
- .NET 10 SDK
- Docker Desktop
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/lairofbri/libraryflow.git
cd libraryflow
```

### 2. Levantar SQL Server local (opcional)
```bash
cp .env.example .env
# Edita .env con tu password deseado
docker-compose up -d
```

### 3. Configurar el backend
```bash
cd backend/LibraryFlow.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "TU_CONNECTION_STRING"
cd ..
dotnet run --project LibraryFlow.API/LibraryFlow.API.csproj
```

El servidor arranca en `http://localhost:5066` y aplica las migraciones automáticamente.

### 4. Configurar el frontend
```bash
cd frontend
cp .env.example .env.local
# Edita .env.local: VITE_API_URL=http://localhost:5066
npm install
npm run dev
```

El frontend arranca en `http://localhost:5173`.

---

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/books` | Obtener todos los libros |
| POST | `/api/books` | Crear un libro |
| GET | `/api/reservations` | Historial de reservas |
| POST | `/api/reservations` | Crear una reserva |

### Ejemplo — Crear reserva
```bash
curl -X POST https://libraryflow.onrender.com/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"bookId": 1, "userName": "raul.marroquin"}'
```

---

## 🌿 Estrategia de Ramas

| Rama | Propósito |
|------|-----------|
| `main` | Código revisado y funcional |
| `feature/phase-N-NAME` | Desarrollo de cada fase |

Cada fase se desarrolla en su rama, se prueba, se mergea a `main` con `--no-ff` y se elimina.