/**
 * Formatting utility functions
 */

/**
 * Format date to readable string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
};

/**
 * Format date to short format (MM/DD/YYYY)
 */
export const formatDateShort = (date) => {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString("en-US");
};

/**
 * Format date to long format
 */
export const formatDateLong = (date) => {
  return formatDate(date, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format time
 */
export const formatTime = (date, options = {}) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  const defaultOptions = {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return "";
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diff = now - dateObj;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 0) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return "";

  // Remove non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX for 10-digit US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }

  // Return original if not standard format
  return phone;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50, suffix = "...") => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + suffix;
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize words
 */
export const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
};

/**
 * Format user name
 */
export const formatUserName = (firstName, lastName) => {
  if (!firstName && !lastName) return "Unknown User";
  if (!lastName) return firstName;
  if (!firstName) return lastName;
  return `${firstName} ${lastName}`;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return "";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format ID for display (add spacing)
 */
export const formatID = (id) => {
  if (!id) return "";

  // Format school ID: sch_010m -> SCH-010M
  if (id.startsWith("sch_")) {
    const parts = id.split("_");
    return `${parts[0].toUpperCase()}-${parts[1].toUpperCase()}`;
  }

  // Format student/teacher ID: st010m1099 -> ST-010M-1099
  if (id.startsWith("st") || id.startsWith("te")) {
    const prefix = id.slice(0, 2).toUpperCase();
    const school = id.slice(2, 7).toUpperCase();
    const nic = id.slice(7);
    return `${prefix}-${school}-${nic}`;
  }

  // Format admin ID: adm0001 -> ADM-0001
  if (id.startsWith("adm")) {
    return `${id.slice(0, 3).toUpperCase()}-${id.slice(3)}`;
  }

  return id.toUpperCase();
};
