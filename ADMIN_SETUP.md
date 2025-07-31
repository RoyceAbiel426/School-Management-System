# Admin Backend Setup Guide

This guide will help you set up the complete admin backend for the School Management System.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/OnlineSchool
JWT_SECRET=your-super-secret-jwt-key-here
```

### 3. Database Setup

Make sure MongoDB is running on your system, then seed the database:

```bash
cd server
npm run seed
```

This will create:
- Admin accounts
- Sample students, courses, sports, books, etc.
- Test data for all modules

### 4. Start the Application

```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm run dev
```

## 🔐 Login Credentials

After seeding the database, you can use these credentials:

### Admin Accounts
- **Super Admin**: `admin@school.com` / `admin123`
- **Moderator**: `moderator@school.com` / `moderator123`

### Student Account
- **Student**: `john.brown@example.com` / `password123`

## 📁 Backend Structure

```
server/
├── src/
│   ├── models/
│   │   ├── Admin.js          # Admin model with permissions
│   │   ├── Students.js       # Student model
│   │   ├── Course.js         # Course model
│   │   ├── Sports.js         # Sports model
│   │   ├── Books.js          # Library books model
│   │   ├── Attendance.js     # Attendance model
│   │   ├── Results.js        # Academic results model
│   │   └── Coaches.js        # Sports coaches model
│   ├── controllers/
│   │   └── adminController.js # Admin CRUD operations
│   ├── routes/
│   │   └── adminRoutes.js    # Admin API routes
│   ├── middlewares/
│   │   └── adminAuth.js      # Admin authentication & permissions
│   └── server.js             # Main server file
├── seed.js                   # Database seeding script
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Dashboard
- `GET /api/admin/dashboard` - Dashboard overview

### Students Management
- `GET /api/admin/students` - Get all students
- `GET /api/admin/students/:id` - Get student by ID
- `POST /api/admin/students` - Create new student
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student

### Courses Management
- `GET /api/admin/courses` - Get all courses
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course

### Sports Management
- `GET /api/admin/sports` - Get all sports
- `POST /api/admin/sports` - Create new sport
- `PUT /api/admin/sports/:id` - Update sport
- `DELETE /api/admin/sports/:id` - Delete sport

### Library Management
- `GET /api/admin/books` - Get all books
- `POST /api/admin/books` - Create new book
- `PUT /api/admin/books/:id` - Update book
- `DELETE /api/admin/books/:id` - Delete book

### Attendance Management
- `GET /api/admin/attendance` - Get all attendance records
- `POST /api/admin/attendance` - Create attendance record
- `PUT /api/admin/attendance/:id` - Update attendance
- `DELETE /api/admin/attendance/:id` - Delete attendance

### Results Management
- `GET /api/admin/results` - Get all results
- `POST /api/admin/results` - Create new result
- `PUT /api/admin/results/:id` - Update result
- `DELETE /api/admin/results/:id` - Delete result

### Coaches Management
- `GET /api/admin/coaches` - Get all coaches
- `POST /api/admin/coaches` - Create new coach
- `PUT /api/admin/coaches/:id` - Update coach
- `DELETE /api/admin/coaches/:id` - Delete coach

## 🔒 Authentication & Permissions

### Admin Roles
- **super_admin**: Full access to all features
- **admin**: Standard admin access
- **moderator**: Limited access based on permissions

### Permission System
Each admin has granular permissions for:
- `students`: view, create, edit, delete
- `courses`: view, create, edit, delete
- `sports`: view, create, edit, delete
- `library`: view, create, edit, delete
- `attendance`: view, create, edit, delete
- `results`: view, create, edit, delete
- `coaches`: view, create, edit, delete

### JWT Token
- Tokens are valid for 24 hours
- Include admin ID, role, and permissions
- Required for all protected routes

## 🛠️ Development

### Adding New Features

1. **Create/Update Model** in `src/models/`
2. **Add Controller Methods** in `src/controllers/adminController.js`
3. **Add Routes** in `src/routes/adminRoutes.js`
4. **Update Frontend** to use new endpoints

### Database Schema

All models include:
- `timestamps`: Created and updated timestamps
- `validation`: Input validation rules
- `relationships`: References to other models

### Error Handling

- Consistent error responses
- Proper HTTP status codes
- Detailed error messages for debugging

## 🚨 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Request data validation
- **Permission Checks**: Role-based access control
- **CORS Configuration**: Cross-origin request handling

## 📊 Data Flow

1. **Frontend** makes API request with JWT token
2. **Middleware** validates token and permissions
3. **Controller** processes request and interacts with database
4. **Model** handles data validation and persistence
5. **Response** returned to frontend with success/error status

## 🔍 Testing

### Manual Testing
1. Use the admin login page
2. Navigate through different sections
3. Test CRUD operations
4. Verify permissions work correctly

### API Testing
Use tools like Postman or curl to test endpoints:

```bash
# Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"admin123"}'

# Get students (with token)
curl -X GET http://localhost:5000/api/admin/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration

3. **Permission Denied**
   - Verify admin role and permissions
   - Check route protection middleware

4. **CORS Errors**
   - Ensure frontend URL is in CORS configuration
   - Check server is running on correct port

### Logs
Check server console for detailed error messages and debugging information.

## 📈 Performance

- **Database Indexing**: Proper indexes on frequently queried fields
- **Pagination**: Large datasets are paginated
- **Population**: Efficient data relationships
- **Caching**: Consider adding Redis for session management

## 🔄 Updates

To update the system:

1. Pull latest changes
2. Run `npm install` for new dependencies
3. Update database schema if needed
4. Restart the server

---

For more information, check the individual model and controller files for detailed documentation. 