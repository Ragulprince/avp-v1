
# AVP Academy - Full Stack EdTech Platform

A comprehensive educational technology platform built with React, Node.js, PostgreSQL, and Docker.

## 🏗️ Architecture

```
avp-academy/
├── web/                    # React Frontend (Vite + TypeScript)
│   ├── src/               # Source code
│   ├── package.json       # Web dependencies
│   ├── node_modules/      # Web node modules
│   ├── Dockerfile         # Web container configuration
│   ├── docker-compose.yml # Web service
│   └── Makefile          # Web commands
├── backend/               # Node.js API (Express + TypeScript)
│   ├── src/               # Source code
│   ├── prisma/            # Database schema and migrations
│   ├── package.json       # Backend dependencies
│   ├── node_modules/      # Backend node modules
│   ├── Dockerfile         # Backend container configuration
│   ├── docker-compose.yml # Backend + DB services
│   └── Makefile          # Backend commands
├── Makefile              # Root commands for both services
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Make (optional, for easier commands)
- Node.js 18+ (for local development)

### 1. Setup Everything

```bash
# Clone and setup
git clone <repository-url>
cd avp-academy

# Setup network and install dependencies
make setup

# Run both services
make run-all
```

### 2. Individual Service Commands

**Backend Only (includes PostgreSQL, Redis, Adminer):**
```bash
cd backend
make run
```

**Web Only:**
```bash
cd web
make run
```

## 📋 Available Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React application |
| Backend API | http://localhost:3000 | Express API server |
| Adminer | http://localhost:8080 | Database management |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |

## 🛠️ Development Commands

### Root Commands (from project root)

```bash
make setup          # Initial setup with network and dependencies
make run-all         # Start both web and backend
make run-web         # Start only web service
make run-backend     # Start only backend service
make stop-all        # Stop all services
make clean-all       # Clean all containers and volumes
make install-all     # Install dependencies for both services
```

### Web Commands (from web/ directory)

```bash
make install         # Install dependencies
make run            # Start development server
make run-detached   # Start in background
make build          # Build for production
make stop           # Stop service
make clean          # Clean containers
make logs           # View logs
make shell          # Access container shell
```

### Backend Commands (from backend/ directory)

```bash
make install         # Install dependencies
make run            # Start all backend services
make run-detached   # Start in background
make build          # Build for production
make stop           # Stop all services
make clean          # Clean containers and volumes
make logs           # View all logs
make logs-backend   # View backend logs only
make logs-db        # View database logs only
make shell          # Access backend container shell
make db-reset       # Reset database (removes all data)
make db-seed        # Seed database with sample data
make db-migrate     # Run database migrations
make db-studio      # Open Prisma Studio
```

## 🔧 Database Management

**Using Adminer (Recommended):**
- Access: http://localhost:8080
- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: password
- Database: avp_academy

**Using Make Commands:**
```bash
cd backend
make db-reset     # Reset database
make db-seed      # Add sample data
make db-studio    # Open Prisma Studio
```

## 🐳 Docker Network

All services use a shared Docker network called `avp-network` for inter-service communication. The network is automatically created when running any service.

## 📚 Project Structure

- **Separate Dependencies**: Each service (web/backend) has its own `package.json`, `node_modules`, and dependencies
- **Individual Docker Configs**: Each service has its own `Dockerfile` and `docker-compose.yml`
- **Shared Network**: All services communicate via `avp-network` Docker network
- **Windows Compatible**: Makefiles work on both Windows and Unix systems

## 🔐 Demo Credentials

- **Admin**: admin@avpacademy.com / admin123
- **Student**: student@example.com / student123

## 🧹 Cleanup

```bash
# Stop and remove everything
make clean-all

# Remove Docker network
docker network rm avp-network
```

## 🔍 Troubleshooting

**Port conflicts:**
- Stop any services running on ports 3000, 5173, 5432, 6379, 8080

**Docker issues:**
- Ensure Docker is running
- Try `docker system prune` to clean up

**Network issues:**
- Manually create network: `docker network create avp-network`

**Database connection issues:**
- Wait for database to be ready (health check in docker-compose)
- Check logs: `cd backend && make logs-db`

**Windows specific:**
- The Makefiles are designed to work on Windows Command Prompt and PowerShell
- Use `timeout` instead of `sleep` for delays

---

**Happy Learning! 🎓**
