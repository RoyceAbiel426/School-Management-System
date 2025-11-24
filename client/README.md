# Edu-Pro School Management System - Frontend

Modern React-based frontend application for comprehensive school management with support for Admin, Student, Teacher, Coach, and Librarian roles.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Available Scripts](#-available-scripts)
- [User Roles](#-user-roles)
- [Features](#-features)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)

## 🚀 Quick Start

```bash
# 1. Navigate to client directory
cd client

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:5000

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:5173
```

**Prerequisites:**
- Node.js >= 16.0.0
- npm >= 8.0.0
- Backend server running on port 5000

## 🛠️ Tech Stack

### Core
- **React 19.1.0** - Modern UI library with concurrent features
- **Vite 7.0.0** - Lightning-fast build tool and dev server
- **React Router DOM 7.6.3** - Client-side routing and navigation

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React 0.525.0** - Beautiful SVG icon library
- **Framer Motion 12.19.2** - Production-ready animations

### Forms & Validation
- **React Hook Form 7.59.0** - Performant form handling
- **Custom Validators** - Client-side validation utilities

### HTTP & State Management
- **Axios 1.10.0** - Promise-based HTTP client
- **React Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic

## 📁 Project Structure

```
client/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── common/           # Shared components (Button, Input, Modal, etc.)
│   │   ├── layout/           # Layout components (Header, Sidebar, etc.)
│   │   ├── AdminLogin.jsx    # Admin authentication
│   │   ├── StudentLogin.jsx  # Student authentication
│   │   ├── TeacherLogin.jsx  # Teacher authentication
│   │   ├── CoachLogin.jsx    # Coach authentication
│   │   └── LibrarianLogin.jsx # Librarian authentication
│   │
│   ├── pages/                # Page components (dashboards)
│   │   ├── AdminDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── CoachDashboard.jsx
│   │   └── LibrarianDashboard.jsx
│   │
│   ├── services/             # API service layer
│   │   ├── api.js           # Axios instance configuration
│   │   ├── authService.js   # Authentication services
│   │   ├── adminService.js  # Admin operations
│   │   ├── studentService.js # Student operations
│   │   ├── teacherService.js # Teacher operations
│   │   ├── coachService.js   # Coach operations
│   │   └── librarianService.js # Librarian operations
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js       # Authentication hook
│   │   ├── useApi.js        # API call hook
│   │   ├── useLocalStorage.js # LocalStorage hook
│   │   ├── useDebounce.js   # Debounce hook
│   │   └── usePermissions.js # Role-based permissions
│   │
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   ├── ThemeContext.jsx # Theme management
│   │   └── NotificationContext.jsx # Notifications
│   │
│   ├── utils/                # Utility functions
│   │   ├── validators.js    # Validation functions
│   │   ├── formatters.js    # Data formatters
│   │   ├── dateHelpers.js   # Date utilities
│   │   └── axiosInstance.js # Axios configuration
│   │
│   ├── constants/            # Application constants
│   │   ├── roles.js         # User roles and permissions
│   │   ├── routes.js        # Route definitions
│   │   └── apiEndpoints.js  # API endpoint constants
│   │
│   ├── assets/              # Images, fonts, etc.
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
│
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Environment template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🔧 Environment Setup

Create a `.env` file in the client directory:

```env
# API Base URL (Backend server)
VITE_API_URL=http://localhost:5000

# For production, change to your backend URL:
# VITE_API_URL=https://api.yourschool.com
```

**Note:** All environment variables must be prefixed with `VITE_` to be accessible in the application.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 👥 User Roles

The application supports 5 distinct user roles:

### 1. Admin/Principal
- School profile management
- Student enrollment and management
- Teacher management
- Course and module creation
- Sports and library oversight
- Attendance and results management
- System-wide reports

### 2. Student
- View enrolled courses
- Check attendance records
- View exam results
- Access library resources
- Join sports activities
- Submit complaints
- View notices

### 3. Teacher
- Manage assigned classes
- Mark student attendance
- Enter and update exam results
- View class statistics
- Access student progress data
- View notices and announcements

### 4. Coach
- Manage sports and teams
- Schedule events and matches
- Track participant performance
- Record sports statistics
- Manage team rosters
- View sports-related notices

### 5. Librarian
- Manage book catalog
- Issue and return books
- Track overdue items
- Calculate and collect fines
- View library statistics
- Manage library transactions

## 📱 Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Auto-logout on token expiration
- ✅ Separate login flows for each role

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/Light mode support
- ✅ Smooth animations with Framer Motion
- ✅ Loading states and skeletons
- ✅ Toast notifications
- ✅ Modal dialogs
- ✅ Accessible components

### Forms & Validation
- ✅ Client-side validation
- ✅ Real-time error feedback
- ✅ Form state management
- ✅ File upload support
- ✅ Date pickers
- ✅ Multi-select dropdowns

### Data Management
- ✅ CRUD operations for all entities
- ✅ Pagination
- ✅ Search and filtering
- ✅ Sorting
- ✅ Bulk operations
- ✅ Data export

### Performance
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Optimized images
- ✅ Debounced search
- ✅ Memoized components
- ✅ Fast refresh (HMR)

## 💻 Development Guide

### Project Architecture

**Feature-Based Structure**: Components are organized by feature/domain rather than type.

**Service Layer Pattern**: All API calls go through service modules, keeping components clean.

**Context API**: Global state (auth, theme, notifications) managed via React Context.

**Custom Hooks**: Reusable logic extracted into custom hooks for better maintainability.

### Adding a New Page

1. Create page component in `src/pages/`
2. Add route in `src/constants/routes.js`
3. Create service functions in appropriate service file
4. Add route to `src/App.jsx`

Example:
```javascript
// src/pages/NewFeature.jsx
export default function NewFeature() {
  return <div>New Feature</div>;
}

// src/App.jsx
import NewFeature from './pages/NewFeature';

// Add route
<Route path="/new-feature" element={<NewFeature />} />
```

### Using Services

```javascript
import { adminService } from '../services/adminService';

// In your component
const fetchData = async () => {
  try {
    const response = await adminService.getStudents();
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Using Auth Context

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome, {user.name}</div>;
}
```

### Styling with Tailwind

```javascript
// Use utility classes
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Click Me
</button>

// Custom theme values are in tailwind.config.js
<div className="bg-primary text-primary-foreground">
  Themed Component
</div>
```

### Environment Variables

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Code Style

- Use functional components with hooks
- Use arrow functions for components
- Follow ESLint rules (run `npm run lint`)
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Keep components small and focused

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Options

#### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### 2. Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### 3. GitHub Pages
```bash
# Add homepage to package.json
"homepage": "https://yourusername.github.io/repo-name"

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy script to package.json
"deploy": "vite build && gh-pages -d dist"

# Deploy
npm run deploy
```

#### 4. Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables for Production

Update `.env` for production:
```env
VITE_API_URL=https://api.yourschool.com
```

**Important:** Don't commit `.env` to version control!

## 🔒 Security Best Practices

- ✅ All API requests include JWT tokens
- ✅ Tokens stored in localStorage (consider httpOnly cookies for enhanced security)
- ✅ Input sanitization and validation
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Environment variables for sensitive data
- ✅ Auto-logout on 401 responses

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
# Kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <process_id> /F

# Or change port in vite.config.js
server: { port: 3000 }
```

### API calls failing
- Check backend server is running on port 5000
- Verify `VITE_API_URL` in `.env`
- Check browser console for CORS errors
- Check Network tab in DevTools

### Hot reload not working
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear cache
rm -rf dist .vite
npm run build
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include loading states
4. Write meaningful commit messages
5. Test on different screen sizes
6. Update documentation when needed

## 📄 License

MIT License - See LICENSE file for details

---

**Related Documentation:**
- Backend: See `../server/README.md`
- API Reference: See `../Docs/client/API_REFERENCE.md`
- Project Structure: See `../Docs/client/FOLDER_STRUCTURE.md`
- Phase Plan: See `../Docs/client/PHASE_PLAN.md`
