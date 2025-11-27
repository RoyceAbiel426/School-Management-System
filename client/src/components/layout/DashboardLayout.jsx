import { useAuthContext } from "../../context/AuthContext";
import SkipToContent from "../common/SkipToContent";
import Header from "./Header";
import Sidebar from "./Sidebar";

/**
 * DashboardLayout Component
 * Main layout for dashboard pages
 * Phase 4.3 - Enhanced with accessibility features
 *
 * WCAG 2.1 Compliance:
 * - Skip to main content link (SC 2.4.1)
 * - Semantic HTML (SC 1.3.1)
 * - Page structure (SC 2.4.1)
 */
const DashboardLayout = ({ children, title }) => {
  const { role } = useAuthContext();

  return (
    <>
      <SkipToContent contentId="main-content" />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar role={role} />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <Header title={title} />

          <main
            id="main-content"
            className="flex-1 overflow-y-auto"
            role="main"
            aria-label="Main content"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
