import { useAuthContext } from "../../context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

/**
 * DashboardLayout Component
 * Main layout for dashboard pages
 */
const DashboardLayout = ({ children, title }) => {
  const { role } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header title={title} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
