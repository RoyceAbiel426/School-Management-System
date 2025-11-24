# 📁 Complete Folder Structure - Edu-Pro Client

## 🏗️ Architecture Overview

```
client/
├── public/                         # Static assets
├── src/
│   ├── assets/                     # Images, icons, fonts
│   │   └── react.svg
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── common/                 # Generic UI components
│   │   │   ├── Alert.jsx          # Alert notifications
│   │   │   ├── Badge.jsx          # Status badges
│   │   │   ├── Button.jsx         # Button component
│   │   │   ├── Card.jsx           # Card container
│   │   │   ├── Input.jsx          # Input field
│   │   │   ├── Loader.jsx         # Loading spinner
│   │   │   ├── Modal.jsx          # Modal dialog
│   │   │   ├── Select.jsx         # Dropdown select
│   │   │   ├── Table.jsx          # Data table
│   │   │   └── index.js           # Barrel exports
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── AuthLayout.jsx     # Auth pages layout
│   │   │   ├── DashboardLayout.jsx # Dashboard layout
│   │   │   ├── Header.jsx         # App header
│   │   │   ├── Sidebar.jsx        # Sidebar navigation
│   │   │   └── index.js           # Barrel exports
│   │   │
│   │   ├── forms/                 # Form components
│   │   │   ├── FormInput.jsx      # Form input with validation [TO CREATE]
│   │   │   ├── FormSelect.jsx     # Form select with validation [TO CREATE]
│   │   │   ├── FormTextarea.jsx   # Form textarea [TO CREATE]
│   │   │   ├── FormDatePicker.jsx # Date picker [TO CREATE]
│   │   │   └── index.js           # Barrel exports [TO CREATE]
│   │   │
│   │   ├── AdminLogin.jsx         # Admin login page [EXISTING - USER CREATED]
│   │   ├── StudentLogin.jsx       # Student login page [EXISTING - USER CREATED]
│   │   ├── StudentRegister.jsx    # Student register page [EXISTING - USER CREATED]
│   │   ├── LandingPage.jsx        # Landing page [EXISTING - USER CREATED]
│   │   ├── RateLimitedUI.jsx      # Rate limit component [EXISTING - USER CREATED]
│   │   ├── ProtectedRoute.jsx     # Route guard [CREATED - PHASE 1]
│   │   └── index.js               # Component exports [CREATED - PHASE 1]
│   │
│   ├── features/                  # Feature-based modules
│   │   ├── admin/                 # Admin feature
│   │   │   ├── components/        # Admin-specific components [TO CREATE]
│   │   │   │   ├── StudentManagement.jsx
│   │   │   │   ├── TeacherManagement.jsx
│   │   │   │   ├── CourseManagement.jsx
│   │   │   │   ├── SportsManagement.jsx
│   │   │   │   ├── LibraryManagement.jsx
│   │   │   │   ├── AttendanceManagement.jsx
│   │   │   │   ├── ResultsManagement.jsx
│   │   │   │   ├── NoticeManagement.jsx
│   │   │   │   ├── ComplaintManagement.jsx
│   │   │   │   └── index.js
│   │   │   └── pages/             # Admin pages [TO CREATE]
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Students/
│   │   │       ├── Teachers/
│   │   │       ├── Courses/
│   │   │       └── index.js
│   │   │
│   │   ├── student/               # Student feature
│   │   │   ├── components/        # Student-specific components [TO CREATE]
│   │   │   │   ├── CourseEnrollment.jsx
│   │   │   │   ├── AttendanceView.jsx
│   │   │   │   ├── ResultsView.jsx
│   │   │   │   ├── SportsRegistration.jsx
│   │   │   │   ├── LibraryBrowsing.jsx
│   │   │   │   └── index.js
│   │   │   └── pages/             # Student pages [TO CREATE]
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Courses.jsx
│   │   │       ├── Attendance.jsx
│   │   │       ├── Results.jsx
│   │   │       └── index.js
│   │   │
│   │   ├── teacher/               # Teacher feature [TO CREATE]
│   │   │   ├── components/        # Teacher-specific components
│   │   │   │   ├── ClassManagement.jsx
│   │   │   │   ├── AttendanceMarking.jsx
│   │   │   │   ├── ResultsEntry.jsx
│   │   │   │   ├── StudentProgress.jsx
│   │   │   │   └── index.js
│   │   │   └── pages/             # Teacher pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Classes.jsx
│   │   │       ├── Attendance.jsx
│   │   │       ├── Results.jsx
│   │   │       └── index.js
│   │   │
│   │   ├── coach/                 # Coach feature [TO CREATE]
│   │   │   ├── components/        # Coach-specific components
│   │   │   │   ├── SportsManagement.jsx
│   │   │   │   ├── ParticipantManagement.jsx
│   │   │   │   ├── EventScheduling.jsx
│   │   │   │   └── index.js
│   │   │   └── pages/             # Coach pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Sports.jsx
│   │   │       ├── Participants.jsx
│   │   │       └── index.js
│   │   │
│   │   ├── librarian/             # Librarian feature [TO CREATE]
│   │   │   ├── components/        # Librarian-specific components
│   │   │   │   ├── BookManagement.jsx
│   │   │   │   ├── TransactionManagement.jsx
│   │   │   │   ├── BookSearch.jsx
│   │   │   │   ├── IssueReturn.jsx
│   │   │   │   └── index.js
│   │   │   └── pages/             # Librarian pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Books.jsx
│   │   │       ├── Transactions.jsx
│   │   │       └── index.js
│   │   │
│   │   └── auth/                  # Authentication feature
│   │       ├── components/        # Auth components [TO CREATE]
│   │       │   ├── LoginForm.jsx
│   │       │   ├── RegisterForm.jsx
│   │       │   ├── ForgotPassword.jsx
│   │       │   └── index.js
│   │       └── pages/             # Auth pages [TO CREATE]
│   │           ├── Login.jsx
│   │           ├── Register.jsx
│   │           └── index.js
│   │
│   ├── context/                   # React Context providers
│   │   ├── AuthContext.jsx        # Authentication state [CREATED - PHASE 1]
│   │   ├── ThemeContext.jsx       # Theme management [CREATED - PHASE 1]
│   │   └── NotificationContext.jsx # Notifications [CREATED - PHASE 1]
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.js             # Auth hook [CREATED - PHASE 1]
│   │   ├── useApi.js              # API call hook [CREATED - PHASE 1]
│   │   ├── useDebounce.js         # Debounce hook [CREATED - PHASE 1]
│   │   ├── useLocalStorage.js     # LocalStorage hook [CREATED - PHASE 1]
│   │   └── usePermissions.js      # Permissions hook [CREATED - PHASE 1]
│   │
│   ├── services/                  # API service layer
│   │   ├── api.js                 # Axios instance [CREATED - PHASE 1]
│   │   ├── authService.js         # Auth API [CREATED - PHASE 1]
│   │   ├── adminService.js        # Admin API [CREATED - PHASE 1]
│   │   ├── studentService.js      # Student API [CREATED - PHASE 1]
│   │   ├── teacherService.js      # Teacher API [TO CREATE]
│   │   ├── coachService.js        # Coach API [TO CREATE]
│   │   ├── librarianService.js    # Librarian API [TO CREATE]
│   │   └── commonService.js       # Shared API [TO CREATE]
│   │
│   ├── utils/                     # Utility functions
│   │   ├── validators.js          # Validation functions [CREATED - PHASE 1]
│   │   ├── formatters.js          # Formatting functions [CREATED - PHASE 1]
│   │   ├── dateHelpers.js         # Date utilities [CREATED - PHASE 1]
│   │   ├── axiosInstance.js       # Axios config [EXISTING - USER CREATED]
│   │   └── helpers.js             # General helpers [TO CREATE]
│   │
│   ├── constants/                 # Constants and config
│   │   ├── roles.js               # User roles [CREATED - PHASE 1]
│   │   ├── routes.js              # App routes [CREATED - PHASE 1]
│   │   ├── apiEndpoints.js        # API endpoints [CREATED - PHASE 1]
│   │   ├── permissions.js         # Permission mappings [TO CREATE]
│   │   └── config.js              # App configuration [TO CREATE]
│   │
│   ├── pages/                     # Page components
│   │   ├── AdminDashboard.jsx     # Admin dashboard [EXISTING - USER CREATED]
│   │   ├── StudentDashboard.jsx   # Student dashboard [EXISTING - USER CREATED]
│   │   ├── TeacherDashboard.jsx   # Teacher dashboard [TO CREATE]
│   │   ├── CoachDashboard.jsx     # Coach dashboard [TO CREATE]
│   │   ├── LibrarianDashboard.jsx # Librarian dashboard [TO CREATE]
│   │   ├── NotFound.jsx           # 404 page [TO CREATE]
│   │   └── Unauthorized.jsx       # 401 page [TO CREATE]
│   │
│   ├── App.jsx                    # Main app component [UPDATED - PHASE 1]
│   ├── main.jsx                   # App entry point [EXISTING]
│   └── index.css                  # Global styles [EXISTING]
│
├── .env                           # Environment variables [EXISTING]
├── .env.example                   # Env template [TO CREATE]
├── .gitignore                     # Git ignore [EXISTING]
├── eslint.config.js               # ESLint config [EXISTING]
├── index.html                     # HTML template [EXISTING]
├── package.json                   # Dependencies [EXISTING]
├── postcss.config.js              # PostCSS config [EXISTING]
├── tailwind.config.js             # Tailwind config [UPDATED - PHASE 1]
├── vite.config.js                 # Vite config [EXISTING]
├── README.md                      # Project README [EXISTING]
├── PHASE1_COMPLETE.md             # Phase 1 guide [CREATED]
├── IMPLEMENTATION_SUMMARY.md      # Implementation docs [CREATED]
├── COMPONENT_GUIDE.md             # Component usage guide [CREATED]
└── FOLDER_STRUCTURE.md            # This file [CREATING]
```

