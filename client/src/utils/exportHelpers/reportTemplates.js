/**
 * Report Templates for Edu-Pro
 * Pre-configured templates for common reports
 */

/**
 * Attendance Report Template
 */
export const attendanceReportTemplate = {
  title: "Attendance Report",
  columns: [
    { header: "Student ID", key: "studentId" },
    { header: "Student Name", key: "studentName" },
    { header: "Grade", key: "grade" },
    { header: "Class", key: "class" },
    { header: "Date", key: "date", type: "date" },
    { header: "Status", key: "status" },
    { header: "Marked By", key: "markedBy" },
  ],
  orientation: "landscape",
  pageSize: "a4",
};

/**
 * Results Report Template
 */
export const resultsReportTemplate = {
  title: "Examination Results Report",
  columns: [
    { header: "Student ID", key: "studentId" },
    { header: "Student Name", key: "studentName" },
    { header: "Grade", key: "grade" },
    { header: "Subject", key: "subject" },
    { header: "Exam Type", key: "examType" },
    { header: "Marks Obtained", key: "marksObtained" },
    { header: "Total Marks", key: "totalMarks" },
    { header: "Percentage", key: "percentage" },
    { header: "Grade", key: "letterGrade" },
    { header: "Status", key: "status" },
  ],
  orientation: "landscape",
  pageSize: "a4",
};

/**
 * Student List Report Template
 */
export const studentListReportTemplate = {
  title: "Student List Report",
  columns: [
    { header: "Student ID", key: "studentId" },
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Grade", key: "grade" },
    { header: "Class", key: "class" },
    { header: "Gender", key: "gender" },
    { header: "Contact", key: "contact" },
    { header: "Enrollment Date", key: "enrollmentDate", type: "date" },
  ],
  orientation: "landscape",
  pageSize: "a4",
};

/**
 * Teacher List Report Template
 */
export const teacherListReportTemplate = {
  title: "Teacher List Report",
  columns: [
    { header: "Teacher ID", key: "teacherId" },
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Subjects", key: "subjects" },
    { header: "Classes Assigned", key: "classesAssigned" },
    { header: "Contact", key: "contact" },
    { header: "Join Date", key: "joinDate", type: "date" },
  ],
  orientation: "landscape",
  pageSize: "a4",
};

/**
 * Library Books Report Template
 */
export const libraryBooksReportTemplate = {
  title: "Library Books Catalog",
  columns: [
    { header: "Book ID", key: "bookId" },
    { header: "Title", key: "title" },
    { header: "Author", key: "author" },
    { header: "ISBN", key: "isbn" },
    { header: "Category", key: "category" },
    { header: "Total Copies", key: "totalCopies" },
    { header: "Available", key: "availableCopies" },
    { header: "Publisher", key: "publisher" },
    { header: "Year", key: "publicationYear" },
  ],
  orientation: "landscape",
  pageSize: "a4",
};

/**
 * Library Transactions Report Template
 */
export const libraryTransactionsReportTemplate = {
  title: "Library Transactions Report",
  columns: [
    { header: "Transaction ID", key: "transactionId" },
    { header: "Student ID", key: "studentId" },
    { header: "Student Name", key: "studentName" },
    { header: "Book Title", key: "bookTitle" },
    { header: "Issue Date", key: "issueDate", type: "date" },
    { header: "Due Date", key: "dueDate", type: "date" },
    { header: "Return Date", key: "returnDate", type: "date" },
    { header: "Status", key: "status" },
    { header: "Fine", key: "fine" },
  ],
  orientation: "landscape",
  pageSize: "a4",
};

/**
 * Sports Participants Report Template
 */
export const sportsParticipantsReportTemplate = {
  title: "Sports Participants Report",
  columns: [
    { header: "Student ID", key: "studentId" },
    { header: "Student Name", key: "studentName" },
    { header: "Sport", key: "sport" },
    { header: "Category", key: "category" },
    { header: "Registration Date", key: "registrationDate", type: "date" },
    { header: "Coach", key: "coachName" },
    { header: "Status", key: "status" },
  ],
  orientation: "portrait",
  pageSize: "a4",
};

/**
 * Course Enrollment Report Template
 */
