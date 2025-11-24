# Database Models - Edu-Pro System

**Project:** Edu-Pro School Management System
**Last Updated:** November 24, 2025
**Status:** ✅ Implemented

---

## Overview

Our system uses **15 separate models** to manage school operations, student records, academic tracking, and administrative functions. We chose separate Admin, Student, and Teacher models (not a unified User model) for clear role separation and specific field requirements.

---

## Implemented Models

### **Core User Models**

1. **Admin** - School administrators and principals
2. **Student** - Students enrolled in schools
3. **Teacher** - Teaching staff
4. **Coach** - Sports coaches

### **School Structure**

5. **ClassGroup** - Classroom sections (e.g., 10A, 10B)
6. **Course** - Academic courses/subjects
7. **Module** - Course modules/units

### **Academic Records**

8. **Attendance** - Daily student attendance tracking
9. **Exam** - Examination records
10. **Result** - Student exam results

### **Communication & Operations**

11. **Notice** - Announcements and notices
12. **Complain** - Complaints from all users

### **Library Management**

13. **Book** - Library book inventory
14. **LibraryTransaction** - Book issue/return records

### **Sports & Activities**

15. **Sport** - Sports activities and teams

---

## Model Details & Schemas

### 1. Admin Model

**File:** `src/models/Admin.js`

**Purpose:** School administrators and principals with comprehensive permissions

**Key Fields:**

```javascript
{
  adminID: String,           // Format: adm0001, adm0002 (auto-generated)
  schoolID: String,          // Format: sch_010m (school identifier)
  schoolName: String,        // Unique school name
  schoolType: String,        // "boys", "girls", "mixed"
  role: String,              // "super_admin", "admin", "moderator", "principal"
  email: String,
  password: String,          // Hashed with bcrypt
  contact: String,
  address: String,
  permissions: Object,       // Granular CRUD for students, courses, sports, etc.
  status: String             // "active", "inactive", "suspended"
}
```

**Features:**

- Password hashing with bcrypt
- Permission checking method: `hasPermission(resource, action)`
- School profile fields (schoolEmail, establishedYear)

---

### 2. Student Model

**File:** `src/models/Student.js`

**Purpose:** Student records with school affiliation

**Key Fields:**

```javascript
{
  studentID: String,         // Format: st010m1099 (st + schoolLast4 + NIC_last4)
  schoolID: String,          // Format: sch_010m (references school)
  nic: String,               // National Identity Card
  rollNum: Number,           // Roll number in class
  classGroup: ObjectId,      // Reference to ClassGroup
  courses: [ObjectId],       // Array of enrolled courses
  sports: [ObjectId],        // Array of sports participation
  email: String,
  password: String,          // Hashed with bcrypt
  contact: String,
  birth: Date,
  gender: String,            // "male", "female", "other"
  status: String             // "active", "inactive", "suspended"
}
```

**Features:**

- Password hashing with bcrypt
- School verification during registration
- Gender validation matching school type (boys/girls/mixed)

---

### 3. Teacher Model

**File:** `src/models/Teacher.js`

**Purpose:** Teaching staff records

**Key Fields:**

```javascript
{
  teacherID: String,         // Format: te010m1102 (te + schoolLast4 + NIC_last4)
  school: String,            // School ID reference
  nic: String,               // National Identity Card
  teachSubject: ObjectId,    // Reference to Course
  teachSclass: ObjectId,     // Reference to ClassGroup
  attendance: [Object],      // Attendance tracking records
  email: String,
  password: String,          // Hashed with bcrypt
  role: String               // "Teacher"
}
```

**Features:**

- Password hashing with bcrypt
- Subject and class assignment
- Attendance tracking capability

---

### 4. ClassGroup Model

**File:** `src/models/ClassGroup.js`

**Purpose:** Classroom sections with automatic allocation

**Key Fields:**

```javascript
{
  name: String,              // Section name (e.g., "10A", "10B")
  grade: Number,             // Grade level (1-14)
  section: String,           // Section letter (A-E)
  maxStudents: Number,       // Maximum 30 students per class
  students: [ObjectId],      // Array of student references
  teacher: ObjectId,         // Class teacher reference
  school: ObjectId           // School reference
}
```

**Auto-Allocation Rules:**

- Each classroom holds maximum 30 students
- Sections: A, B, C, D, E (up to 150 students per grade)
- Example: Grade 10 with 75 students → 10A (30), 10B (30), 10C (15)

---

### 5. Course Model

**File:** `src/models/Course.js`

**Purpose:** Academic courses and subjects

**Key Fields:**

```javascript
{
  courseID: String,
  courseName: String,
  description: String,
  modules: [ObjectId],       // Array of module references
  teacher: ObjectId,         // Teacher reference
  duration: Number           // Duration in weeks
}
```

