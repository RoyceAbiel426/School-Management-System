import { ArrowLeft, FileQuestion, Home, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

/**
 * NotFound (404) Page
 *
 * Displayed when users navigate to a route that doesn't exist.
 * Provides helpful navigation options and search functionality.
 */
const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const popularLinks = [
    { name: "Dashboard", path: "/" },
    { name: "My Courses", path: "/student/courses" },
    { name: "Attendance", path: "/student/attendance" },
    { name: "Results", path: "/student/results" },
    { name: "Library", path: "/student/library" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Icon */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center justify-center">
            <FileQuestion
              className="w-32 h-32 text-blue-500 animate-bounce"
              strokeWidth={1.5}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl font-bold text-blue-100 opacity-20 select-none">
              404
            </div>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-gray-500 mb-8">
          It might have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            icon={Home}
            size="lg"
          >
            Go to Home
          </Button>
          <Button
            variant="secondary"
            onClick={goBack}
            icon={ArrowLeft}
            size="lg"
          >
            Go Back
          </Button>
        </div>

        {/* Popular Links */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-700">
              Looking for something?
            </h2>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Here are some popular pages you might be interested in:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">
              Still can't find what you're looking for?
            </span>
            <br />
            Contact support at{" "}
            <a
              href="mailto:support@edupro.com"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              support@edupro.com
            </a>{" "}
            or check our{" "}
            <Link
              to="/help"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              help center
            </Link>
          </p>
        </div>

        {/* Error Code */}
        <p className="text-xs text-gray-400 mt-6">
          Error Code: 404 • Page Not Found
        </p>
      </div>
    </div>
  );
};

export default NotFound;
