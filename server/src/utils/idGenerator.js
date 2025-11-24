/**
 * ID Generator Utility
 *
 * Generates unique IDs for schools, students, and teachers according to PDP specifications:
 * - School ID: sch_XXXY (XXX=auto-increment, Y=b/g/m for school type)
 * - Student ID: st + schoolLast4 + NIC_last4
 * - Teacher ID: te + schoolLast4 + NIC_last4
 */

import Admin from "../models/Admin.js";

/**
 * Generate unique school ID
 *
 * Format: sch_XXXY
 * - sch_ = prefix
 * - XXX = 3-digit auto-increment number (001, 002, ... 999)
 * - Y = school type (b=boys, g=girls, m=mixed)
 *
 * @param {String} schoolType - School type: 'boys', 'girls', or 'mixed'
 * @returns {Promise<String>} Generated school ID (e.g., 'sch_010m')
 * @throws {Error} If schoolType is invalid or max schools reached
 */
export const generateSchoolID = async (schoolType) => {
  // Validate school type
  const typeMap = {
    boys: "b",
    girls: "g",
    mixed: "m",
  };

  const typeSuffix = typeMap[schoolType?.toLowerCase()];
  if (!typeSuffix) {
    throw new Error("Invalid school type. Must be: boys, girls, or mixed");
  }

  // Find the highest school ID number
  const lastSchool = await Admin.findOne({ schoolID: { $exists: true } })
    .sort({ schoolID: -1 })
    .select("schoolID")
    .lean();

  let nextNumber = 1;

  if (lastSchool?.schoolID) {
    // Extract number from previous school ID (e.g., 'sch_010m' -> 10)
    const match = lastSchool.schoolID.match(/^sch_(\d{3})[bgm]$/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  // Check if we've reached the maximum (999)
  if (nextNumber > 999) {
    throw new Error("Maximum number of schools (999) reached");
  }

  // Format number with leading zeros (e.g., 1 -> '001')
  const paddedNumber = String(nextNumber).padStart(3, "0");

  return `sch_${paddedNumber}${typeSuffix}`;
};

/**
 * Generate student ID
 *
 * Format: st + schoolLast4 + NIC_last4
 * - st = prefix
 * - schoolLast4 = last 4 characters of school ID
 * - NIC_last4 = last 4 digits of student's NIC
 *
 * @param {String} schoolID - School ID (e.g., 'sch_010m')
 * @param {String} nic - Student's NIC number
 * @returns {String} Generated student ID (e.g., 'st010m1099')
 * @throws {Error} If schoolID or NIC is invalid
 */
export const generateStudentID = (schoolID, nic) => {
  // Validate inputs
  if (!schoolID || typeof schoolID !== "string") {
    throw new Error("Invalid school ID provided");
  }

  if (!nic || typeof nic !== "string") {
    throw new Error("Invalid NIC provided");
  }

  // Extract last 4 characters of school ID
  const schoolLast4 = schoolID.slice(-4);

  if (schoolLast4.length !== 4) {
    throw new Error("School ID must be at least 4 characters long");
  }

  // Extract last 4 digits from NIC (ignore any non-digit characters)
  const nicDigits = nic.replace(/\D/g, ""); // Remove all non-digits

  if (nicDigits.length < 4) {
    throw new Error("NIC must contain at least 4 digits");
  }

  const nicLast4 = nicDigits.slice(-4);

  return `st${schoolLast4}${nicLast4}`;
};

/**
 * Generate teacher ID
 *
 * Format: te + schoolLast4 + NIC_last4
 * - te = prefix
 * - schoolLast4 = last 4 characters of school ID
 * - NIC_last4 = last 4 digits of teacher's NIC
 *
 * @param {String} schoolID - School ID (e.g., 'sch_010m')
 * @param {String} nic - Teacher's NIC number
 * @returns {String} Generated teacher ID (e.g., 'te010m1102')
 * @throws {Error} If schoolID or NIC is invalid
 */
export const generateTeacherID = (schoolID, nic) => {
  // Validate inputs
  if (!schoolID || typeof schoolID !== "string") {
    throw new Error("Invalid school ID provided");
  }

  if (!nic || typeof nic !== "string") {
    throw new Error("Invalid NIC provided");
  }

  // Extract last 4 characters of school ID
  const schoolLast4 = schoolID.slice(-4);

  if (schoolLast4.length !== 4) {
    throw new Error("School ID must be at least 4 characters long");
  }

  // Extract last 4 digits from NIC (ignore any non-digit characters)
  const nicDigits = nic.replace(/\D/g, ""); // Remove all non-digits

  if (nicDigits.length < 4) {
    throw new Error("NIC must contain at least 4 digits");
  }

  const nicLast4 = nicDigits.slice(-4);

  return `te${schoolLast4}${nicLast4}`;
};

/**
 * Validate school ID format
 *
 * @param {String} schoolID - School ID to validate
 * @returns {Boolean} True if valid, false otherwise
 */
export const isValidSchoolID = (schoolID) => {
  return /^sch_\d{3}[bgm]$/.test(schoolID);
};

/**
 * Validate student ID format
 *
 * @param {String} studentID - Student ID to validate
 * @returns {Boolean} True if valid, false otherwise
 */
export const isValidStudentID = (studentID) => {
  return /^st\d{3}[bgm]\d{4}$/.test(studentID);
};

/**
 * Validate teacher ID format
 *
 * @param {String} teacherID - Teacher ID to validate
 * @returns {Boolean} True if valid, false otherwise
 */
export const isValidTeacherID = (teacherID) => {
  return /^te\d{3}[bgm]\d{4}$/.test(teacherID);
};

/**
 * Extract school ID from student or teacher ID
 *
 * @param {String} userID - Student or teacher ID
 * @returns {String|null} Extracted school ID or null if invalid
 */
export const extractSchoolID = (userID) => {
  // Check if it's a student ID (st010m1099) or teacher ID (te010m1102)
  const match = userID.match(/^(st|te)(\d{3}[bgm])\d{4}$/);

  if (match) {
    return `sch_${match[2]}`;
  }

  return null;
};
