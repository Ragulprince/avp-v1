
# AVP Academy - Full Stack EdTech Platform

A comprehensive educational technology platform built with React, Node.js, PostgreSQL, and Docker.

## 🏗️ Architecture

```
avp-academy/
├── web/                    # React Frontend (Vite + TypeScript)
├── backend/               # Node.js API (Express + TypeScript)
├── docker-compose.yml     # Docker services configuration
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### 1. Clone and Start

```bash
git clone <repository-url>
cd avp-academy
npm run dev
```

This will start all services:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Database Management**: http://localhost:8080 (Adminer)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 2. Database Management with Adminer

Access Adminer at http://localhost:8080

**Connection Details:**
- **System**: PostgreSQL
- **Server**: postgres
- **Username**: postgres
- **Password**: password
- **Database**: avp_academy

## 🛠️ Development

### Local Development (without Docker)

```bash
# Install dependencies
npm install

# Start backend
cd backend
npm install
npm run dev

# Start frontend (in another terminal)
cd web
npm install
npm run dev
```

### Docker Commands

```bash
# Start all services
npm run dev

# Start in detached mode
npm run dev:detached

# View logs
npm run logs

# Stop services
npm run stop

# Clean up (remove containers and volumes)
npm run clean

# Production build
npm run build
npm run start
```

## 📚 API Documentation

- **Swagger UI**: http://localhost:3000/api-docs
- **API JSON**: http://localhost:3000/api-docs.json
- **Health Check**: http://localhost:3000/health

## 🏷️ Services Overview

### Frontend (web/)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **Port**: 5173

### Backend (backend/)
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Multer
- **Documentation**: Swagger
- **Port**: 3000

### Database
- **Primary DB**: PostgreSQL 15
- **Cache**: Redis 7
- **Management**: Adminer
- **Port**: 5432 (PostgreSQL), 6379 (Redis), 8080 (Adminer)

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@postgres:5432/avp_academy
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://redis:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 📋 Features

### Student Features
- 🎓 Course enrollment and management
- 📹 Video learning with download capabilities
- 📝 Interactive quizzes and tests
- 📊 Progress tracking and analytics
- 🔔 Notifications and announcements
- 👤 Profile management

### Admin Features
- 👥 Student and staff management
- 📚 Course and batch management
- 🎬 Content upload (videos, materials)
- ❓ Question bank management
- 📊 Comprehensive reporting
- ⚙️ System settings

### Technical Features
- 🔐 JWT-based authentication
- 📱 Responsive design
- 🐳 Docker containerization
- 📖 API documentation (Swagger)
- 🗄️ Database management (Adminer)
- 📧 Email notifications
- 🚀 File upload and management

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Student
- `GET /api/student/dashboard` - Student dashboard
- `GET /api/student/videos` - Available videos
- `GET /api/student/materials` - Study materials
- `PUT /api/student/profile` - Update profile

### Admin
- `GET /api/admin/students` - Student management
- `POST /api/admin/courses` - Course creation
- `GET /api/admin/analytics` - System analytics

### Content
- `POST /api/content/materials/upload` - Upload study material
- `POST /api/content/videos/upload` - Upload video
- `GET /api/content/files/:filename` - Serve protected files

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| web | 5173 | React frontend |
| backend | 3000 | Node.js API |
| postgres | 5432 | PostgreSQL database |
| redis | 6379 | Redis cache |
| adminer | 8080 | Database management |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the Docker logs: `npm run logs`

---

**Happy Learning! 🎓**