---

### 6. Module Model

**File:** `src/models/Module.js`

**Purpose:** Course modules/units

**Key Fields:**

```javascript
{
  moduleID: String,
  moduleName: String,
  description: String,
  credits: Number,
  instructor: ObjectId       // Instructor reference
}
```

---

### 7. Attendance Model

**File:** `src/models/Attendance.js`

**Purpose:** Daily student attendance tracking

**Key Fields:**

```javascript
{
  student: ObjectId,         // Student reference
  date: Date,                // Attendance date
  present: Boolean,          // true/false
  takenBy: ObjectId          // Teacher who marked attendance
}
```

**Workflow:**

- Class teacher marks daily attendance
- Submission deadline: 8:30 PM
- System finalizes at 9:00 PM (no further edits)

---

### 8. Exam Model

**File:** `src/models/Exam.js`

**Purpose:** Examination records

**Key Fields:**

```javascript
{
  examName: String,
  examDate: Date,
  course: ObjectId,
  maxScore: Number
}
```

---

### 9. Result Model

**File:** `src/models/Result.js`

**Purpose:** Student exam results

**Key Fields:**

```javascript
{
  student: ObjectId,         // Student reference
  exam: ObjectId,            // Exam reference
  module: ObjectId,          // Module reference
  score: Number,
  grade: String              // Letter grade
}
```

---

### 10. Notice Model

**File:** `src/models/Notice.js`

**Purpose:** Hierarchical notice management

**Key Fields:**

```javascript
{
  title: String,
  description: String,
  postedBy: ObjectId,
  targetAudience: String,    // "all", "students", "teachers", "specific-class"
  priority: String           // "low", "medium", "high", "urgent"
}
```

**Hierarchy:**

- **Principal** → Can post to entire school
- **Supervisor (Grade Incharge)** → Can post to grade group classrooms
- **Class Teacher** → Can post to own classroom only

---

### 11. Complain Model

**File:** `src/models/Complain.js`

**Purpose:** Complaint tracking system

**Key Fields:**

```javascript
{
  complainer: ObjectId,      // User who submitted complaint
  description: String,
  category: String,
  priority: String,
  status: String,            // "pending", "in-review", "resolved"
  assignedTo: ObjectId       // Admin/staff handling complaint
}
```

**Workflow:**

- All users (students, teachers, staff) can submit complaints
- All complaints go to Principal
- Principal forwards to appropriate department
- Status tracking: pending → in-review → resolved

---

### 12. Book Model

**File:** `src/models/Book.js`

**Purpose:** Library book inventory

**Key Fields:**

```javascript
{
  isbn: String,
  title: String,
  author: String,
  totalCopies: Number,
  availableCopies: Number,
  category: String,
  publicationYear: Number
}
```

---

### 13. LibraryTransaction Model

**File:** `src/models/LibraryTransaction.js`

**Purpose:** Book issue/return tracking

**Key Fields:**

```javascript
{
  bookID: ObjectId,
  borrowedBy: ObjectId,
  borrowDate: Date,
  returnDate: Date,
  status: String,            // "borrowed", "returned", "overdue"
  fine: Number               // Fine amount for late returns
}
```

**Management:**

- Managed by Librarian/Assistant Librarian
- Inventory updated when physical book received
- Fine calculation for overdue books

---

### 14. Coach Model

**File:** `src/models/Coach.js`

**Purpose:** Sports coaching staff

**Key Fields:**

```javascript
{
  coachID: String,
  name: String,
  email: String,
  password: String,          // Hashed with bcrypt
  specialization: String,
  contact: String
}
```

---

### 15. Sport Model

**File:** `src/models/Sport.js`

**Purpose:** Sports activities and teams

**Key Fields:**

```javascript
{
  sportName: String,
  coach: ObjectId,           // Coach reference
  captain: ObjectId,         // Student captain
  participants: [ObjectId],  // Array of student references
  category: String           // "indoor", "outdoor"
}
```

**Features:**

- Head Coach and Assistant Coach roles
- Student registration and approval process
- Age category management

---

## ID Generation Patterns

### School ID

- **Format:** `sch_XXXY`
- **XXX:** Auto-increment (001-999)
- **Y:** School type (b=boys, g=girls, m=mixed)
- **Examples:** `sch_001b`, `sch_010m`, `sch_999g`

### Admin ID

- **Format:** `admXXXX`
- **XXXX:** Auto-increment (0001-9999)
- **Example:** `adm0001`, `adm0002`

### Student ID

- **Format:** `st + schoolLast4 + NIC_last4`
- **Example:** School `sch_010m` + NIC `200012345678` = `st010m5678`

### Teacher ID

- **Format:** `te + schoolLast4 + NIC_last4`
- **Example:** School `sch_010m` + NIC `198512348765` = `te010m8765`

