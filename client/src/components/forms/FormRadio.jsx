import { AlertCircle } from "lucide-react";
import { forwardRef } from "react";

/**
 * FormRadio Component
 * Radio button with custom styling and group support
 *
 * Features:
 * - Custom styled radio button
 * - Error handling
 * - Disabled state
 * - Helper text
 * - Group support
 * - Full accessibility
 *
 * @param {Object} props
 * @param {string} props.label - Radio label
 * @param {string} props.name - Field name (same for all radios in group)
 * @param {string} props.value - Radio value
 * @param {Object} props.error - Error object
 * @param {boolean} props.required - Mark as required
 * @param {boolean} props.disabled - Disable radio
 * @param {string} props.helperText - Helper text
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.checked - Checked state
 * @param {string} props.description - Description text under label
 * @param {string} props.size - Size variant (sm, md, lg)
 * @param {string} props.className - Additional classes
 */
const FormRadio = forwardRef(
  (
    {
      label,
      name,
      value,
      error,
      required = false,
      disabled = false,
      helperText,
      onChange,
      checked = false,
      description,
      size = "md",
      className = "",
      ...rest
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const dotSizeClasses = {
      sm: "w-2 h-2",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
    };

    return (
      <div className={`flex items-start ${className}`}>
        <div className="flex items-center h-5">
          {/* Custom Radio */}
          <div className="relative">
            <input
              ref={ref}
              type="radio"
              id={`${name}-${value}`}
              name={name}
              value={value}
              checked={checked}
              disabled={disabled}
              onChange={onChange}
              className="sr-only peer"
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

            {/* Custom Radio UI */}
            <label
              htmlFor={`${name}-${value}`}
              className={`
                ${
                  sizeClasses[size]
                } rounded-full border-2 flex items-center justify-center cursor-pointer
                transition-all duration-200
                ${
                  disabled
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                    : "bg-white border-gray-300"
                }
                ${error ? "border-red-500" : ""}
                peer-checked:border-primary-600
                peer-focus:ring-2 peer-focus:ring-primary-200 peer-focus:ring-offset-2
                hover:border-gray-400
              `}
            >
              {/* Selected Dot */}
              <div
                className={`
                  ${dotSizeClasses[size]} rounded-full bg-primary-600 opacity-0
                  peer-checked:opacity-100 transition-opacity duration-200
                `}
              />
            </label>
          </div>
        </div>

        {/* Label and Description */}
        {(label || description) && (
          <div className="ml-3 flex-1">
            <label
              htmlFor={`${name}-${value}`}
              className={`
                block font-medium cursor-pointer select-none
                ${
                  size === "sm"
                    ? "text-sm"
                    : size === "lg"
                    ? "text-base"
                    : "text-sm"
                }
                ${
                  disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700"
                }
              `}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {description && (
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            )}

            {/* Error Message */}
            {error && (
              <p
                id={`${name}-error`}
                className="text-sm text-red-600 mt-1 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-4 h-4" />
                {error.message || "This field is invalid"}
              </p>
            )}

            {/* Helper Text */}
            {!error && helperText && (
              <p id={`${name}-helper`} className="text-sm text-gray-500 mt-1">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

FormRadio.displayName = "FormRadio";

export default FormRadio;