export const courseEnrollmentReportTemplate = {
  title: "Course Enrollment Report",
  columns: [
    { header: "Course ID", key: "courseId" },
    { header: "Course Name", key: "courseName" },
    { header: "Grade", key: "grade" },
    { header: "Teacher", key: "teacherName" },
    { header: "Total Students", key: "totalStudents" },
    { header: "Duration (Weeks)", key: "duration" },
    { header: "Modules", key: "modulesCount" },
  ],
  orientation: "portrait",
  pageSize: "a4",
};

/**
 * Monthly Attendance Summary Template
 */
export const monthlyAttendanceSummaryTemplate = {
  title: "Monthly Attendance Summary",
  columns: [
    { header: "Student ID", key: "studentId" },
    { header: "Student Name", key: "studentName" },
    { header: "Grade", key: "grade" },
    { header: "Class", key: "class" },
    { header: "Total Days", key: "totalDays" },
    { header: "Present", key: "presentDays" },
    { header: "Absent", key: "absentDays" },
    { header: "Late", key: "lateDays" },
    { header: "Leave", key: "leaveDays" },
    { header: "Attendance %", key: "attendancePercentage" },
  ],
  orientation: "landscape",
  pageSize: "a4",
};

/**
 * Exam Schedule Report Template
 */
export const examScheduleReportTemplate = {
  title: "Examination Schedule",
  columns: [
    { header: "Exam ID", key: "examId" },
    { header: "Exam Name", key: "examName" },
    { header: "Subject", key: "subject" },
    { header: "Grade", key: "grade" },
    { header: "Date", key: "date", type: "date" },
    { header: "Time", key: "time" },
    { header: "Duration (mins)", key: "duration" },
    { header: "Total Marks", key: "totalMarks" },
    { header: "Venue", key: "venue" },
  ],
  orientation: "landscape",
  pageSize: "a4",
};

/**
 * Overdue Books Report Template
 */
export const overdueBooksReportTemplate = {
  title: "Overdue Books Report",
  columns: [
    { header: "Student ID", key: "studentId" },
    { header: "Student Name", key: "studentName" },
    { header: "Book Title", key: "bookTitle" },
    { header: "Issue Date", key: "issueDate", type: "date" },
    { header: "Due Date", key: "dueDate", type: "date" },
    { header: "Days Overdue", key: "daysOverdue" },
    { header: "Fine Amount", key: "fineAmount" },
    { header: "Contact", key: "contact" },
  ],
  orientation: "portrait",
  pageSize: "a4",
};

/**
 * Generate report metadata
 */
export const generateReportMetadata = (generatedBy, schoolName) => ({
  generatedBy,
  generatedAt: new Date(),
  schoolName,
  reportId: `RPT-${Date.now()}`,
});

/**
 * Get template by name
 */
export const getReportTemplate = (templateName) => {
  const templates = {
    attendance: attendanceReportTemplate,
    results: resultsReportTemplate,
    studentList: studentListReportTemplate,
    teacherList: teacherListReportTemplate,
    libraryBooks: libraryBooksReportTemplate,
    libraryTransactions: libraryTransactionsReportTemplate,
    sportsParticipants: sportsParticipantsReportTemplate,
    courseEnrollment: courseEnrollmentReportTemplate,
    monthlyAttendance: monthlyAttendanceSummaryTemplate,
    examSchedule: examScheduleReportTemplate,
    overdueBooks: overdueBooksReportTemplate,
  };

  return templates[templateName] || null;
};

/**
 * Available report templates
 */
export const availableTemplates = [
  { id: "attendance", name: "Attendance Report", category: "Academic" },
  { id: "results", name: "Results Report", category: "Academic" },
  { id: "studentList", name: "Student List", category: "Administration" },
  { id: "teacherList", name: "Teacher List", category: "Administration" },
  { id: "libraryBooks", name: "Library Books Catalog", category: "Library" },
  {
    id: "libraryTransactions",
    name: "Library Transactions",
    category: "Library",
  },
  { id: "sportsParticipants", name: "Sports Participants", category: "Sports" },
  { id: "courseEnrollment", name: "Course Enrollment", category: "Academic" },
  {
    id: "monthlyAttendance",
    name: "Monthly Attendance Summary",
    category: "Academic",
  },
  { id: "examSchedule", name: "Exam Schedule", category: "Academic" },
  { id: "overdueBooks", name: "Overdue Books", category: "Library" },
];