---

## Design Decisions

### Why Separate Models (Not Unified User)?

**Chosen Approach:** Separate Admin, Student, Teacher models

**Reasons:**

1. **Clear Role Separation:** Each role has distinct fields and requirements
2. **Specific Validation:** Different validation rules per user type
3. **School Affiliation:** Students/Teachers link to schools differently than Admins
4. **ID Generation:** Each role needs different ID formats
5. **Permissions:** Admins have granular permissions, students/teachers don't

**Trade-offs:**

- ✅ Better type safety and validation
- ✅ Easier to extend role-specific features
- ✅ Clear separation of concerns
- ⚠️ More models to manage
- ⚠️ Authentication requires role-specific controllers

---

## Model Relationships

```
Admin (1) ----< (N) Students
       (1) ----< (N) Teachers
       (1) ----< (N) ClassGroups

ClassGroup (1) ----< (N) Students
           (1) ---- (1) Teacher (class teacher)

Student (N) ----< (N) Courses
        (N) ----< (N) Sports
        (1) ----< (N) Attendance
        (1) ----< (N) Results

Course (1) ----< (N) Modules
       (1) ----< (N) Students

Exam (1) ----< (N) Results

Book (1) ----< (N) LibraryTransactions

Sport (1) ---- (1) Coach
      (N) ----< (N) Students (participants)
```

---

## Implementation Status

| Model              | Status | File Location                      |
| ------------------ | ------ | ---------------------------------- |
| Admin              | ✅     | `src/models/Admin.js`              |
| Student            | ✅     | `src/models/Student.js`            |
| Teacher            | ✅     | `src/models/Teacher.js`            |
| ClassGroup         | ✅     | `src/models/ClassGroup.js`         |
| Course             | ✅     | `src/models/Course.js`             |
| Module             | ✅     | `src/models/Module.js`             |
| Attendance         | ✅     | `src/models/Attendance.js`         |
| Exam               | ✅     | `src/models/Exam.js`               |
| Result             | ✅     | `src/models/Result.js`             |
| Notice             | ✅     | `src/models/Notice.js`             |
| Complain           | ✅     | `src/models/Complain.js`           |
| Book               | ✅     | `src/models/Book.js`               |
| LibraryTransaction | ✅     | `src/models/LibraryTransaction.js` |
| Coach              | ✅     | `src/models/Coach.js`              |
| Sport              | ✅     | `src/models/Sport.js`              |

**Total:** 15 models implemented and tested

---

## Authentication Architecture

### Password Security

All user models (Admin, Student, Teacher, Coach) implement:

- **bcrypt hashing** with 10 rounds
- **Pre-save hook** to hash passwords automatically
- **comparePassword method** for login verification

### JWT Tokens

- **Token expiration:** 24 hours
- **Payload includes:** user ID, role, email
- **Protected routes** use role-based middleware

### Role-Based Access Control

- `authMiddleware` - Universal JWT verification
- `requireRole(...roles)` - Multi-role access control
- `adminAuth`, `teacherAuth`, `studentAuth` - Role-specific guards
- `checkPermission(resource, action)` - Granular admin permissions

---

## Validation Rules

### Email

- Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Must be unique per model

### Contact/Phone

- Pattern: `/^\+?\d{10,15}$/`
- Supports international format with +

### School ID

- Pattern: `/^sch_\d{3}[bgm]$/`
- Examples: `sch_001b`, `sch_010m`

### Student ID

- Pattern: `/^st\d{3}[bgm]\d{4}$/`
- Examples: `st010m1099`, `st001b5678`

### Teacher ID

- Pattern: `/^te\d{3}[bgm]\d{4}$/`
- Examples: `te010m1102`, `te001b8765`

### Admin ID

- Pattern: `/^adm\d{4}$/`
- Examples: `adm0001`, `adm0002`

---

## Database Indexing

**Indexed Fields:**

- `email` (unique) - All user models
- `studentID` (unique) - Student model
- `teacherID` (unique) - Teacher model
- `adminID` (unique) - Admin model
- `schoolID` (unique) - Admin model
- `schoolName` (unique, sparse) - Admin model

**Purpose:** Fast lookups, uniqueness enforcement, query optimization

---

## Future Enhancements

### Potential Additions

- **Assignment & Submission** models for homework tracking
- **Timetable/Schedule** model for class scheduling
- **Message/Chat** model for internal communication
- **Event** model for school calendar
- **Fee** model for payment tracking

### Optimization Opportunities

- Implement caching for frequently accessed data
- Add full-text search for notices and books
- Paginate large result sets
- Archive old attendance and result records

---

**Documentation Version:** 1.0
**Last Updated:** November 24, 2025
**Backend Status:** ✅ Production Ready
