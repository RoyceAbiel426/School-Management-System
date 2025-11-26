import { AlertCircle, Check, ChevronDown, Search, X } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";

/**
 * FormMultiSelect Component
 * Multi-selection dropdown with search and tags
 *
 * Features:
 * - Multiple selection
 * - Selected items as tags
 * - Searchable options
 * - Select all/Clear all
 * - Error handling
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
 * @param {string} props.helperText - Helper text
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.value - Selected values array
 * @param {number} props.maxSelections - Maximum selections allowed
 * @param {boolean} props.showSelectAll - Show select all button
 * @param {string} props.className - Additional classes
 */
const FormMultiSelect = forwardRef(
  (
    {
      label,
      name,
      options = [],
      placeholder = "Select options",
      error,
      required = false,
      disabled = false,
      searchable = true,
      helperText,
      onChange,
      value = [],
      maxSelections,
      showSelectAll = true,
      className = "",
      ...rest
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValues, setSelectedValues] = useState(value || []);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Filter options based on search term
    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    // Check if value is selected
    const isSelected = (optionValue) => selectedValues.includes(optionValue);

    // Check if max selections reached
    const isMaxReached =
      maxSelections && selectedValues.length >= maxSelections;

    // Handle option toggle
    const handleToggle = (optionValue) => {
      let newValues;

      if (isSelected(optionValue)) {
        // Remove from selection
        newValues = selectedValues.filter((v) => v !== optionValue);
      } else {
        // Add to selection (if not max reached)
        if (isMaxReached) return;
        newValues = [...selectedValues, optionValue];
      }

      setSelectedValues(newValues);

      if (onChange) {
        onChange({
          target: { name, value: newValues },
        });
      }
    };

    // Handle select all
    const handleSelectAll = () => {
      const allValues = options.map((opt) => opt.value);
      setSelectedValues(allValues);

      if (onChange) {
        onChange({
          target: { name, value: allValues },
        });
      }
    };

    // Handle clear all
    const handleClearAll = () => {
      setSelectedValues([]);

      if (onChange) {
        onChange({
          target: { name, value: [] },
        });
      }
    };

    // Remove single tag
    const removeTag = (optionValue, e) => {
      e.stopPropagation();
      const newValues = selectedValues.filter((v) => v !== optionValue);
      setSelectedValues(newValues);

      if (onChange) {
        onChange({
          target: { name, value: newValues },
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
      setSelectedValues(value || []);
    }, [value]);

    // Get selected labels
    const selectedLabels = selectedValues
      .map((val) => options.find((opt) => opt.value === val)?.label)
      .filter(Boolean);

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
            {maxSelections && (
              <span className="text-xs text-gray-500 ml-2 font-normal">
                (Max: {maxSelections})
              </span>
            )}
          </label>
        )}

        {/* Hidden input for form submission */}
        <input
          ref={ref}
          type="hidden"
          name={name}
          value={JSON.stringify(selectedValues)}
          {...rest}
        />

        {/* Select Container */}
        <div
          className={`
            w-full min-h-[42px] px-3 py-2 rounded-lg border outline-none transition-all duration-200
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed opacity-60"
                : "bg-white cursor-pointer"
            }
            ${
              error ? "border-red-500" : "border-gray-300 hover:border-gray-400"
            }
            ${isOpen ? "ring-2 ring-primary-200 border-primary-500" : ""}
          `}
          onClick={toggleDropdown}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center flex-wrap gap-2">
            {/* Selected Tags */}
            {selectedValues.length > 0 ? (
              selectedLabels.map((label, index) => (
                <span
                  key={selectedValues[index]}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm font-medium"
                >
                  {label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => removeTag(selectedValues[index], e)}
                      className="hover:text-primary-900 transition-colors"
                      aria-label={`Remove ${label}`}
                      tabIndex={-1}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}

            {/* Chevron and Error Icon */}
            <div className="ml-auto flex items-center gap-2">
              {error && <AlertCircle className="w-5 h-5 text-red-500" />}
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            {/* Search and Actions */}
            <div className="p-2 border-b border-gray-200 space-y-2">
              {/* Search Input */}
              {searchable && (
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
              )}

              {/* Select All / Clear All Buttons */}
              {showSelectAll && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded hover:bg-primary-100 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={selectedValues.length === 0}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Selection Count */}
              <div className="text-xs text-gray-500 text-center">
                {selectedValues.length} of {options.length} selected
                {maxSelections && ` (Max: ${maxSelections})`}
              </div>
            </div>

            {/* Options List */}
            <div
              className="overflow-y-auto max-h-60"
              role="listbox"
              aria-multiselectable="true"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const selected = isSelected(option.value);
                  const canSelect = !isMaxReached || selected;

                  return (
                    <div
                      key={option.value}
                      onClick={() => canSelect && handleToggle(option.value)}
                      className={`
                        px-4 py-2.5 cursor-pointer transition-colors flex items-center justify-between
                        ${
                          selected
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-gray-100 text-gray-900"
                        }
                        ${!canSelect ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                      role="option"
                      aria-selected={selected}
                    >
                      <span>{option.label}</span>
                      {selected && (
                        <Check className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                  );
                })
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

FormMultiSelect.displayName = "FormMultiSelect";

export default FormMultiSelect;
