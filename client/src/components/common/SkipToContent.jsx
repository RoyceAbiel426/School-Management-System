/**
 * SkipToContent Component
 * Allows keyboard users to skip navigation and go directly to main content
 * Phase 4.3 - Accessibility Implementation
 *
 * WCAG 2.1 Success Criterion 2.4.1 - Bypass Blocks
 */

const SkipToContent = ({ contentId = "main-content" }) => {
  const handleSkip = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById(contentId);
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a
      href={`#${contentId}`}
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
