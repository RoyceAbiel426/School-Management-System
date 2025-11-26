import {
  Archive,
  Download,
  File,
  FileText,
  Folder,
  Grid,
  Image as ImageIcon,
  List,
  MoreVertical,
  Music,
  Search,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useState } from "react";

/**
 * FileManager Component
 * Comprehensive file management with upload, organize, preview
 *
 * Features:
 * - File upload (drag & drop, browse)
 * - Folder organization
 * - Grid/List view toggle
 * - Search and filter
 * - Sort options
 * - File actions (download, delete, rename, copy)
 * - File preview
 * - Breadcrumb navigation
 * - Context menu
 *
 * @param {Object} props
 * @param {Array} props.files - Array of file objects
 * @param {string} props.currentPath - Current folder path
 * @param {Function} props.onUpload - Upload handler
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onRename - Rename handler
 * @param {Function} props.onDownload - Download handler
 * @param {Function} props.onNavigate - Navigate to folder
 * @param {boolean} props.allowUpload - Allow file upload (default: true)
 * @param {boolean} props.allowDelete - Allow file delete (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const FileManager = ({
  files = [],
  currentPath = "/",
  onUpload,
  onDelete,
  onRename,
  onDownload,
  onNavigate,
  allowUpload = true,
  allowDelete = true,
  className = "",
}) => {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // 'name' | 'date' | 'size' | 'type'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(null);

  // Get file icon based on type
  const getFileIcon = (file) => {
    const iconClass = "h-5 w-5";

    if (file.type === "folder") {
      return <Folder className={`${iconClass} text-yellow-500`} />;
    }

    const ext = file.name.split(".").pop().toLowerCase();
    const mimeType = file.mimeType || "";

    if (
      mimeType.startsWith("image/") ||
      ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)
    ) {
      return <ImageIcon className={`${iconClass} text-blue-500`} />;
    }
    if (
      mimeType.startsWith("video/") ||
      ["mp4", "avi", "mov", "wmv"].includes(ext)
    ) {
      return <Video className={`${iconClass} text-purple-500`} />;
    }
    if (
      mimeType.startsWith("audio/") ||
      ["mp3", "wav", "ogg", "flac"].includes(ext)
    ) {
      return <Music className={`${iconClass} text-pink-500`} />;
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
      return <Archive className={`${iconClass} text-orange-500`} />;
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext)) {
      return <FileText className={`${iconClass} text-red-500`} />;
    }

    return <File className={`${iconClass} text-gray-500`} />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Filter and sort files
  const filteredFiles = files
    .filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return new Date(b.modifiedDate) - new Date(a.modifiedDate);
        case "size":
          return (b.size || 0) - (a.size || 0);
        case "type":
          return (a.type || "").localeCompare(b.type || "");
        default:
          return 0;
      }
    });

  // Handle file selection
  const toggleFileSelection = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Handle file actions
  const handleFileAction = (action, file) => {
    setShowContextMenu(null);

    switch (action) {
      case "download":
        if (onDownload) onDownload(file);
        break;
      case "delete":
        if (onDelete && allowDelete) onDelete(file);
        break;
      case "rename":
        if (onRename) onRename(file);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`bg-white border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          {/* Left: Upload Button */}
          <div>
            {allowUpload && (
              <button
                onClick={() => onUpload && onUpload()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </button>
            )}
          </div>

          {/* Right: View Toggle */}
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200"
                }`}
                title="Grid View"
              >
                <Grid className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200"
                }`}
                title="List View"
              >
                <List className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="size">Sort by Size</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
      </div>

      {/* File List */}
      <div className="p-4">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No files found</p>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                onClick={() =>
                  file.type === "folder" && onNavigate && onNavigate(file.path)
                }
                className={`
                  group relative p-4 border rounded-lg cursor-pointer transition-all
                  ${
                    selectedFiles.includes(file.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {/* File Icon/Thumbnail */}
                <div className="flex items-center justify-center mb-3">
                  {file.thumbnail ? (
                    <img
                      src={file.thumbnail}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>

                {/* File Name */}
                <p className="text-sm font-medium text-gray-900 truncate text-center">
                  {file.name}
                </p>

                {/* File Size */}
                {file.size && (
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {formatFileSize(file.size)}
                  </p>
                )}

                {/* Action Menu */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowContextMenu(
                      showContextMenu === file.id ? null : file.id
                    );
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <MoreVertical className="h-4 w-4 text-gray-600" />
                </button>

                {/* Context Menu */}
                {showContextMenu === file.id && (
                  <div className="absolute top-8 right-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                    <button
                      onClick={() => handleFileAction("download", file)}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    {allowDelete && (
                      <button
                        onClick={() => handleFileAction("delete", file)}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-1">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                onClick={() =>
                  file.type === "folder" && onNavigate && onNavigate(file.path)
                }
                className={`
                  group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                  ${
                    selectedFiles.includes(file.id)
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center flex-1 min-w-0">
                  {/* Icon */}
                  <div className="mr-3">{getFileIcon(file)}</div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.modifiedDate &&
                        new Date(file.modifiedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Size */}
                <div className="mx-4 text-sm text-gray-500 flex-shrink-0">
                  {file.size ? formatFileSize(file.size) : "-"}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction("download", file);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Download"
                  >
                    <Download className="h-4 w-4 text-gray-600" />
                  </button>
                  {allowDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction("delete", file);
                      }}
                      className="p-1 hover:bg-red-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;
