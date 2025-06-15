
# AVP Siddha Academy - Backend API

A scalable, secure Node.js backend built with TypeScript for the AVP Siddha Academy EdTech platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Video Learning**: Secure video streaming with download expiry
- **Quiz System**: Comprehensive quiz management with real-time scoring
- **Student Management**: Profile management and progress tracking
- **Admin Panel**: Complete administrative controls
- **Real-time Features**: WebSocket support for live updates
- **Security**: Rate limiting, input validation, and secure headers
- **Scalability**: Designed to handle 500+ concurrent users

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis (optional, for caching)
- Docker (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your database and other configurations
```

### 3. Database Setup

```bash
# Run migrations
npm run migrate

# Generate Prisma client
npm run generate

# (Optional) Open Prisma Studio
npm run studio
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start:
- API server on port 3000
- PostgreSQL on port 5432
- Redis on port 6379

### Manual Docker Build

```bash
docker build -t avp-academy-api .
docker run -p 3000:3000 avp-academy-api
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Video Endpoints

- `GET /api/videos` - Get all videos (with filters)
- `GET /api/videos/:id` - Get specific video
- `POST /api/videos/:id/download` - Get download link
- `GET /api/videos/subjects` - Get available subjects

### Quiz Endpoints

- `GET /api/quizzes` - Get all quizzes (with filters)
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes/submit` - Submit quiz answers
- `GET /api/quizzes/attempts` - Get user's quiz attempts

### Health Check

- `GET /health` - API health status

## 🔐 Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: All inputs validated using express-validator
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **XSS Protection**: Helmet.js security headers
- **CORS**: Configurable cross-origin resource sharing
- **Password Security**: bcrypt with salt rounds
- **JWT Security**: Secure token generation and validation

## 📊 Database Schema

The database includes the following main entities:

- **Users**: Student and admin accounts
- **Courses & Batches**: Course organization
- **Videos**: Learning content with download tracking
- **Quizzes & Questions**: Assessment system
- **Student Profiles**: Extended student information
- **Notifications**: System notifications
- **Leaderboards**: Performance tracking

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

### Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- File uploads: 10 requests per hour

## 📈 Performance & Scaling

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip compression for responses
- **Caching**: Redis integration ready
- **Horizontal Scaling**: Stateless design for load balancing

## 🧪 Testing

```bash
npm test
```

## 📝 Logging

Logs are written to:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs
- Console output in development

## 🚀 Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set production environment**:
   ```bash
   export NODE_ENV=production
   ```

3. **Run migrations**:
   ```bash
   npm run migrate
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## 🔍 Monitoring

- Health check endpoint: `/health`
- Structured logging with Winston
- Error tracking and reporting
- Performance metrics ready

## 📋 TODO / Roadmap

- [ ] File upload to AWS S3/CloudFront
- [ ] WebSocket implementation for real-time features
- [ ] Automated testing suite
- [ ] API documentation with Swagger
- [ ] Monitoring dashboard
- [ ] Backup and recovery procedures
- [ ] Admin analytics endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
