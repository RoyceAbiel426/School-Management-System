/**
 * Validation Rules for react-hook-form
 * Common validation patterns for form fields
 */

export const validationRules = {
  // Email validation
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },

  // Password validation
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message:
        "Password must contain uppercase, lowercase, number and special character",
    },
  },

  // Required field
  required: (fieldName = "This field") => ({
    required: `${fieldName} is required`,
  }),

  // Phone number validation
  phone: {
    required: "Phone number is required",
    pattern: {
      value: /^[0-9]{10,15}$/,
      message: "Invalid phone number (10-15 digits)",
    },
  },

  // Name validation (letters, spaces, hyphens only)
  name: {
    required: "Name is required",
    pattern: {
      value: /^[a-zA-Z\s-']+$/,
      message: "Name can only contain letters, spaces, hyphens and apostrophes",
    },
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
    maxLength: {
      value: 50,
      message: "Name cannot exceed 50 characters",
    },
  },

  // Username validation
  username: {
    required: "Username is required",
    pattern: {
      value: /^[a-zA-Z0-9_-]{3,20}$/,
      message:
        "Username must be 3-20 characters (letters, numbers, underscore, hyphen)",
    },
  },

  // URL validation
  url: {
    pattern: {
      value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message: "Invalid URL format",
    },
  },

  // Number validation
  number: (min, max) => ({
    required: "This field is required",
    min: {
      value: min,
      message: `Minimum value is ${min}`,
    },
    max: {
      value: max,
      message: `Maximum value is ${max}`,
    },
  }),

  // Min length validation
  minLength: (length, fieldName = "This field") => ({
    minLength: {
      value: length,
      message: `${fieldName} must be at least ${length} characters`,
    },
  }),

  // Max length validation
  maxLength: (length, fieldName = "This field") => ({
    maxLength: {
      value: length,
      message: `${fieldName} cannot exceed ${length} characters`,
    },
  }),

  // Date validation (not in the past)
  futureDate: {
    validate: (value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today || "Date cannot be in the past";
    },
  },

  // Date validation (not in the future)
  pastDate: {
    validate: (value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return selectedDate <= today || "Date cannot be in the future";
    },
  },

  // File size validation (in MB)
  fileSize: (maxSizeMB) => ({
    validate: (files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      return (
        file.size <= maxSizeBytes || `File size must not exceed ${maxSizeMB}MB`
      );
    },
  }),

  // File type validation
  fileType: (allowedTypes) => ({
    validate: (files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return (
        allowedTypes.includes(fileExtension) ||
        `Only ${allowedTypes.join(", ")} files are allowed`
      );
    },
  }),

  // Match field validation (e.g., password confirmation)
  matchField: (fieldName, watchValue) => ({
    validate: (value) => value === watchValue || `${fieldName} do not match`,
  }),

  // CNIC/ID validation (Pakistan format)
  cnic: {
    pattern: {
      value: /^[0-9]{5}-[0-9]{7}-[0-9]$/,
      message: "Invalid CNIC format (xxxxx-xxxxxxx-x)",
    },
  },

  // Grade validation (1-14)
  grade: {
    required: "Grade is required",
    min: {
      value: 1,
      message: "Grade must be between 1 and 14",
    },
    max: {
      value: 14,
      message: "Grade must be between 1 and 14",
    },
  },

  // Percentage validation (0-100)
  percentage: {
    required: "Percentage is required",
    min: {
      value: 0,
      message: "Percentage cannot be negative",
    },
    max: {
      value: 100,
      message: "Percentage cannot exceed 100",
    },
  },

  // Custom validation
  custom: (validationFn, errorMessage) => ({
    validate: (value) => validationFn(value) || errorMessage,
  }),
};

/**
 * Helper to combine multiple validation rules
 */
export const combineRules = (...rules) => {
  return rules.reduce((acc, rule) => ({ ...acc, ...rule }), {});
};

/**
 * Common validation patterns for specific fields
 */
export const fieldValidations = {
  // Student fields
  studentName: combineRules(
    validationRules.name,
    validationRules.required("Student name")
  ),
  studentEmail: validationRules.email,
  studentPhone: validationRules.phone,
  studentGrade: validationRules.grade,

  // Teacher fields
  teacherName: combineRules(
    validationRules.name,
    validationRules.required("Teacher name")
  ),
  teacherEmail: validationRules.email,
  teacherPhone: validationRules.phone,
  teacherQualification: validationRules.required("Qualification"),

  // Course fields
  courseName: combineRules(
    validationRules.required("Course name"),
    validationRules.minLength(3, "Course name"),
    validationRules.maxLength(100, "Course name")
  ),
  courseCode: combineRules(
    validationRules.required("Course code"),
    validationRules.minLength(2, "Course code"),
    validationRules.maxLength(20, "Course code")
  ),
  courseDescription: validationRules.maxLength(500, "Course description"),

  // Exam fields
  examName: combineRules(
    validationRules.required("Exam name"),
    validationRules.minLength(3, "Exam name")
  ),
  examDate: combineRules(
    validationRules.required("Exam date"),
    validationRules.futureDate
  ),
  totalMarks: validationRules.number(1, 1000),
  passingMarks: validationRules.number(1, 1000),

  // Book fields (Library)
  bookTitle: combineRules(
    validationRules.required("Book title"),
    validationRules.minLength(2)
  ),
  bookISBN: {
    pattern: {
      value:
        /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
      message: "Invalid ISBN format",
    },
  },
  bookAuthor: combineRules(
    validationRules.required("Author name"),
    validationRules.name
  ),

  // Notice fields
  noticeTitle: combineRules(
    validationRules.required("Notice title"),
    validationRules.minLength(5, "Notice title")
  ),
  noticeDescription: combineRules(
    validationRules.required("Notice description"),
    validationRules.minLength(10, "Notice description")
  ),
};
