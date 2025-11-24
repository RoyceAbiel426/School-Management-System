/**
 * Select Component
 * Reusable select dropdown with label and error message
 */
const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  disabled = false,
  required = false,
  placeholder = "Select an option",
  className = "",
  ...props
}) => {
  const selectClasses = `
    block w-full rounded-lg border px-4 py-2
    ${
      error
        ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500"
        : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
    }
    text-gray-900
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

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={selectClasses}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
    </div>
  );
};

export default Select;
