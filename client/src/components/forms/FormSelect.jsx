import { AlertCircle, Check, ChevronDown, Search, X } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";

/**
 * FormSelect Component
 * Advanced dropdown select with search functionality
 *
 * Features:
 * - Searchable options
 * - Custom styling
 * - Error handling
 * - Disabled state
 * - Clear button
 * - Keyboard navigation
 * - Full accessibility
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.name - Field name
 * @param {Array} props.options - Array of options [{value, label}]
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.error - Error object
 * @param {boolean} props.required - Mark as required
 * @param {boolean} props.disabled - Disable select
 * @param {boolean} props.searchable - Enable search
 * @param {boolean} props.clearable - Show clear button
 * @param {string} props.helperText - Helper text
 * @param {Function} props.onChange - Change handler
 * @param {string} props.value - Selected value
 * @param {string} props.className - Additional classes
 */
const FormSelect = forwardRef(
  (
    {
      label,
      name,
      options = [],
      placeholder = "Select an option",
      error,
      required = false,
      disabled = false,
      searchable = false,
      clearable = false,
      helperText,
      onChange,
      value = "",
      className = "",
      ...rest
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState(value);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Filter options based on search term
    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    // Get selected option label
    const selectedOption = options.find((opt) => opt.value === selectedValue);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    // Handle option selection
    const handleSelect = (optionValue) => {
      setSelectedValue(optionValue);
      setIsOpen(false);
      setSearchTerm("");

      if (onChange) {
        onChange({
          target: { name, value: optionValue },
        });
      }
    };

    // Handle clear
    const handleClear = (e) => {
      e.stopPropagation();
      setSelectedValue("");
      setSearchTerm("");

      if (onChange) {
        onChange({
          target: { name, value: "" },
        });
      }
    };

    // Toggle dropdown
    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen && searchable) {
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }
      }
    };

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync with external value changes
    useEffect(() => {
      setSelectedValue(value);
    }, [value]);

    // Base classes
    const baseClasses = `
      w-full px-4 py-2 rounded-lg border outline-none transition-all duration-200
      flex items-center justify-between cursor-pointer
      ${
        disabled
          ? "bg-gray-100 cursor-not-allowed opacity-60"
          : "bg-white hover:border-gray-400"
      }
    `;

    const stateClasses = error
      ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200";

    return (
      <div className={`w-full ${className}`} ref={dropdownRef}>
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

        {/* Hidden input for form submission */}
        <input
          ref={ref}
          type="hidden"
          name={name}
          value={selectedValue}
          {...rest}
        />

        {/* Select Button */}
        <div
          className={`${baseClasses} ${stateClasses} ${
            isOpen ? "ring-2 ring-primary-200" : ""
          }`}
          onClick={toggleDropdown}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${name}-label` : undefined}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleDropdown();
            }
          }}
        >
          <span
            className={`flex-1 text-left ${
              !selectedValue ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {displayValue}
          </span>

          <div className="flex items-center gap-2">
            {/* Error Icon */}
            {error && <AlertCircle className="w-5 h-5 text-red-500" />}

            {/* Clear Button */}
            {clearable && selectedValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear selection"
                tabIndex={-1}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Chevron Icon */}
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="overflow-y-auto max-h-48" role="listbox">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      px-4 py-2.5 cursor-pointer transition-colors flex items-center justify-between
                      ${
                        selectedValue === option.value
                          ? "bg-primary-50 text-primary-700"
                          : "hover:bg-gray-100 text-gray-900"
                      }
                    `}
                    role="option"
                    aria-selected={selectedValue === option.value}
                  >
                    <span>{option.label}</span>
                    {selectedValue === option.value && (
                      <Check className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                  No options found
                </div>
              )}
            </div>
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

FormSelect.displayName = "FormSelect";

export default FormSelect;
