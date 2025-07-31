import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentLogin from "./components/StudentLogin";
import StudentRegister from "./components/StudentRegister";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/register" element={<StudentRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;