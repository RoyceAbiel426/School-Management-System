import { ArrowLeft, Book, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import adminService from "../../../services/adminService";

const EditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    totalCopies: "",
    availableCopies: "",
    publicationYear: "",
    category: "other",
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBookById(id);
      const bookData = response.data || response;

      setFormData({
        isbn: bookData.isbn || "",
        title: bookData.title || "",
        author: bookData.author || "",
        totalCopies: bookData.totalCopies || "",
        availableCopies: bookData.availableCopies || "",
        publicationYear: bookData.publicationYear || "",
        category: bookData.category || "other",
      });
      setOriginalData(bookData);
    } catch (error) {
      console.error("Error fetching book details:", error);
      alert("Failed to load book details");
      navigate(ROUTES.ADMIN_ROUTES.LIBRARY);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // ISBN validation (10 or 13 digits)
    if (!formData.isbn.trim()) {
      newErrors.isbn = "ISBN is required";
    } else if (!/^\d{10}$|^\d{13}$/.test(formData.isbn)) {
      newErrors.isbn = "ISBN must be 10 or 13 digits";
    }

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    // Author validation
    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    } else if (formData.author.trim().length < 2) {
      newErrors.author = "Author name must be at least 2 characters";
    }

    // Total Copies validation
    if (!formData.totalCopies) {
      newErrors.totalCopies = "Total copies is required";
    } else if (
      isNaN(formData.totalCopies) ||
      parseInt(formData.totalCopies) < 1
    ) {
      newErrors.totalCopies = "Total copies must be at least 1";
    }

    // Available copies validation
    if (!formData.availableCopies && formData.availableCopies !== 0) {
      newErrors.availableCopies = "Available copies is required";
    } else if (
      isNaN(formData.availableCopies) ||
      parseInt(formData.availableCopies) < 0
    ) {
      newErrors.availableCopies = "Available copies cannot be negative";
    } else if (
      parseInt(formData.availableCopies) > parseInt(formData.totalCopies)
    ) {
      newErrors.availableCopies = "Available copies cannot exceed total copies";
    }

    // Publication Year validation
    if (!formData.publicationYear) {
      newErrors.publicationYear = "Publication year is required";
    } else if (
      isNaN(formData.publicationYear) ||
      parseInt(formData.publicationYear) < 1800 ||
      parseInt(formData.publicationYear) > currentYear
    ) {
      newErrors.publicationYear = `Year must be between 1800 and ${currentYear}`;
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const bookData = {
        isbn: formData.isbn.trim(),
        title: formData.title.trim(),
        author: formData.author.trim(),
        totalCopies: parseInt(formData.totalCopies),
        availableCopies: parseInt(formData.availableCopies),
        publicationYear: parseInt(formData.publicationYear),
        category: formData.category,
      };

      await adminService.updateBook(id, bookData);
      navigate(ROUTES.ADMIN_ROUTES.LIBRARY);
    } catch (error) {
      console.error("Error updating book:", error);
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("ISBN")) {
          setErrors({ isbn: "This ISBN already exists for another book" });
        } else {
          alert(error.response.data.message);
        }
      } else {
        alert("Failed to update book. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const borrowedCopies = originalData
    ? originalData.totalCopies - originalData.availableCopies
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.LIBRARY)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Library
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <Book className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>
            <p className="text-gray-600 mt-1">
              Update book information and manage inventory
            </p>
          </div>
        </div>
      </div>

      {/* Current Status Alert */}
      {borrowedCopies > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ <strong>{borrowedCopies}</strong>{" "}
            {borrowedCopies === 1 ? "copy is" : "copies are"} currently
            borrowed. Ensure total copies is not less than borrowed copies.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ISBN */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter 10 or 13 digit ISBN"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.isbn ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.isbn && (
                <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                International Standard Book Number (10 or 13 digits, numbers
                only)
              </p>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Author */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.author ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="textbook">Textbook</option>
                <option value="reference">Reference</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Publication Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                placeholder={`e.g., ${currentYear}`}
                min="1800"
                max={currentYear}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.publicationYear ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.publicationYear && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.publicationYear}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Inventory Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Copies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Copies <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
                placeholder="Enter number of copies"
                min={borrowedCopies}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.totalCopies ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.totalCopies && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.totalCopies}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Must be at least {borrowedCopies} (currently borrowed)
              </p>
            </div>

            {/* Available Copies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Copies <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="availableCopies"
                value={formData.availableCopies}
                onChange={handleChange}
                placeholder="Enter available copies"
                min="0"
                max={formData.totalCopies}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.availableCopies ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.availableCopies && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.availableCopies}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Copies currently in the library (not borrowed)
              </p>
            </div>

            {/* Borrowed Copies (Read-only) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currently Borrowed
              </label>
              <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {formData.totalCopies - formData.availableCopies} copies
              </div>
              <p className="text-gray-500 text-xs mt-1">
                Calculated automatically: Total Copies - Available Copies
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.LIBRARY)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          📝 Editing Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
          <li>Be careful when changing ISBN - it must remain unique</li>
          <li>
            Total copies must be at least equal to currently borrowed copies
          </li>
          <li>
            Available copies will update automatically when books are
            issued/returned
          </li>
          <li>
            Borrowed copies = Total Copies - Available Copies (calculated
            automatically)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EditBook;
