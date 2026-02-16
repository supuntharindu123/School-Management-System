# School Management System

A full-stack School Management System with an ASP.NET Core backend and a React + Vite frontend. It manages users, classes, subjects, exams, grades, marks, promotions, attendance, and more.

## Tech Stack

- Backend: ASP.NET Core `net10.0`, Entity Framework Core (SQL Server), JWT Auth, Swagger
- Frontend: React 19, Vite 7, Tailwind CSS 4, Redux Toolkit, React Router
- Database: SQL Server

## Prerequisites (Windows)

- .NET SDK 10.0
- SQL Server (LocalDB or full instance)
- Node.js 18+ (Node 20 LTS recommended) and npm
- EF Core CLI (optional but recommended):

```powershell
# Install EF tools once globally
dotnet tool install --global dotnet-ef
```

## Project Structure

```
Backend/           # ASP.NET Core Web API
frontend/          # React + Vite web app
```

Key backend files:
- `Backend/appsettings.json` and `Backend/appsettings.Development.json`: configuration (connection strings, JWT, etc.)
- `Backend/Data/AppDbContext.cs`: EF Core DbContext
- `Backend/Controllers/*`: API endpoints
- `Backend/Migrations/*`: EF migrations history

Key frontend files:
- `frontend/src`: React app source
- `frontend/vite.config.js`: Vite configuration

## Getting Started

### 1) Backend API (ASP.NET Core)

1. Configure SQL Server connection string in:
   - `Backend/appsettings.Development.json` (for local dev)
   - Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SchoolDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

2. Restore, apply migrations, and run:

```powershell
# From the repository root or Backend/ directory
cd Backend

# Restore packages
dotnet restore

# Apply database migrations
# Requires dotnet-ef (see prerequisites)
dotnet ef database update

# Run the API (watch for URLs in the console output)
dotnet run
```

- Swagger/OpenAPI is enabled. Once running, open the Swagger UI at the URL shown in the console (commonly `http://localhost:5000/swagger` or similar).

### 2) Frontend (React + Vite)

1. Install dependencies and start the dev server:

```powershell
cd frontend
npm install
npm run dev
```

2. Build and preview production:

```powershell
npm run build
npm run preview
```

### 3) Frontend → Backend API URL

- If the frontend needs a custom API base URL, add an `.env.local` in `frontend/`:

```
VITE_API_URL=http://localhost:5000
```

- Adjust to match your backend port printed by `dotnet run`.

## Common Tasks

- Generate a new EF migration:

```powershell
cd Backend
# Example: add a migration describing the change
dotnet ef migrations add AddNewFeature
# Update the database
dotnet ef database update
```

- Lint the frontend:

```powershell
cd frontend
npm run lint
```

## Troubleshooting

- EF CLI not found: install with `dotnet tool install --global dotnet-ef`.
- SQL connection errors: verify `DefaultConnection` points to a reachable SQL Server; add `TrustServerCertificate=True` for local dev.
- Port conflicts: ASP.NET Core Kestrel may select different ports; check the console output for actual URLs.

## Notes

- This repository already contains multiple migrations under `Backend/Migrations`. Running `dotnet ef database update` should create/update the database schema.
- JWT authentication is configured; ensure tokens are provided when calling protected endpoints.

---

If you want, I can wire up a `.env.local` in `frontend/` and verify the API URL with a quick health check component.
