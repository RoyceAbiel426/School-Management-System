import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";

/**
 * Alert Component
 * Reusable alert/notification component
 */
const Alert = ({ type = "info", title, message, onClose, className = "" }) => {
  const types = {
    success: {
      bg: "bg-success-50",
      border: "border-success-200",
      text: "text-success-800",
      icon: CheckCircle,
      iconColor: "text-success-600",
    },
    error: {
      bg: "bg-danger-50",
      border: "border-danger-200",
      text: "text-danger-800",
      icon: XCircle,
      iconColor: "text-danger-600",
    },
    warning: {
      bg: "bg-warning-50",
      border: "border-warning-200",
      text: "text-warning-800",
      icon: AlertCircle,
      iconColor: "text-warning-600",
    },
    info: {
      bg: "bg-info-50",
      border: "border-info-200",
      text: "text-info-800",
      icon: Info,
      iconColor: "text-info-600",
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.text}`}>{title}</h3>
          )}
          {message && (
            <div className={`text-sm ${config.text} ${title ? "mt-1" : ""}`}>
              {message}
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-3 flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${config.text} hover:bg-opacity-20 focus:outline-none`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
