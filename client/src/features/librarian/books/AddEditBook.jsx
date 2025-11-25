import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Input, Alert } from "../../../components/common";
import { librarianService } from "../../../services/librarianService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { Save, ArrowLeft } from "lucide-react";

function AddEditBook() {
  const { bookId } = useParams();
  const isEdit = Boolean(bookId);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    publisher: "",
    publishYear: "",
    totalCopies: 1,
    description: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useNotification();

  useEffect(() => {
    if (isEdit) {
      fetchBook();
    }
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const response = await librarianService.getBook(bookId);
      const book = response.data || {};
      setFormData({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        category: book.category || "",
        publisher: book.publisher || "",
        publishYear: book.publishYear || "",
        totalCopies: book.totalCopies || 1,
        description: book.description || "",
        status: book.status || "active",
      });
    } catch (err) {
      showError("Failed to load book details");
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim()) {
      setError("Title and Author are required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (isEdit) {
        await librarianService.updateBook(bookId, formData);
        showSuccess("Book updated successfully");
      } else {
        await librarianService.createBook(formData);
        showSuccess("Book added successfully");
      }

      setTimeout(() => {
        navigate(ROUTES.LIBRARIAN_BOOKS);
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        `Failed to ${isEdit ? "update" : "add"} book`;
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title={isEdit ? "Edit Book" : "Add New Book"}
      subtitle={
        isEdit ? "Update book information" : "Add a new book to the catalog"
      }
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.LIBRARIAN_BOOKS)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Catalog
        </Button>
      </div>

      <div className="max-w-4xl">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Book Title <span className="text-error-500">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Author <span className="text-error-500">*</span>
                </label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="isbn"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ISBN
                </label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="Enter ISBN"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                  <option value="Reference">Reference</option>
                  <option value="Textbook">Textbook</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="publisher"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Publisher
                </label>
                <Input
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  placeholder="Enter publisher name"
                />
              </div>

              <div>
                <label
                  htmlFor="publishYear"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Publish Year
                </label>
                <Input
                  id="publishYear"
                  name="publishYear"
                  type="number"
                  value={formData.publishYear}
                  onChange={handleChange}
                  placeholder="Enter publish year"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label
                  htmlFor="totalCopies"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Total Copies
                </label>
                <Input
                  id="totalCopies"
                  name="totalCopies"
                  type="number"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter book description..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                icon={<Save className="h-4 w-4" />}
              >
                {submitting
                  ? isEdit
                    ? "Updating..."
                    : "Adding..."
                  : isEdit
                  ? "Update Book"
                  : "Add Book"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.LIBRARIAN_BOOKS)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AddEditBook;
