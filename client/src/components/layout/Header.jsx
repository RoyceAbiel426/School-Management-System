import { Bell, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuthContext } from "../../context/AuthContext";
import { formatUserName } from "../../utils/formatters";

/**
 * Header Component
 * Main application header with user menu
 * Phase 4.3 - Enhanced with accessibility features
 *
 * WCAG 2.1 Compliance:
 * - ARIA labels (SC 4.1.2)
 * - Semantic HTML (SC 1.3.1)
 * - Keyboard accessible (SC 2.1.1)
 */
const Header = ({ title }) => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {title || "School Management System"}
            </h1>
          </div>

          {/* Right side - User menu */}
          <nav aria-label="User navigation">
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                className="text-gray-500 hover:text-gray-700 relative focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-2"
                aria-label="Notifications (1 unread)"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span
                  className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"
                  aria-hidden="true"
                />
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <User
                      className="h-4 w-4 text-primary-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      {formatUserName(user?.name, "")}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-2"
                    aria-label="Settings"
                  >
                    <Settings className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-2"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
