import { useEffect, useRef } from "react";
import { getFocusableElements } from "../../utils/accessibility";

/**
 * FocusTrap Component
 * Traps focus within a container (for modals, dialogs, dropdowns)
 * Phase 4.3 - Accessibility Implementation
 *
 * WCAG 2.1 Success Criterion 2.1.2 - No Keyboard Trap
 * (with intentional trap that can be escaped with Esc)
 */

const FocusTrap = ({
  children,
  active = true,
  restoreFocus = true,
  className = "",
}) => {
  const containerRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!active) return;

    // Store the previously focused element
    previousFocus.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const focusableElements = getFocusableElements(container);

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus the first element
    firstFocusable.focus();

    // Handle Tab key to trap focus
    const handleKeyDown = (e) => {
      // Escape key to break trap is handled by parent (Modal, Dialog, etc.)

      if (e.key !== "Tab") return;

      // If only one focusable element, prevent tabbing
      if (focusableElements.length === 1) {
        e.preventDefault();
        return;
      }

      if (e.shiftKey) {
        // Shift + Tab: move backwards
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab: move forwards
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    // Add event listener
    container.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      container.removeEventListener("keydown", handleKeyDown);

      // Restore focus to previous element if needed
      if (restoreFocus && previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [active, restoreFocus]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default FocusTrap;
