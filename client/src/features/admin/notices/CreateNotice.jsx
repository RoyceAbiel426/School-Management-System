import { AlertCircle, Bell, ChevronLeft, FileText, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateNotice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.details.trim()) {
      newErrors.details = "Details are required";
    } else if (formData.details.length < 20) {
      newErrors.details = "Details must be at least 20 characters";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Submit logic here
    console.log("Creating notice:", formData);
    alert("Notice created successfully!");
    navigate("/admin/notices");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/notices")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Notices
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-primary-600" />
            Create New Notice
          </h1>
          <p className="mt-2 text-gray-600">
            Add a new notice or announcement for students and staff
          </p>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">
              Tips for creating effective notices:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use a clear and concise title</li>
              <li>Include all relevant details and dates</li>
              <li>Keep the language simple and easy to understand</li>
              <li>Proofread before publishing</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notice Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notice title"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notice Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notice Details <span className="text-red-500">*</span>
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows="8"
                placeholder="Enter detailed description of the notice..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                  errors.details ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.details && (
                <p className="mt-1 text-sm text-red-600">{errors.details}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.details.length} characters (minimum 20 required)
              </p>
            </div>
          </div>

          {/* Preview Section */}
          {(formData.title || formData.details) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                Preview
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                {formData.title && (
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {formData.title}
                  </h4>
                )}
                {formData.date && (
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(formData.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {formData.details && (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.details}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/admin/notices")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Publish Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotice;
