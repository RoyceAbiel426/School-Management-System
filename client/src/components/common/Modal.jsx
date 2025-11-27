import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import FocusTrap from "./FocusTrap";

/**
 * Modal Component
 * Reusable modal dialog with accessibility features
 * Phase 4.3 - Enhanced with ARIA attributes and focus management
 *
 * WCAG 2.1 Compliance:
 * - Focus trap (SC 2.1.2)
 * - Keyboard accessible (SC 2.1.1)
 * - ARIA labels (SC 4.1.2)
 * - Escape key closes modal (SC 2.1.2)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer = null,
  ariaLabel,
  ariaDescribedBy,
}) => {
  const modalRef = useRef(null);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
      aria-describedby={ariaDescribedBy}
    >
      <FocusTrap active={isOpen}>
        <div
          ref={modalRef}
          className={`bg-white rounded-lg shadow-xl w-full ${sizes[size]} animate-scale-in`}
          role="document"
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-gray-900"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                  aria-label="Close modal"
                  type="button"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6" id={ariaDescribedBy || "modal-content"}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </FocusTrap>
    </div>
  );
};

export default Modal;