---

## 🎯 Role-Based Structure

### **Admin/Principal**

- **Routes**: `/admin/*`
- **Components**: `features/admin/components/*`
- **Pages**: `features/admin/pages/*`
- **Services**: `adminService.js`
- **Features**:
  - Dashboard overview
  - Student management (CRUD)
  - Teacher management (CRUD)
  - Course management (CRUD)
  - Sports management (CRUD)
  - Library management (CRUD)
  - Attendance tracking
  - Results management
  - Notice board
  - Complaint handling
  - Coach management
  - School profile

### **Student**

- **Routes**: `/student/*`
- **Components**: `features/student/components/*`
- **Pages**: `features/student/pages/*`
- **Services**: `studentService.js`
- **Features**:
  - Personal dashboard
  - Profile management
  - Course enrollment
  - Sports registration
  - Attendance viewing
  - Results viewing
  - Library browsing
  - Notice viewing
  - Complaint submission

### **Teacher**

- **Routes**: `/teacher/*`
- **Components**: `features/teacher/components/*`
- **Pages**: `features/teacher/pages/*`
- **Services**: `teacherService.js`
- **Features**:
  - Teacher dashboard
  - Class management
  - Attendance marking
  - Results entry
  - Student progress tracking
  - Notice viewing
  - Subject assignment

