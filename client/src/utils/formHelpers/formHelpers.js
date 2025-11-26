/**
 * Form Helper Utilities
 * Helper functions for form handling, formatting, and transformations
 */

/**
 * Format form errors for display
 */
export const getErrorMessage = (error) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  return "Invalid input";
};

/**
 * Check if field has error
 */
export const hasError = (errors, fieldName) => {
  return !!errors[fieldName];
};

/**
 * Get nested error (for nested form fields)
 */
export const getNestedError = (errors, path) => {
  const keys = path.split(".");
  let error = errors;

  for (const key of keys) {
    if (!error) return null;
    error = error[key];
  }

  return error;
};

/**
 * Transform form data before submission
 */
export const transformFormData = (data, transformers = {}) => {
  const transformed = { ...data };

  Object.keys(transformers).forEach((key) => {
    if (transformed[key] !== undefined) {
      transformed[key] = transformers[key](transformed[key]);
    }
  });

  return transformed;
};

/**
 * Remove empty fields from form data
 */
export const removeEmptyFields = (data) => {
  const cleaned = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value !== "" && value !== null && value !== undefined) {
      if (typeof value === "object" && !Array.isArray(value)) {
        const nested = removeEmptyFields(value);
        if (Object.keys(nested).length > 0) {
          cleaned[key] = nested;
        }
      } else if (Array.isArray(value) && value.length > 0) {
        cleaned[key] = value;
      } else if (typeof value !== "object") {
        cleaned[key] = value;
      }
    }
  });

  return cleaned;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.split(".").pop().toLowerCase();
};

/**
 * Check if file is image
 */
export const isImageFile = (filename) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  return imageExtensions.includes(getFileExtension(filename));
};

/**
 * Convert file to base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Format date for input (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

/**
 * Format time for input (HH:MM)
 */
export const formatTimeForInput = (time) => {
  if (!time) return "";
  const d = new Date(time);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Parse date and time to ISO string
 */
export const combineDateAndTime = (date, time) => {
  if (!date) return null;

  const dateObj = new Date(date);

  if (time) {
    const [hours, minutes] = time.split(":");
    dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  }

  return dateObj.toISOString();
};

/**
 * Debounce function for input handlers
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create form data for file upload
 */
export const createFormDataWithFile = (data, fileField = "file") => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (key === fileField && value instanceof FileList) {
      // Handle file input
      Array.from(value).forEach((file) => {
        formData.append(key, file);
      });
    } else if (value !== null && value !== undefined) {
      // Handle regular fields
      if (typeof value === "object" && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  return formData;
};

/**
 * Reset specific fields in a form
 */
export const resetFields = (reset, fields) => {
  const resetObject = {};
  fields.forEach((field) => {
    resetObject[field] = "";
  });
  reset(resetObject);
};

/**
 * Set multiple form values
 */
export const setMultipleValues = (setValue, values) => {
  Object.keys(values).forEach((key) => {
    setValue(key, values[key]);
  });
};

/**
 * Generate default form values from schema
 */
export const generateDefaultValues = (schema) => {
  const defaults = {};

  Object.keys(schema).forEach((key) => {
    const field = schema[key];

    switch (field.type) {
      case "string":
        defaults[key] = field.default || "";
        break;
      case "number":
        defaults[key] = field.default || 0;
        break;
      case "boolean":
        defaults[key] = field.default || false;
        break;
      case "array":
        defaults[key] = field.default || [];
        break;
      case "object":
        defaults[key] = field.default || {};
        break;
      default:
        defaults[key] = "";
    }
  });

  return defaults;
};

/**
 * Validate all fields in a form
 */
export const validateAllFields = async (trigger, fields) => {
  const results = await Promise.all(fields.map((field) => trigger(field)));
  return results.every((result) => result === true);
};

/**
 * Format phone number (auto-add dashes)
 */
export const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{4})(\d{7})$/);

  if (match) {
    return `${match[1]}-${match[2]}`;
  }

  return value;
};

/**
 * Format CNIC (auto-add dashes)
 */
export const formatCNIC = (value) => {
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{5})(\d{7})(\d{1})$/);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return value;
};

/**
 * Get file icon based on extension
 */
export const getFileIcon = (filename) => {
  const extension = getFileExtension(filename);

  const iconMap = {
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    xls: "📊",
    xlsx: "📊",
    ppt: "📽️",
    pptx: "📽️",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    zip: "🗜️",
    rar: "🗜️",
    txt: "📃",
    csv: "📊",
  };

  return iconMap[extension] || "📎";
};

/**
 * Sanitize input (remove HTML tags)
 */
export const sanitizeInput = (input) => {
  const temp = document.createElement("div");
  temp.textContent = input;
  return temp.innerHTML;
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert to title case
 */
export const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
