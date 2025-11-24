/**
 * Input Component
 * Reusable input field with label and error message
 */
const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  className = "",
  icon = null,
  iconPosition = "left",
  ...props
}) => {
  const inputClasses = `
    block w-full rounded-lg border
    ${
      error
        ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500"
        : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
    }
    ${icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "px-4"}
    py-2 text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-2
    disabled:bg-gray-100 disabled:cursor-not-allowed
    transition-colors duration-200
  `;

  return (
    <div className={`${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />

        {icon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
    </div>
  );
};

export default Input;