### **Coach**

- **Routes**: `/coach/*`
- **Components**: `features/coach/components/*`
- **Pages**: `features/coach/pages/*`
- **Services**: `coachService.js`
- **Features**:
  - Coach dashboard
  - Sports management
  - Participant management
  - Event scheduling
  - Performance tracking
  - Notice viewing

### **Librarian**

- **Routes**: `/librarian/*`
- **Components**: `features/librarian/components/*`
- **Pages**: `features/librarian/pages/*`
- **Services**: `librarianService.js`
- **Features**:
  - Librarian dashboard
  - Book management (CRUD)
  - Book issue/return
  - Transaction history
  - Student book records
  - Book search
  - Fine management

---

## 📊 File Status Legend

- ✅ **[CREATED - PHASE 1]**: Completed in Phase 1
- 📝 **[EXISTING - USER CREATED]**: User's original files
- 🔧 **[UPDATED - PHASE 1]**: Modified in Phase 1
- ⏳ **[TO CREATE]**: Pending implementation

---

## 🔄 Integration Points

### **1. Authentication Flow**

```
Login Component → authService → AuthContext → Protected Routes → Dashboard
```

### **2. API Flow**

```
Component → Service Layer → api.js (Axios) → Backend → Response → Component Update
```

### **3. State Management**

