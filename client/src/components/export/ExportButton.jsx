/**
 * ExportButton Component
 * Reusable button with dropdown for exporting data in multiple formats
 */

import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  printElement,
} from "../../utils/exportHelpers";
import Button from "../common/Button";

const ExportButton = ({
  data = [],
  columns = [],
  filename = "export",
  title = "Export Data",
  metadata = {},
  formats = ["csv", "excel", "pdf", "print"],
  orientation = "portrait",
  pageSize = "a4",
  printElementId = null,
  onExport = null,
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (format) => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    setIsExporting(true);
    setIsOpen(false);

    try {
      switch (format) {
        case "csv":
          exportToCSV(data, filename, columns);
          break;
        case "excel":
          exportToExcel(data, filename, columns);
          break;
        case "pdf":
          exportToPDF(data, filename, columns, {
            title,
            orientation,
            pageSize,
            metadata,
          });
          break;
        case "print":
          if (printElementId) {
            printElement(printElementId);
          } else {
            window.print();
          }
          break;
        default:
          console.warn(`Unknown export format: ${format}`);
      }

      // Call onExport callback if provided
      if (onExport) {
        onExport(format);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatOptions = [
    {
      id: "csv",
      label: "Export as CSV",
      icon: FileText,
      description: "Comma-separated values",
    },
    {
      id: "excel",
      label: "Export as Excel",
      icon: FileSpreadsheet,
      description: "Microsoft Excel format",
    },
    {
      id: "pdf",
      label: "Export as PDF",
      icon: FileText,
      description: "Portable Document Format",
    },
    {
      id: "print",
      label: "Print",
      icon: Printer,
      description: "Print-friendly view",
    },
  ].filter((option) => formats.includes(option.id));

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        icon={<Download className="h-4 w-4" />}
        disabled={isExporting || !data || data.length === 0}
        className="flex items-center gap-2"
      >
        Export
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {formatOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleExport(option.id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 group"
                  disabled={isExporting}
                >
                  <Icon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer info */}
          <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-500">
              {data.length} {data.length === 1 ? "record" : "records"} available
            </p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isExporting && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
