import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  Library,
  MessageSquare,
  Trophy,
  UserCircle,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

/**
 * Sidebar Component
 * Navigation sidebar for dashboard layouts
 */
const Sidebar = ({ role = "admin" }) => {
  // Navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      { name: "Dashboard", icon: LayoutDashboard, path: `/${role}/dashboard` },
      { name: "Profile", icon: UserCircle, path: `/${role}/profile` },
      { name: "Notices", icon: Bell, path: `/${role}/notices` },
    ];

    if (role === "admin") {
      return [
        ...baseItems,
        { name: "Students", icon: Users, path: "/admin/students" },
        { name: "Teachers", icon: GraduationCap, path: "/admin/teachers" },
        { name: "Courses", icon: BookOpen, path: "/admin/courses" },
        { name: "Sports", icon: Trophy, path: "/admin/sports" },
        { name: "Library", icon: Library, path: "/admin/library" },
        { name: "Attendance", icon: Calendar, path: "/admin/attendance" },
        { name: "Results", icon: BarChart3, path: "/admin/results" },
        { name: "Complaints", icon: MessageSquare, path: "/admin/complaints" },
      ];
    }

    if (role === "student") {
      return [
        ...baseItems,
        { name: "My Courses", icon: BookOpen, path: "/student/courses" },
        { name: "Attendance", icon: Calendar, path: "/student/attendance" },
        { name: "Results", icon: BarChart3, path: "/student/results" },
        { name: "Sports", icon: Trophy, path: "/student/sports" },
        { name: "Library", icon: Library, path: "/student/library" },
        {
          name: "Complaints",
          icon: MessageSquare,
          path: "/student/complaints",
        },
      ];
    }

    if (role === "teacher") {
      return [
        ...baseItems,
        { name: "My Classes", icon: Users, path: "/teacher/classes" },
        { name: "Attendance", icon: Calendar, path: "/teacher/attendance" },
        { name: "Results", icon: BarChart3, path: "/teacher/results" },
      ];
    }

    if (role === "coach") {
      return [
        ...baseItems,
        { name: "My Sports", icon: Trophy, path: "/coach/sports" },
        { name: "Participants", icon: Users, path: "/coach/participants" },
        { name: "Events", icon: Calendar, path: "/coach/events" },
        { name: "Performance", icon: BarChart3, path: "/coach/performance" },
      ];
    }

    if (role === "librarian") {
      return [
        ...baseItems,
        { name: "Books", icon: BookOpen, path: "/librarian/books" },
        {
          name: "Transactions",
          icon: Calendar,
          path: "/librarian/transactions",
        },
        { name: "Issue/Return", icon: Library, path: "/librarian/issue" },
        { name: "Overdue", icon: MessageSquare, path: "/librarian/overdue" },
        { name: "Statistics", icon: BarChart3, path: "/librarian/stats" },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edu-Pro</h2>
            <p className="text-xs text-gray-500 capitalize">{role} Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
