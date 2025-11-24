/**
 * Card Component
 * Reusable card container
 */
const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  padding = true,
  hover = false,
  ...props
}) => {
  const hoverClass = hover
    ? "hover:shadow-hover transition-shadow duration-200"
    : "";
  const paddingClass = padding ? "p-6" : "";

  return (
    <div
      className={`bg-white rounded-lg shadow-card ${hoverClass} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div
          className={`${paddingClass} ${
            footer || children ? "border-b border-gray-200" : ""
          }`}
        >
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}

      {children && <div className={paddingClass}>{children}</div>}

      {footer && (
        <div className={`${paddingClass} border-t border-gray-200`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