```
AuthContext (User, Role, Token)
ThemeContext (Light/Dark)
NotificationContext (Toast Messages)
```

### **4. Route Protection**

```
ProtectedRoute → Check Auth → Check Role → Allow/Deny → Redirect
```

---

## 📦 Component Categories

### **Common Components** (10 files)

Reusable UI components used across all features

- Button, Input, Select, Modal, Card, Badge, Alert, Loader, Table

### **Layout Components** (4 files)

Application structure components

- Header, Sidebar, DashboardLayout, AuthLayout

### **Feature Components** (To Create)

Role-specific business logic components

- Admin: 9 management components
- Student: 5 view components
- Teacher: 4 teaching components
- Coach: 3 sports components
- Librarian: 4 library components

### **Form Components** (To Create)

Form handling with react-hook-form

- FormInput, FormSelect, FormTextarea, FormDatePicker

---

## 🛠️ Technology Stack

### **Frontend**

- React 19.1.0
- Vite 7.0.0
- React Router DOM 7.6.3
- Tailwind CSS 3.4.17

### **State Management**

- Context API (Auth, Theme, Notifications)
- Custom Hooks (useAuth, useApi, usePermissions)

### **UI/UX**

- Lucide React (Icons)
- Framer Motion (Animations)
- React Hook Form (Forms)

### **API Layer**

- Axios 1.10.0
- Custom interceptors
- Token management

---

## 📋 Next Steps (Phase 2)

1. **Create Teacher Feature** (`features/teacher/`)

   - Components: ClassManagement, AttendanceMarking, ResultsEntry
   - Pages: Dashboard, Classes, Attendance, Results
   - Service: teacherService.js

2. **Create Coach Feature** (`features/coach/`)

   - Components: SportsManagement, ParticipantManagement, EventScheduling
   - Pages: Dashboard, Sports, Participants
   - Service: coachService.js

3. **Create Librarian Feature** (`features/librarian/`)

   - Components: BookManagement, TransactionManagement, IssueReturn
   - Pages: Dashboard, Books, Transactions
   - Service: librarianService.js

4. **Create Form Components** (`components/forms/`)

   - FormInput, FormSelect, FormTextarea, FormDatePicker
   - Integration with react-hook-form

5. **Create Error Pages** (`pages/`)

   - NotFound (404)
   - Unauthorized (401)
   - ServerError (500)

6. **Update Authentication**

   - Add Coach login/register
   - Add Librarian login/register
   - Update authService with all roles

7. **Update Sidebar Navigation**
   - Add Teacher menu items
   - Add Coach menu items
   - Add Librarian menu items

---

## 🎨 Design Patterns Used

### **1. Feature-Based Architecture**

Organize by business domain, not by file type

### **2. Service Layer Pattern**

Separate API logic from UI components

### **3. Custom Hooks Pattern**

Encapsulate reusable logic

### **4. Context + Hooks Pattern**

Global state management without Redux

### **5. Component Composition**

Build complex UIs from simple components

### **6. Protected Routes Pattern**

Role-based access control

---

## 📝 Naming Conventions

### **Files**

- Components: `PascalCase.jsx`
- Services: `camelCase.js`
- Utils: `camelCase.js`
- Constants: `camelCase.js`

### **Folders**

- Features: `lowercase`
- Components: `lowercase`

### **Variables**

- Constants: `UPPER_CASE`
- Functions: `camelCase`
- Components: `PascalCase`

---

**Last Updated**: November 24, 2025
**Status**: Phase 1 Complete | Phase 2 In Planning
