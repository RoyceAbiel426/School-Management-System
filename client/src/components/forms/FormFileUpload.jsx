import { AlertCircle, CheckCircle2, Upload, X } from "lucide-react";
import { forwardRef, useRef, useState } from "react";
import {
  formatFileSize,
  getFileIcon,
  isImageFile,
} from "../../utils/formHelpers";

/**
 * FormFileUpload Component
 * File upload with drag-and-drop and preview
 *
 * Features:
 * - Drag and drop support
 * - File preview (images)
 * - Multiple files support
 * - File type validation
 * - File size validation
 * - Progress indicator
 * - Remove files
 * - Full accessibility
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.name - Field name
 * @param {Object} props.error - Error object
 * @param {boolean} props.required - Mark as required
 * @param {boolean} props.disabled - Disable upload
 * @param {string} props.helperText - Helper text
 * @param {Array} props.accept - Accepted file types (e.g., ['jpg', 'png', 'pdf'])
 * @param {number} props.maxSize - Max file size in MB
 * @param {boolean} props.multiple - Allow multiple files
 * @param {number} props.maxFiles - Maximum number of files
 * @param {boolean} props.showPreview - Show file preview
 * @param {Function} props.onChange - Change handler
 * @param {string} props.className - Additional classes
 */
const FormFileUpload = forwardRef(
  (
    {
      label,
      name,
      error,
      required = false,
      disabled = false,
      helperText,
      accept = [],
      maxSize = 5, // MB
      multiple = false,
      maxFiles = 5,
      showPreview = true,
      onChange,
      className = "",
      ...rest
    },
    ref
  ) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef(null);

    // Validate file
    const validateFile = (file) => {
      const errors = [];

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`File size exceeds ${maxSize}MB`);
      }

      // Check file type
      if (accept.length > 0) {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!accept.includes(fileExtension)) {
          errors.push(`Only ${accept.join(", ")} files are allowed`);
        }
      }

      return errors;
    };

    // Handle file selection
    const handleFileChange = (selectedFiles) => {
      const fileArray = Array.from(selectedFiles);
      const newFiles = [];
      const errors = [];

      // Check max files
      if (!multiple && fileArray.length > 1) {
        errors.push("Only one file is allowed");
        return;
      }

      if (files.length + fileArray.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate each file
      fileArray.forEach((file) => {
        const fileErrors = validateFile(file);

        if (fileErrors.length === 0) {
          newFiles.push({
            file,
            id: Math.random().toString(36),
            preview: isImageFile(file.name) ? URL.createObjectURL(file) : null,
            errors: [],
          });
        } else {
          errors.push(`${file.name}: ${fileErrors.join(", ")}`);
        }
      });

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);

      // Simulate upload progress (remove this in production)
      newFiles.forEach((fileObj) => {
        simulateUpload(fileObj.id);
      });

      // Call onChange
      if (onChange) {
        const fileList = updatedFiles.map((f) => f.file);
        onChange({
          target: {
            name,
            files: fileList,
            value: fileList,
          },
        });
      }
    };

    // Simulate upload progress (replace with actual upload logic)
    const simulateUpload = (fileId) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));

        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    };

    // Handle file input change
    const handleInputChange = (e) => {
      if (e.target.files.length > 0) {
        handleFileChange(e.target.files);
      }
    };

    // Handle drag events
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
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

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFileChange(droppedFiles);
      }
    };

    // Remove file
    const removeFile = (fileId) => {
      const updatedFiles = files.filter((f) => f.id !== fileId);
      setFiles(updatedFiles);

      // Remove progress
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });

      // Call onChange
      if (onChange) {
        const fileList = updatedFiles.map((f) => f.file);
        onChange({
          target: {
            name,
            files: fileList,
            value: fileList,
          },
        });
      }
    };

    // Open file dialog
    const openFileDialog = () => {
      if (!disabled) {
        fileInputRef.current?.click();
      }
    };

    // Generate accept attribute for input
    const acceptAttr =
      accept.length > 0 ? accept.map((ext) => `.${ext}`).join(",") : undefined;

    return (
      <div className={`w-full ${className}`}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Hidden File Input */}
        <input
          ref={ref || fileInputRef}
          type="file"
          name={name}
          multiple={multiple}
          accept={acceptAttr}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          aria-label={label || "File upload"}
          {...rest}
        />

        {/* Drop Zone */}
        <div
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragging
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300 hover:border-gray-400"
            }
            ${error ? "border-red-500 bg-red-50" : ""}
            ${disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}
          `}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload file area"
        >
          {/* Upload Icon */}
          <div className="flex flex-col items-center gap-3">
            <div
              className={`p-3 rounded-full ${
                isDragging ? "bg-primary-100" : "bg-gray-100"
              }`}
            >
              <Upload
                className={`w-8 h-8 ${
                  isDragging ? "text-primary-600" : "text-gray-400"
                }`}
              />
            </div>

            {/* Instructions */}
            <div>
              <p className="text-base font-medium text-gray-700">
                {isDragging
                  ? "Drop files here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {accept.length > 0
                  ? `${accept.join(", ").toUpperCase()}`
                  : "Any file type"}{" "}
                {maxSize && `(Max ${maxSize}MB)`}
              </p>
              {multiple && (
                <p className="text-xs text-gray-400 mt-1">
                  Maximum {maxFiles} files
                </p>
              )}
            </div>
          </div>

          {/* Error Icon Overlay */}
          {error && (
            <div className="absolute top-4 right-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          )}
        </div>

        {/* File Preview List */}
        {showPreview && files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((fileObj) => {
              const progress = uploadProgress[fileObj.id] || 0;
              const isComplete = progress >= 100;

              return (
                <div
                  key={fileObj.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {/* File Preview / Icon */}
                  <div className="flex-shrink-0">
                    {fileObj.preview ? (
                      <img
                        src={fileObj.preview}
                        alt={fileObj.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-2xl">
                        {getFileIcon(fileObj.file.name)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileObj.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileObj.file.size)}
                    </p>

                    {/* Progress Bar */}
                    {!isComplete && (
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Status Icon */}
                  {isComplete && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}

                  {/* Remove Button */}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fileObj.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                      aria-label={`Remove ${fileObj.file.name}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Helper Text / Error Message */}
        <div className="mt-1.5">
          {error && (
            <p
              id={`${name}-error`}
              className="text-sm text-red-600"
              role="alert"
            >
              {error.message || "This field is invalid"}
            </p>
          )}

          {!error && helperText && (
            <p id={`${name}-helper`} className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormFileUpload.displayName = "FormFileUpload";

export default FormFileUpload;
