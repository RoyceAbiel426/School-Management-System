# Edu-Pro School Management System - Backend

Enterprise-grade Node.js/Express backend API for comprehensive school management system supporting multiple user roles, authentication, and real-time operations.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Available Scripts](#-available-scripts)
- [API Endpoints](#-api-endpoints)
- [Database Models](#-database-models)
- [Authentication](#-authentication)
- [Features](#-features)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)

## 🚀 Quick Start

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env with your MongoDB connection string and other configs

# 4. Ensure MongoDB is running
# Windows: Check MongoDB service is running
# Linux/Mac: sudo systemctl start mongod

# 5. Start development server
npm run dev

# 6. Server will be running at http://localhost:5000
```

**Prerequisites:**

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB >= 5.0 (running locally or MongoDB Atlas)
- (Optional) Upstash Redis account for rate limiting

## 🛠️ Tech Stack

### Core

- **Node.js 22.16.0** - JavaScript runtime
- **Express 4.19.2** - Fast, minimalist web framework
- **MongoDB 8.0** - NoSQL database
- **Mongoose 8.16.1** - MongoDB object modeling

### Security & Authentication

- **JWT (jsonwebtoken 9.0.2)** - Token-based authentication
- **bcrypt 6.0.0** - Password hashing
- **Helmet 8.1.0** - Security headers
- **CORS 2.8.5** - Cross-Origin Resource Sharing

### Validation & Middleware

- **express-validator 7.2.1** - Request validation
- **Custom Middleware** - Authentication, error handling

### Rate Limiting

- **@upstash/ratelimit 2.0.5** - Distributed rate limiting
- **@upstash/redis 1.35.0** - Redis client for Upstash

### Development

- **nodemon 3.1.10** - Auto-restart on file changes
- **dotenv 16.6.1** - Environment variable management

## 📁 Project Structure

```
server/
├── src/
│   ├── config/                    # Configuration files
│   │   ├── connectDB.js          # MongoDB connection
│   │   └── upstash.js            # Upstash Redis configuration
│   │
│   ├── models/                    # Mongoose schemas (15 models)
│   │   ├── Admin.js              # Admin/Principal users
│   │   ├── Student.js            # Student records
│   │   ├── Teacher.js            # Teacher profiles
│   │   ├── Coach.js              # Sports coaches
│   │   ├── ClassGroup.js         # Class/grade information
│   │   ├── Course.js             # Course catalog
│   │   ├── Module.js             # Course modules/chapters
│   │   ├── Attendance.js         # Student attendance
│   │   ├── Exam.js               # Examination records
│   │   ├── Result.js             # Student results/grades
│   │   ├── Notice.js             # Announcements
│   │   ├── Complain.js           # Complaint system
│   │   ├── Book.js               # Library books
│   │   ├── LibraryTransaction.js # Book issue/return
│   │   └── Sport.js              # Sports activities
│   │
│   ├── controllers/               # Business logic (9 controllers)
│   │   ├── studentAuthController.js  # Student authentication
│   │   ├── adminController.js        # Admin operations
│   │   ├── studentController.js      # Student operations
│   │   ├── teacherController.js      # Teacher operations
│   │   ├── classGroupController.js   # Class management
│   │   ├── moduleController.js       # Module management
│   │   ├── noticeController.js       # Notice board
│   │   ├── complainController.js     # Complaints handling
│   │   └── libraryController.js      # Library operations
│   │
│   ├── routes/                    # API route definitions (9 route files)
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── adminRoutes.js        # Admin-only endpoints
│   │   ├── studentRoutes.js      # Student endpoints
│   │   ├── teacherRoutes.js      # Teacher endpoints
│   │   ├── classGroupRoutes.js   # Class group endpoints
│   │   ├── moduleRoutes.js       # Module endpoints
│   │   ├── noticeRoutes.js       # Notice endpoints
│   │   ├── complainRoutes.js     # Complaint endpoints
│   │   └── libraryRoutes.js      # Library endpoints
│   │
│   ├── middlewares/               # Custom middleware
│   │   ├── auth.js               # JWT authentication
│   │   ├── errorHandler.js       # Global error handling
│   │   └── rateLimiter.js        # Rate limiting
│   │
│   ├── utils/                     # Utility functions
│   │   └── idGenerator.js        # Unique ID generation
│   │
│   ├── services/                  # Business services (planned)
│   ├── validations/               # Request validators (planned)
│   ├── app.js                     # Express app configuration
│   └── server.js                  # Server entry point
│
├── .env                           # Environment variables (create from .env.example)
├── .env.example                   # Environment template
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## 🔧 Environment Setup

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URL=mongodb://127.0.0.1:27017/OnlineSchool
# For MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/OnlineSchool

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-use-openssl-rand-base64-64
JWT_EXPIRES_IN=24h

# Rate Limiting Configuration
DISABLE_RATE_LIMITING=false
# Set to 'true' during development to disable rate limiting

# Upstash Redis Configuration (Optional - required for rate limiting)
# Sign up at https://upstash.com for free tier (10,000 requests/day)
UPSTASH_REDIS_REST_URL=your-upstash-redis-rest-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-rest-token

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
# For production:
# FRONTEND_URL=https://yourschool.com
```

### Generate Strong JWT Secret

```bash
# Using OpenSSL (recommended)
openssl rand -base64 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

## 📜 Available Scripts

| Command        | Description                                          |
| -------------- | ---------------------------------------------------- |
| `npm run dev`  | Start development server with nodemon (auto-restart) |
| `npm start`    | Start production server                              |
| `npm run lint` | Run ESLint to check code quality                     |
| `npm run seed` | Seed database with sample data (if implemented)      |

## 🔌 API Endpoints

### Base URL

- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.yourschool.com/api/v1`

### Health Check

```
GET /health
GET /
```

### Authentication Endpoints (`/api/v1/auth`)

#### Admin/Principal

- `POST /auth/admin/register` - Register new admin
- `POST /auth/admin/login` - Admin login

#### Student

- `POST /auth/student/register` - Register new student
- `POST /auth/student/login` - Student login

#### Teacher

- `POST /auth/teacher/register` - Register new teacher
- `POST /auth/teacher/login` - Teacher login

#### Coach

- `POST /auth/coach/register` - Register new coach
- `POST /auth/coach/login` - Coach login

#### Librarian

- `POST /auth/librarian/register` - Register new librarian
- `POST /auth/librarian/login` - Librarian login

### Admin Endpoints (`/api/v1/admin`)

Protected - Requires admin authentication

```
# School Management
GET    /admin/school              # Get school profile
POST   /admin/school              # Create school profile
PUT    /admin/school/:id          # Update school profile
DELETE /admin/school/:id          # Delete school profile

# Student Management
GET    /admin/students            # Get all students
GET    /admin/students/:id        # Get student by ID
POST   /admin/students            # Create new student
PUT    /admin/students/:id        # Update student
DELETE /admin/students/:id        # Delete student

# Teacher Management
GET    /admin/teachers            # Get all teachers
GET    /admin/teachers/:id        # Get teacher by ID
POST   /admin/teachers            # Create new teacher
PUT    /admin/teachers/:id        # Update teacher
DELETE /admin/teachers/:id        # Delete teacher

# Course Management
GET    /admin/courses             # Get all courses
GET    /admin/courses/:id         # Get course by ID
POST   /admin/courses             # Create new course
PUT    /admin/courses/:id         # Update course
DELETE /admin/courses/:id         # Delete course

# Class Group Management
GET    /admin/classgroups         # Get all class groups
POST   /admin/classgroups         # Create class group
PUT    /admin/classgroups/:id     # Update class group
DELETE /admin/classgroups/:id     # Delete class group

# Sports Management
GET    /admin/sports              # Get all sports
POST   /admin/sports              # Create new sport
PUT    /admin/sports/:id          # Update sport
DELETE /admin/sports/:id          # Delete sport

# Attendance Management
GET    /admin/attendance          # Get attendance records
POST   /admin/attendance          # Mark attendance
PUT    /admin/attendance/:id      # Update attendance
DELETE /admin/attendance/:id      # Delete attendance

# Results Management
GET    /admin/results             # Get all results
POST   /admin/results             # Create result
PUT    /admin/results/:id         # Update result
DELETE /admin/results/:id         # Delete result

# Library Management
GET    /admin/books               # Get all books
POST   /admin/books               # Add new book
PUT    /admin/books/:id           # Update book
DELETE /admin/books/:id           # Delete book

# Coach Management
GET    /admin/coaches             # Get all coaches
POST   /admin/coaches             # Create coach
PUT    /admin/coaches/:id         # Update coach
DELETE /admin/coaches/:id         # Delete coach
```

### Student Endpoints (`/api/v1/students`)

Protected - Requires student authentication

```
GET    /students/dashboard        # Get student dashboard data
GET    /students/profile          # Get student profile
PUT    /students/profile          # Update profile
GET    /students/courses          # Get enrolled courses
POST   /students/courses/enroll   # Enroll in course
GET    /students/attendance       # View attendance records
GET    /students/results          # View exam results
GET    /students/sports           # View available sports
POST   /students/sports/join      # Join a sport
```

### Teacher Endpoints (`/api/v1/teachers`)

Protected - Requires teacher authentication

```
GET    /teachers/dashboard        # Get teacher dashboard
GET    /teachers/profile          # Get teacher profile
PUT    /teachers/profile          # Update profile
GET    /teachers/classes          # Get assigned classes
GET    /teachers/classes/:id      # Get class details
GET    /teachers/students         # Get class students
POST   /teachers/attendance       # Mark attendance
GET    /teachers/attendance       # View attendance
POST   /teachers/results          # Enter results
GET    /teachers/results          # View results
PUT    /teachers/results/:id      # Update result
GET    /teachers/subjects         # Get assigned subjects
GET    /teachers/statistics       # Get class statistics
```

### Library Endpoints (`/api/v1/library`)

Protected - Requires authentication

```
GET    /library/books             # Get all books
GET    /library/books/:id         # Get book details
POST   /library/books             # Add new book (librarian)
PUT    /library/books/:id         # Update book (librarian)
DELETE /library/books/:id         # Delete book (librarian)
POST   /library/issue             # Issue book
POST   /library/return            # Return book
GET    /library/transactions      # Get transactions
GET    /library/overdue           # Get overdue books
GET    /library/search            # Search books
POST   /library/fine/pay          # Pay fine
GET    /library/statistics        # Library statistics
```

### Notice Endpoints (`/api/v1/notices`)

Protected - All authenticated users

```
GET    /notices                   # Get all notices
GET    /notices/:id               # Get notice by ID
POST   /notices                   # Create notice (admin/teacher)
PUT    /notices/:id               # Update notice (admin)
DELETE /notices/:id               # Delete notice (admin)
```

### Complaint Endpoints (`/api/v1/complaints`)

Protected - All authenticated users

```
GET    /complaints                # Get complaints
GET    /complaints/:id            # Get complaint by ID
POST   /complaints                # Submit complaint
PUT    /complaints/:id            # Update complaint
DELETE /complaints/:id            # Delete complaint (admin)
```

### Class Group Endpoints (`/api/v1/classgroups`)

Protected - Varies by operation

```
GET    /classgroups               # Get all class groups
GET    /classgroups/:id           # Get class group details
POST   /classgroups               # Create class group (admin)
PUT    /classgroups/:id           # Update class group (admin)
DELETE /classgroups/:id           # Delete class group (admin)
```

### Module Endpoints (`/api/v1/modules`)

Protected - Admin/Teacher

```
GET    /modules                   # Get all modules
GET    /modules/:id               # Get module details
POST   /modules                   # Create module
PUT    /modules/:id               # Update module
DELETE /modules/:id               # Delete module
```

## 🗄️ Database Models

The system uses 15 Mongoose models:

### User Models

1. **Admin** - School administrators and principals
2. **Student** - Student records with enrollment data
3. **Teacher** - Teacher profiles and assignments
4. **Coach** - Sports coaches

### Academic Models

5. **ClassGroup** - Class/grade information
6. **Course** - Course catalog
7. **Module** - Course modules/chapters
8. **Attendance** - Student attendance tracking
9. **Exam** - Examination records
10. **Result** - Student results/grades

### Communication Models

11. **Notice** - Announcements and notices
12. **Complain** - Complaint/feedback system

### Library Models

13. **Book** - Library book catalog
14. **LibraryTransaction** - Book issue/return records

### Sports Models

15. **Sport** - Sports activities and teams

### ID Generation Pattern

- **School**: `sch_010m` (sch + 4-digit month+year)
- **Student**: `st010m1099` (st + month+year + 4-digit counter)
- **Teacher**: `te010m1102` (te + month+year + 4-digit counter)
- **Admin**: `adm0001` (adm + 4-digit counter)

## 🔐 Authentication

### JWT Token-based Authentication

1. **Register/Login**: User provides credentials
2. **Token Generation**: Server generates JWT with user ID and role
3. **Token Storage**: Client stores token (localStorage/sessionStorage)
4. **Protected Requests**: Client sends token in Authorization header
5. **Token Verification**: Server validates token on each request

### Authorization Header Format

```
Authorization: Bearer <jwt_token>
```

### Token Payload

```javascript
{
  id: "user_id",
  role: "Admin|Student|Teacher|Coach|Librarian",
  iat: 1234567890,  // Issued at
  exp: 1234654290   // Expiration
}
```

### Password Security

- Passwords hashed using bcrypt (10 rounds)
- Never stored in plain text
- Minimum 6 characters required

## 📱 Features

### Security

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Rate limiting (Upstash Redis)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling middleware

### Database

- ✅ MongoDB with Mongoose ODM
- ✅ Schema validation
- ✅ Indexes for performance
- ✅ Relationships between models
- ✅ Timestamps (createdAt, updatedAt)

### API Features

- ✅ RESTful API design
- ✅ Versioned endpoints (/api/v1)
- ✅ Consistent error responses
- ✅ Request logging (development)
- ✅ Health check endpoint
- ✅ Pagination support
- ✅ Filtering and sorting

### Rate Limiting

- ✅ Global rate limits
- ✅ Per-endpoint limits
- ✅ IP-based tracking
- ✅ Configurable limits
- ✅ Can be disabled for development

## 💻 Development Guide

### Project Architecture

**MVC Pattern**: Models, Controllers, Routes separation

**Middleware Pipeline**: Request → Rate Limiter → Auth → Route → Controller → Response

**Service Layer** (Planned): Business logic separation from controllers

**Validation Layer** (Planned): Request validation before controllers

### Adding a New Endpoint

1. **Create/Update Model** (if needed)

```javascript
// src/models/NewModel.js
import mongoose from "mongoose";

const newSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // ... other fields
  },
  { timestamps: true }
);

export default mongoose.model("NewModel", newSchema);
```

2. **Create Controller**

```javascript
// src/controllers/newController.js
import NewModel from "../models/NewModel.js";

export const getAll = async (req, res) => {
  try {
    const items = await NewModel.find();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

3. **Create Routes**

```javascript
// src/routes/newRoutes.js
import express from "express";
import { getAll } from "../controllers/newController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getAll);

export default router;
```

4. **Register Routes in app.js**

```javascript
import newRoutes from "./routes/newRoutes.js";
app.use("/api/v1/new", newRoutes);
```

### Error Handling

Use consistent error responses:

```javascript
// Success
res.json({
  success: true,
  data: result,
  message: "Operation successful",
});

// Error
res.status(400).json({
  success: false,
  message: "Error message",
  error: errorDetails,
});
```

### Authentication Middleware

```javascript
import { protect } from "../middlewares/auth.js";

// Protect route
router.get("/protected", protect, controller);

// Role-specific protection
router.post("/admin-only", protect, requireRole("Admin"), controller);
```

### Database Queries

```javascript
// Find all
const items = await Model.find();

// Find with filter
const items = await Model.find({ status: "active" });

// Find one
const item = await Model.findById(id);

// Create
const item = await Model.create(data);

// Update
const item = await Model.findByIdAndUpdate(id, data, { new: true });

// Delete
await Model.findByIdAndDelete(id);

// Population
const items = await Model.find().populate("relatedField");
```

## 🚀 Deployment

### Environment Preparation

1. **Set Production Environment Variables**

```env
NODE_ENV=production
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/database
JWT_SECRET=<strong-random-64-char-string>
FRONTEND_URL=https://yourschool.com
DISABLE_RATE_LIMITING=false
```

2. **Enable Rate Limiting**

- Sign up for Upstash Redis
- Add credentials to `.env`
- Set `DISABLE_RATE_LIMITING=false`

### Deployment Options

#### 1. Heroku

```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URL="your-mongodb-url"
heroku config:set JWT_SECRET="your-secret"

# Deploy
git push heroku main
```

#### 2. AWS EC2

```bash
# SSH into EC2 instance
ssh -i key.pem ubuntu@ec2-instance

# Install Node.js and PM2
sudo apt update
sudo apt install nodejs npm
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd server
npm install

# Create .env file
nano .env

# Start with PM2
pm2 start src/server.js --name edu-pro-api
pm2 save
pm2 startup
```

#### 3. Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

```bash
# Build and run
docker build -t edu-pro-api .
docker run -p 5000:5000 --env-file .env edu-pro-api
```

#### 4. Digital Ocean App Platform

```bash
# Create app.yaml
name: edu-pro-api
services:
  - name: api
    source_dir: /server
    github:
      repo: your-username/edu-pro
      branch: main
    build_command: npm install
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
```

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster (Free tier available)
3. Whitelist IP addresses (or allow all: 0.0.0.0/0)
4. Create database user
5. Get connection string
6. Update `MONGO_URL` in `.env`

### SSL/HTTPS

Use a reverse proxy like Nginx:

```nginx
server {
    listen 80;
    server_name api.yourschool.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Generate strong JWT secret (64+ characters)
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Enable rate limiting with Upstash Redis
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS/SSL
- [ ] Update CORS allowed origins
- [ ] Review Helmet CSP policies
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Set up monitoring and logging
- [ ] Regular security audits (`npm audit`)
- [ ] Keep dependencies updated
- [ ] Implement request size limits
- [ ] Add API documentation
- [ ] Set up backups for database

## 🐛 Troubleshooting

### MongoDB Connection Errors

```bash
# Check MongoDB is running
# Windows
Get-Service MongoDB

# Linux/Mac
sudo systemctl status mongod

# Test connection
mongosh mongodb://127.0.0.1:27017/OnlineSchool
```

### Port 5000 already in use

```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

### JWT Token Errors

- Verify `JWT_SECRET` is set in `.env`
- Check token expiration (`JWT_EXPIRES_IN`)
- Ensure client sends token in `Authorization` header

### Rate Limiting Issues

- Set `DISABLE_RATE_LIMITING=true` for development
- Verify Upstash credentials for production
- Check Upstash dashboard for request limits

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [JWT.io](https://jwt.io)
- [Upstash Documentation](https://docs.upstash.com)

## 🤝 Contributing

1. Follow existing code structure
2. Add proper error handling
3. Validate all inputs
4. Write meaningful commit messages
5. Add comments for complex logic
6. Update documentation

## 📄 License

MIT License - See LICENSE file for details

---

**Related Documentation:**

- Frontend: See `../client/README.md`
- API Reference: See `../Docs/client/API_REFERENCE.md`
- Database Models: See `../Docs/database_models.md`
- System Requirements: See `../Docs/system_requirements.md`
- Setup Guide: See `../Docs/SETUP_COMPLETE.md`
