import { AlertCircle } from "lucide-react";
import { forwardRef, useState } from "react";

/**
 * FormTextarea Component
 * Multi-line text input with react-hook-form integration
 *
 * Features:
 * - Error handling with visual feedback
 * - Character counter
 * - Auto-resize option
 * - Minimum/maximum rows
 * - Helper text
 * - Full accessibility
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.name - Field name
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.error - Error object from react-hook-form
 * @param {boolean} props.required - Mark as required
 * @param {boolean} props.disabled - Disable textarea
 * @param {string} props.helperText - Helper text
 * @param {number} props.maxLength - Maximum characters
 * @param {boolean} props.showCounter - Show character counter
 * @param {number} props.rows - Number of visible rows
 * @param {number} props.minRows - Minimum rows (for auto-resize)
 * @param {number} props.maxRows - Maximum rows (for auto-resize)
 * @param {boolean} props.autoResize - Enable auto-resize
 * @param {string} props.resize - CSS resize property (none, both, horizontal, vertical)
 * @param {string} props.className - Additional CSS classes
 */
const FormTextarea = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      error,
      required = false,
      disabled = false,
      helperText,
      maxLength,
      showCounter = true,
      rows = 4,
      minRows,
      maxRows,
      autoResize = false,
      resize = "vertical",
      className = "",
      ...rest
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(0);

    // Resize classes
    const resizeClasses = {
      none: "resize-none",
      both: "resize",
      horizontal: "resize-x",
      vertical: "resize-y",
    };

    // Base textarea classes
    const baseClasses = `
      w-full px-4 py-3 rounded-lg border outline-none transition-all duration-200
      ${resizeClasses[resize] || "resize-y"}
      ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white"}
      text-base
    `;

    // Border and focus classes
    const stateClasses = error
      ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200";

    // Handle character count and auto-resize
    const handleTextareaChange = (e) => {
      const value = e.target.value;

      // Update character count
      if (showCounter || maxLength) {
        setCharCount(value.length);
      }

      // Auto-resize logic
      if (autoResize && e.target) {
        e.target.style.height = "auto";
        const scrollHeight = e.target.scrollHeight;

        // Calculate min and max heights
        const lineHeight = 24; // Approximate line height
        const minHeight = minRows ? minRows * lineHeight : rows * lineHeight;
        const maxHeight = maxRows ? maxRows * lineHeight : scrollHeight;

        // Set height within bounds
        const newHeight = Math.max(
          minHeight,
          Math.min(scrollHeight, maxHeight)
        );
        e.target.style.height = `${newHeight}px`;
      }

      // Call parent onChange
      if (rest.onChange) {
        rest.onChange(e);
      }
    };

    return (
      <div className={`w-full ${className}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={ref}
            id={name}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={autoResize ? minRows || rows : rows}
            className={`${baseClasses} ${stateClasses}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${name}-error`
                : helperText
                ? `${name}-helper`
                : undefined
            }
            aria-required={required}
            onChange={handleTextareaChange}
            {...rest}
          />

          {/* Error Icon */}
          {error && (
            <div className="absolute right-3 top-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>

        {/* Helper Text, Error Message, and Character Counter */}
        <div className="mt-1.5 flex items-start justify-between gap-2">
          <div className="flex-1">
            {/* Error Message */}
            {error && (
              <p
                id={`${name}-error`}
                className="text-sm text-red-600"
                role="alert"
              >
                {error.message || "This field is invalid"}
              </p>
            )}

            {/* Helper Text */}
            {!error && helperText && (
              <p id={`${name}-helper`} className="text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>

          {/* Character Counter */}
          {showCounter && maxLength && (
            <p
              className={`text-xs font-medium flex-shrink-0 ${
                charCount >= maxLength
                  ? "text-red-600"
                  : charCount >= maxLength * 0.9
                  ? "text-yellow-600"
                  : "text-gray-400"
              }`}
              aria-live="polite"
              aria-atomic="true"
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
