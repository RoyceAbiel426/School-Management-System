/**
 * Accessibility Utilities
 * Helper functions for accessibility features
 * Phase 4.3 - Accessibility Implementation
 */

/**
 * Generate a unique ID for ARIA attributes
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = "a11y") => {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Announce message to screen readers using aria-live region
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = "polite") => {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Trap focus within a container (for modals, dialogs)
 * @param {HTMLElement} container - Container to trap focus in
 * @returns {Function} Cleanup function
 */
export const trapFocus = (container) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  container.addEventListener("keydown", handleKeyDown);

  // Focus first element
  if (firstFocusable) {
    firstFocusable.focus();
  }

  // Return cleanup function
  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
};

/**
 * Check if color contrast meets WCAG AA standards
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @returns {Object} Contrast ratio and compliance
 */
export const checkColorContrast = (foreground, background) => {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: ratio.toFixed(2),
    AA: ratio >= 4.5, // Normal text
    AALarge: ratio >= 3, // Large text (18pt+ or 14pt+ bold)
    AAA: ratio >= 7, // Enhanced
  };
};

/**
 * Get keyboard-friendly event handler
 * Triggers on Enter or Space key press
 * @param {Function} onClick - Click handler
 * @returns {Function} Keyboard event handler
 */
export const getKeyboardHandler = (onClick) => {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e);
    }
  };
};

/**
 * Set page title for screen readers
 * @param {string} title - Page title
 */
export const setPageTitle = (title) => {
  document.title = title;
  announceToScreenReader(`Navigated to ${title}`);
};

/**
 * Check if element is visible
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Is visible
 */
export const isVisible = (element) => {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
};

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - Container element
 * @returns {Array} Array of focusable elements
 */
export const getFocusableElements = (container) => {
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(isVisible);
};

/**
 * Restore focus to previously focused element
 * @param {HTMLElement} element - Element to restore focus to
 */
export const restoreFocus = (element) => {
  if (element && typeof element.focus === "function") {
    element.focus();
  }
};

/**
 * Keyboard shortcuts registry
 */
export const KEYBOARD_SHORTCUTS = {
  ESCAPE: "Escape",
  ENTER: "Enter",
  SPACE: " ",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
};

/**
 * ARIA roles reference
 */
export const ARIA_ROLES = {
  ALERT: "alert",
  ALERTDIALOG: "alertdialog",
  BUTTON: "button",
  CHECKBOX: "checkbox",
  DIALOG: "dialog",
  GRID: "grid",
  GRIDCELL: "gridcell",
  LINK: "link",
  LIST: "list",
  LISTBOX: "listbox",
  LISTITEM: "listitem",
  MENU: "menu",
  MENUBAR: "menubar",
  MENUITEM: "menuitem",
  NAVIGATION: "navigation",
  OPTION: "option",
  PROGRESSBAR: "progressbar",
  RADIO: "radio",
  RADIOGROUP: "radiogroup",
  REGION: "region",
  ROW: "row",
  SEARCH: "search",
  SLIDER: "slider",
  STATUS: "status",
  TAB: "tab",
  TABLIST: "tablist",
  TABPANEL: "tabpanel",
  TEXTBOX: "textbox",
  TOOLBAR: "toolbar",
  TOOLTIP: "tooltip",
  TREE: "tree",
  TREEITEM: "treeitem",
};

/**
 * WCAG 2.1 AA Guidelines Reference
 */
export const WCAG_GUIDELINES = {
  CONTRAST_NORMAL: 4.5, // Normal text
  CONTRAST_LARGE: 3, // Large text (18pt+ or 14pt+ bold)
  CONTRAST_UI: 3, // UI components and graphics
  FOCUS_VISIBLE: true, // Focus indicators must be visible
  KEYBOARD_ACCESSIBLE: true, // All functionality via keyboard
  SKIP_NAVIGATION: true, // Skip to main content link
  PAGE_TITLED: true, // Each page has a title
  HEADING_HIERARCHY: true, // Headings in logical order
  LINK_PURPOSE: true, // Link purpose clear from text
  LABELS: true, // Form inputs have labels
  ERROR_IDENTIFICATION: true, // Errors clearly identified
  ERROR_SUGGESTION: true, // Error correction suggested
};

export default {
  generateId,
  announceToScreenReader,
  trapFocus,
  checkColorContrast,
  getKeyboardHandler,
  setPageTitle,
  isVisible,
  getFocusableElements,
  restoreFocus,
  KEYBOARD_SHORTCUTS,
  ARIA_ROLES,
  WCAG_GUIDELINES,
};
