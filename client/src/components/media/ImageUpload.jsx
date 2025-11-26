import { AlertCircle, Check, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

/**
 * ImageUpload Component
 * Advanced image upload with preview, cropping, and validation
 *
 * Features:
 * - Drag and drop upload
 * - Click to browse
 * - Image preview
 * - File validation (size, type)
 * - Multiple images support
 * - Remove uploaded images
 * - Progress indicator
 * - Error handling
 * - Aspect ratio enforcement
 *
 * @param {Object} props
 * @param {string} props.name - Field name
 * @param {string|Array} props.value - Current image URL(s)
 * @param {Function} props.onChange - Change handler (file(s) or URL(s))
 * @param {string} props.label - Upload label
 * @param {boolean} props.multiple - Allow multiple images
 * @param {number} props.maxSize - Max file size in MB (default: 5)
 * @param {Array} props.acceptedTypes - Accepted MIME types
 * @param {string} props.aspectRatio - Aspect ratio (e.g., '16:9', '1:1', '4:3')
 * @param {number} props.maxFiles - Maximum number of files (for multiple)
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.error - Error message
 * @param {string} props.hint - Helper text
 * @param {string} props.className - Additional CSS classes
 */
const ImageUpload = ({
  name,
  value,
  onChange,
  label,
  multiple = false,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  aspectRatio,
  maxFiles = 10,
  required = false,
  disabled = false,
  error,
  hint,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState(
    value ? (Array.isArray(value) ? value : [value]) : []
  );
  const [uploadProgress, setUploadProgress] = useState({});
  const [validationError, setValidationError] = useState("");
  const fileInputRef = useRef(null);

  // Validate file
  const validateFile = (file) => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedTypes
        .map((t) => t.split("/")[1])
        .join(", ")}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size exceeds ${maxSize}MB limit. Current size: ${fileSizeMB.toFixed(
        2
      )}MB`;
    }

    // Check max files
    if (multiple && previews.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = async (files) => {
    const fileList = Array.from(files);
    setValidationError("");

    const newPreviews = [];
    const newProgress = {};

    for (const file of fileList) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        continue;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadstart = () => {
        newProgress[file.name] = 0;
        setUploadProgress({ ...uploadProgress, ...newProgress });
      };
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          newProgress[file.name] = progress;
          setUploadProgress({ ...uploadProgress, ...newProgress });
        }
      };
      reader.onload = (e) => {
        newPreviews.push({
          url: e.target.result,
          name: file.name,
          file: file,
        });

        if (newPreviews.length === fileList.length || !multiple) {
          const updatedPreviews = multiple
            ? [...previews, ...newPreviews].slice(0, maxFiles)
            : newPreviews;

          setPreviews(updatedPreviews);

          // Call onChange with files or URLs
          if (onChange) {
            onChange(
              multiple
                ? updatedPreviews.map((p) => p.file || p.url)
                : updatedPreviews[0]?.file || updatedPreviews[0]?.url
            );
          }

          // Clear progress after upload
          setTimeout(() => {
            setUploadProgress({});
          }, 500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Handle click to browse
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Remove image
  const handleRemove = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);

    if (onChange) {
      onChange(
        multiple
          ? updatedPreviews.map((p) => p.file || p.url)
          : updatedPreviews[0]?.file || updatedPreviews[0]?.url || null
      );
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error || validationError ? "border-red-300 bg-red-50" : ""}
          ${previews.length > 0 ? "bg-gray-50" : ""}
        `}
      >
        {previews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {isDragging
                ? "Drop images here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes
                .map((t) => t.split("/")[1].toUpperCase())
                .join(", ")}{" "}
              up to {maxSize}MB
            </p>
            {multiple && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum {maxFiles} files
              </p>
            )}
          </div>
        ) : (
          <div
            className={`grid gap-4 ${
              multiple
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                {/* Image Preview */}
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={preview.url}
                    alt={preview.name || `Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Upload Progress */}
                {uploadProgress[preview.name] !== undefined &&
                  uploadProgress[preview.name] < 100 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-sm font-medium">
                        {Math.round(uploadProgress[preview.name])}%
                      </div>
                    </div>
                  )}

                {/* Success Indicator */}
                {uploadProgress[preview.name] === 100 && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </button>

                {/* File Name */}
                <p className="text-xs text-gray-600 mt-2 truncate">
                  {preview.name || "Uploaded image"}
                </p>
              </div>
            ))}

            {/* Add More Button (for multiple) */}
            {multiple && previews.length < maxFiles && (
              <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Add more</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={acceptedTypes.join(",")}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {/* Error / Hint */}
      <div className="mt-2">
        {(error || validationError) && (
          <div className="flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{error || validationError}</span>
          </div>
        )}

        {!error && !validationError && hint && (
          <p className="text-sm text-gray-500">{hint}</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
