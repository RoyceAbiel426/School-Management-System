import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../constants/roles";
import { ROUTES } from "../constants/routes";
import { useAuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { teacherAuth } from "../services/authService";
import { Button, Input } from "./common";
import { AuthLayout } from "./layout";

/**
 * Teacher Login Component
 */
const TeacherLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await teacherAuth.login(formData);
      login(response.teacher, ROLES.TEACHER, response.token);
      success("Login successful!");
      navigate(ROUTES.TEACHER_DASHBOARD);
    } catch (err) {
      error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Login</h1>
          <p className="mt-2 text-gray-600">Sign in to your teacher account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail className="h-5 w-5" />}
            error={errors.email}
            required
            autoFocus
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            icon={<Lock className="h-5 w-5" />}
            error={errors.password}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default TeacherLogin;
