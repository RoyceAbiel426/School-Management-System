import {
  AlertCircle,
  Download,
  FileText,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";

/**
 * PDFViewer Component
 * Display PDF files with navigation and zoom controls
 *
 * Features:
 * - PDF display using iframe/embed
 * - Zoom in/out controls
 * - Page navigation
 * - Download option
 * - Fullscreen mode
 * - Loading state
 * - Error handling
 *
 * @param {Object} props
 * @param {string} props.url - PDF file URL
 * @param {string} props.title - PDF title
 * @param {number} props.height - Viewer height (default: 600)
 * @param {boolean} props.showControls - Show control buttons (default: true)
 * @param {boolean} props.allowDownload - Allow PDF download (default: true)
 * @param {boolean} props.allowFullscreen - Allow fullscreen mode (default: true)
 * @param {Function} props.onError - Error callback
 * @param {string} props.className - Additional CSS classes
 */
const PDFViewer = ({
  url,
  title = "PDF Document",
  height = 600,
  showControls = true,
  allowDownload = true,
  allowFullscreen = true,
  onError,
  className = "",
}) => {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  // Download PDF
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = title || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle load
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Handle error
  const handleError = (e) => {
    setIsLoading(false);
    setError(
      "Failed to load PDF. The file may be corrupted or the URL is invalid."
    );
    if (onError) {
      onError(e);
    }
  };

  if (error) {
    return (
      <div
        className={`bg-white border border-gray-300 rounded-lg p-8 ${className}`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load PDF
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          {allowDownload && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-300 rounded-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      } ${className}`}
    >
      {/* Controls Bar */}
      {showControls && (
        <div className="bg-gray-100 border-b border-gray-300 px-4 py-3 flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
              {title}
            </span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-white border border-gray-300 rounded-lg">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-x border-gray-300"
                title="Reset Zoom"
              >
                {zoom}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 text-gray-700" />
              </button>
            </div>

            {/* Download Button */}
            {allowDownload && (
              <button
                onClick={handleDownload}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Download PDF"
              >
                <Download className="h-4 w-4 text-gray-700" />
              </button>
            )}

            {/* Fullscreen Toggle */}
            {allowFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 text-gray-700" />
                ) : (
                  <Maximize2 className="h-4 w-4 text-gray-700" />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      <div
        className="relative"
        style={{ height: isFullscreen ? "calc(100vh - 64px)" : height }}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {/* PDF Embed */}
        <iframe
          src={`${url}#zoom=${zoom}`}
          title={title}
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default PDFViewer;
