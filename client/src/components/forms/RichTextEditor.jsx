import { Editor } from "@tinymce/tinymce-react";
import { AlertCircle } from "lucide-react";
import { useRef } from "react";

/**
 * RichTextEditor Component
 * WYSIWYG editor with full formatting capabilities using TinyMCE
 *
 * Features:
 * - Full text formatting (bold, italic, underline, etc.)
 * - Lists (ordered, unordered)
 * - Links and images
 * - Tables
 * - Code blocks
 * - HTML source editing
 * - Character/word count
 * - Customizable toolbar
 * - Error handling and validation
 *
 * @param {Object} props
 * @param {string} props.name - Field name for form integration
 * @param {string} props.value - Current editor content (HTML)
 * @param {Function} props.onChange - Change handler (value) => void
 * @param {string} props.label - Editor label
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.height - Editor height in pixels (default: 400)
 * @param {boolean} props.required - Required field indicator
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.error - Error message
 * @param {string} props.hint - Helper text
 * @param {string} props.toolbar - Toolbar configuration (basic|standard|full)
 * @param {boolean} props.showCharCount - Show character count
 * @param {number} props.maxLength - Maximum character length
 * @param {string} props.className - Additional CSS classes
 */
const RichTextEditor = ({
  name,
  value = "",
  onChange,
  label,
  placeholder = "Start typing...",
  height = 400,
  required = false,
  disabled = false,
  error,
  hint,
  toolbar = "standard",
  showCharCount = true,
  maxLength,
  className = "",
}) => {
  const editorRef = useRef(null);

  // Toolbar configurations
  const toolbarConfigs = {
    basic: "bold italic underline | bullist numlist | link",
    standard:
      "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat",
    full: "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | code | removeformat | help",
  };

  // Handle editor change
  const handleEditorChange = (content, editor) => {
    if (onChange) {
      onChange(content);
    }
  };

  // Get character count
  const getCharCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.getContent({ format: "text" });
      return text.length;
    }
    return 0;
  };

  const charCount = value ? value.replace(/<[^>]*>/g, "").length : 0;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Editor Container */}
      <div
        className={`border rounded-lg overflow-hidden ${
          error
            ? "border-red-300 ring-2 ring-red-100"
            : disabled
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
        }`}
      >
        <Editor
          apiKey="no-api-key" // Use self-hosted TinyMCE (included via CDN)
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={value}
          onEditorChange={handleEditorChange}
          disabled={disabled}
          init={{
            height: height,
            menubar: toolbar === "full",
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar: toolbarConfigs[toolbar] || toolbarConfigs.standard,
            content_style:
              'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
            placeholder: placeholder,
            branding: false,
            resize: true,
            statusbar: showCharCount,
            elementpath: false,
            // Image upload handling
            images_upload_handler: (blobInfo, progress) =>
              new Promise((resolve, reject) => {
                // Convert image to base64 for now (in production, upload to server)
                const reader = new FileReader();
                reader.onload = () => {
                  resolve(reader.result);
                };
                reader.onerror = () => {
                  reject("Image upload failed");
                };
                reader.readAsDataURL(blobInfo.blob());
              }),
            // Paste handling
            paste_data_images: true,
            paste_as_text: false,
            // Link settings
            link_default_target: "_blank",
            link_assume_external_targets: true,
            // Character limit
            ...(maxLength && {
              setup: (editor) => {
                editor.on("keydown", (e) => {
                  const text = editor.getContent({ format: "text" });
                  if (
                    text.length >= maxLength &&
                    e.keyCode !== 8 &&
                    e.keyCode !== 46
                  ) {
                    e.preventDefault();
                  }
                });
              },
            }),
          }}
        />
      </div>

      {/* Footer - Character Count / Error / Hint */}
      <div className="mt-2 flex items-start justify-between">
        <div className="flex-1">
          {/* Error Message */}
          {error && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Hint Text */}
          {!error && hint && <p className="text-sm text-gray-500">{hint}</p>}
        </div>

        {/* Character Count */}
        {showCharCount && maxLength && (
          <div
            className={`text-sm ml-4 flex-shrink-0 ${
              isOverLimit ? "text-red-600 font-medium" : "text-gray-500"
            }`}
          >
            {charCount} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
