# **Online School Management System — Complete & Enhanced Specification**

---

# **1. Admin Registration & Onboarding**

### **1.1 Admin Registration**

The school administrator (Principal) registers using:

- Email
- Username
- Password
- Confirm Password

After successful registration, the admin logs in using these credentials.

### **1.2 Initial Onboarding**

Once logged in for the first time:

1. Admin is redirected to the **Dashboard**.
2. Admin must create:

   - **School Profile**
   - **Personal Profile (Principal Profile)**

Only after these steps can the admin access all system modules.

---

# **2. School Profile**

A school profile contains all foundational information such as:

- Classrooms
- Grades
- Subjects
- Teachers
- Students
- Library
- Sports Ground

### **2.1 School Type**

Admin must choose one:

- **Boys’ School**
- **Girls’ School**
- **Mixed School**

This selection affects student registration and system access.

---

# **3. School ID Generation**

When a school is created, the system generates:

### **Format**

```
sch_XXXY
```

- `sch_` → Prefix
- `XXX` → Auto-increment 3-digit number (001, 002, … 010 …)
- `Y` → School type:

  - **b** = Boys
  - **g** = Girls
  - **m** = Mixed

### **Example**

```
sch_010m
```

---

# **4. School Structure Setup**

Once the school profile is created, the admin configures the components.

---

## **4.1 Grades & Classrooms**

### **4.1.1 Grade Creation**

Admin can:

- Create all grades at once (e.g., Grade 1 to Grade 14)
- Or add grades individually

### **4.1.2 Classroom Creation Rules**

Each grade has multiple sections based on student count:

- **Each classroom holds maximum 30 students**
- Allocation example for Grade 10:

  - First 30 students → **10A**
  - Next 30 → **10B**
  - Next 30 → **10C**
  - Up to 150 students → **10A–10E**

Classrooms auto-generate based on student load.

### **4.1.3 Grade Incharge & Class Teacher**

- **Grade Incharges (Supervisors)** are assigned to groups of grades:
  - One supervisor for grades 1-5
  - One supervisor for grades 6-9
  - One supervisor for grades 10-11
  - One supervisor for grades 12-14 (Advanced Level: 1st year, 2nd year, final year)
- Each **classroom** has a **Class Teacher**.
- Responsibilities:

#### **Grade Incharge**

- Oversees all classrooms in their assigned grade group
- Assigns teachers
- Manages academic coordination

#### **Class Teacher**

- Manages **exactly one classroom**
- Takes daily attendance
- Handles classroom notices
- Maintains discipline & student management (30 students max)

---

## **4.2 Library Module**

Each school has **one library**.

### **Library Staff**

- **Librarian**
- **Assistant Librarian**

### **Library Operations**

- Books and inventory updates are done **when the librarian/assistant receives the physical book**.
- They can update:

  - New books
  - Issued/returned books
  - Damaged/missing books
  - Library notices

---

## **4.3 Sports Module**

Each school has **one sports ground**.

### **Sports Staff**

- **Head Coach**
- **Assistant Coach**

### **Sports Operations**

- Coaches update:

  - Sports categories (Indoor / Outdoor)
  - Age categories
  - Upcoming sports events
  - Registrations for sports teams

### **Student Participation**

- Students register for a sport.
- Coaches review applications and **approve/deny** selections.

---

# **5. Student Registration & ID Generation**

### **5.1 Student Registration Details**

Students provide:

- Email
- NIC
- School
- Gender

System validates:

- Student gender matches school type
- Student belongs to the selected school

If valid → Student gets access to student portal.

---

## **5.2 Student Username Format**

```
st + schoolLast4 + NIC_last4
```

### Example

School ID last 4 = `010m`
NIC last 4 = `1099`

Generated Student ID:

```
st010m1099
```

---

# **6. Teacher Registration & ID Generation**

Teachers follow the same structure:

### **Teacher Username Format**

```
te + schoolLast4 + NIC_last4
```

Example:

```
te010m1102
```

Teachers receive system-generated credentials upon approval by the admin.

---

# **7. Attendance System**

### **7.1 Class Attendance**

- Taken **daily by Class Teacher**.
- Class Teacher marks:

  - Present
  - Absent

### **7.2 Submission Timing**

- Attendance for the day must be completed **by 8:30 PM**.
- System **updates/finalizes records at 9:00 PM**.

  - After 9:00 PM → no further edits allowed.

---

# **8. Notice Management System**

Notices propagate **downward** based on hierarchy.

### **8.1 Notice Creation Permissions**

| Role                            | Can Post Notice To                           |
| ------------------------------- | -------------------------------------------- |
| **Principal**                   | Entire school (all modules, all users)       |
| **Supervisor (Grade Incharge)** | All classrooms in their assigned grade group |
| **Class Teacher**               | Only their classroom students                |

### **Types of Notices**

- Announcements
- Exam schedules
- Events
- Urgent instructions
- Sports/library updates

---

# **9. Complaint Management System**

### **Who Can Submit Complaints?**

**Every user** in the system:

- Students
- Teachers
- Supervisors
- Sports staff
- Library staff

### **Complaint Handling**

- All complaints go **directly to the Principal**.
- Principal reviews and forwards to the appropriate department:

  - Supervisor (Academic issues)
  - Sports
  - Library
  - Admin staff
  - Teacher/class teacher

Principal can mark complaints as:

- Pending
- In review
- Resolved

---

# **10. User Roles Summary**

| Role                            | Responsibilities                                                                |
| ------------------------------- | ------------------------------------------------------------------------------- |
| **Principal (Admin)**           | School creation, staff management, notices to all, complaint oversight          |
| **Supervisor (Grade Incharge)** | Grade group management, classroom teacher assignment, grade group-level notices |
| **Class Teacher**               | Attendance, classroom notices, student management                               |
| **Teacher**                     | Teaching assigned subjects                                                      |
| **Librarian/Assistant**         | Book management, library notices                                                |
| **Head/Assistant Coach**        | Sports management, team selection                                               |
| **Student**                     | Attend classes, participate in sports, view notices                             |

---
