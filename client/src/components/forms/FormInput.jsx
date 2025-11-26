import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

/**
 * FormInput Component
 * Advanced input field with react-hook-form integration
 *
 * Features:
 * - Error handling with visual feedback
 * - Success state indication
 * - Password toggle
 * - Icon support (left/right)
 * - Character counter
 * - Helper text
 * - Full accessibility (ARIA labels)
 * - Disabled state styling
 * - Multiple sizes
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.name - Field name (for react-hook-form)
 * @param {string} props.type - Input type (text, email, password, number, etc.)
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.error - Error object from react-hook-form
 * @param {boolean} props.required - Mark field as required
 * @param {boolean} props.disabled - Disable input
 * @param {ReactNode} props.leftIcon - Icon on the left side
 * @param {ReactNode} props.rightIcon - Icon on the right side
 * @param {string} props.helperText - Helper text below input
 * @param {number} props.maxLength - Maximum character count
 * @param {boolean} props.showCounter - Show character counter
 * @param {string} props.size - Size variant (sm, md, lg)
 * @param {string} props.variant - Visual variant (default, success)
 * @param {string} props.className - Additional CSS classes
 */
const FormInput = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      error,
      required = false,
      disabled = false,
      leftIcon,
      rightIcon,
      helperText,
      maxLength,
      showCounter = false,
      size = "md",
      variant = "default",
      className = "",
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [charCount, setCharCount] = useState(0);

    // Determine input type (handle password toggle)
    const inputType = type === "password" && showPassword ? "text" : type;

    // Size classes
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    };

    // Base input classes
    const baseClasses = `
      w-full rounded-lg border outline-none transition-all duration-200
      ${sizeClasses[size]}
      ${leftIcon ? "pl-10" : ""}
      ${rightIcon || type === "password" ? "pr-10" : ""}
      ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white"}
    `;

    // Border and focus classes based on state
    const stateClasses = error
      ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
      : variant === "success"
      ? "border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-200"
      : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200";

    // Handle character count
    const handleInputChange = (e) => {
      if (showCounter || maxLength) {
        setCharCount(e.target.value.length);
      }
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

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={name}
            name={name}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
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
            onChange={handleInputChange}
            {...rest}
          />

          {/* Right Icon / Password Toggle / Status Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Success Icon */}
            {!error && variant === "success" && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}

            {/* Error Icon */}
            {error && <AlertCircle className="w-5 h-5 text-red-500" />}

            {/* Password Toggle */}
            {type === "password" && !disabled && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon &&
              type !== "password" &&
              !error &&
              variant !== "success" && (
                <div className="text-gray-400">{rightIcon}</div>
              )}
          </div>
        </div>

        {/* Helper Text, Error Message, and Character Counter */}
        <div className="mt-1.5 flex items-start justify-between gap-2">
          <div className="flex-1">
            {/* Error Message */}
            {error && (
              <p
                id={`${name}-error`}
                className="text-sm text-red-600 flex items-start gap-1"
                role="alert"
              >
                <span>{error.message || "This field is invalid"}</span>
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
              className={`text-xs font-medium ${
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

FormInput.displayName = "FormInput";

export default FormInput;
