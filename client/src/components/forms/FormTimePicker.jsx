import { AlertCircle, Clock } from "lucide-react";
import { forwardRef, useState } from "react";
import { formatTimeForInput } from "../../utils/formHelpers";

/**
 * FormTimePicker Component
 * Time input with clock icon and validation
 *
 * Features:
 * - Native time input with custom styling
 * - Min/max time validation
 * - Error handling
 * - Now button
 * - Clear button
 * - 12/24 hour format support
 * - Full accessibility
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.name - Field name
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.error - Error object
 * @param {boolean} props.required - Mark as required
 * @param {boolean} props.disabled - Disable input
 * @param {string} props.helperText - Helper text
 * @param {string} props.min - Minimum time (HH:MM)
 * @param {string} props.max - Maximum time (HH:MM)
 * @param {number} props.step - Step in seconds (default: 60)
 * @param {boolean} props.showNowButton - Show "Now" button
 * @param {boolean} props.clearable - Show clear button
 * @param {Function} props.onChange - Change handler
 * @param {string} props.value - Selected time value
 * @param {string} props.className - Additional classes
 */
const FormTimePicker = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      error,
      required = false,
      disabled = false,
      helperText,
      min,
      max,
      step = 60,
      showNowButton = false,
      clearable = false,
      onChange,
      value = "",
      className = "",
      ...rest
    },
    ref
  ) => {
    const [timeValue, setTimeValue] = useState(value);

    // Handle time change
    const handleTimeChange = (e) => {
      const newValue = e.target.value;
      setTimeValue(newValue);

      if (onChange) {
        onChange(e);
      }
    };

    // Set current time
    const handleNow = () => {
      const now = formatTimeForInput(new Date());
      setTimeValue(now);

      if (onChange) {
        onChange({
          target: { name, value: now },
        });
      }
    };

    // Clear time
    const handleClear = () => {
      setTimeValue("");

      if (onChange) {
        onChange({
          target: { name, value: "" },
        });
      }
    };

    // Base classes
    const baseClasses = `
      w-full px-4 py-2 rounded-lg border outline-none transition-all duration-200
      ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white"}
      text-base
    `;

    const stateClasses = error
      ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200";

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

        {/* Time Input Container */}
        <div className="relative">
          {/* Clock Icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Clock className="w-5 h-5" />
          </div>

          {/* Time Input */}
          <input
            ref={ref}
            type="time"
            id={name}
            name={name}
            value={timeValue}
            onChange={handleTimeChange}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            className={`${baseClasses} ${stateClasses} pl-10 pr-10`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${name}-error`
                : helperText
                ? `${name}-helper`
                : undefined
            }
            aria-required={required}
            {...rest}
          />

          {/* Error Icon */}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {(showNowButton || clearable) && !disabled && (
          <div className="mt-2 flex items-center gap-2">
            {showNowButton && (
              <button
                type="button"
                onClick={handleNow}
                className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded hover:bg-primary-100 transition-colors"
              >
                Now
              </button>
            )}
            {clearable && timeValue && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Helper Text / Error Message */}
        <div className="mt-1.5">
          {error && (
            <p
              id={`${name}-error`}
              className="text-sm text-red-600"
              role="alert"
            >
              {error.message || "This field is invalid"}
            </p>
          )}

          {!error && helperText && (
            <p id={`${name}-helper`} className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormTimePicker.displayName = "FormTimePicker";

export default FormTimePicker;
