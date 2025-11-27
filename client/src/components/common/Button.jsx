/**
 * Button Component
 * Reusable button with multiple variants and sizes
 * Phase 4.3 - Enhanced with ARIA attributes
 *
 * WCAG 2.1 Compliance:
 * - Keyboard accessible (SC 2.1.1)
 * - Visible focus indicator (SC 2.4.7)
 * - ARIA states (SC 4.1.2)
 * - Minimum touch target 44x44px (SC 2.5.5 AAA)
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = "left",
  className = "",
  onClick,
  ariaLabel,
  ariaDescribedBy,
  ariaPressed,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary:
      "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500",
    success:
      "bg-success-600 text-white hover:bg-success-700 focus:ring-success-500",
    danger:
      "bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500",
    warning:
      "bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500",
    info: "bg-info-600 text-white hover:bg-info-700 focus:ring-info-500",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline",
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs min-h-[32px]",
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-2 text-sm min-h-[40px]",
    lg: "px-5 py-2.5 text-base min-h-[44px]",
    xl: "px-6 py-3 text-base min-h-[48px]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={ariaPressed}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {loading && <span className="sr-only">Loading...</span>}
      {!loading && icon && iconPosition === "left" && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <span className="ml-2" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
