/**
 * User roles constants
 */
export const ROLES = {
  ADMIN: "admin",
  PRINCIPAL: "principal",
  SUPER_ADMIN: "super_admin",
  MODERATOR: "moderator",
  STUDENT: "student",
  TEACHER: "teacher",
  COACH: "coach",
  LIBRARIAN: "librarian",
  GRADE_INCHARGE: "grade_incharge",
  CLASS_TEACHER: "class_teacher",
};

/**
 * Role display names
 */
export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.PRINCIPAL]: "Principal",
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.MODERATOR]: "Moderator",
  [ROLES.STUDENT]: "Student",
  [ROLES.TEACHER]: "Teacher",
  [ROLES.COACH]: "Coach",
  [ROLES.LIBRARIAN]: "Librarian",
  [ROLES.GRADE_INCHARGE]: "Grade Incharge",
  [ROLES.CLASS_TEACHER]: "Class Teacher",
};

/**
 * School types
 */
export const SCHOOL_TYPES = {
  BOYS: "boys",
  GIRLS: "girls",
  MIXED: "mixed",
};

export const SCHOOL_TYPE_LABELS = {
  [SCHOOL_TYPES.BOYS]: "Boys' School",
  [SCHOOL_TYPES.GIRLS]: "Girls' School",
  [SCHOOL_TYPES.MIXED]: "Mixed School",
};

/**
 * User status
 */
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING: "pending",
};

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: "Active",
  [USER_STATUS.INACTIVE]: "Inactive",
  [USER_STATUS.SUSPENDED]: "Suspended",
  [USER_STATUS.PENDING]: "Pending",
};
