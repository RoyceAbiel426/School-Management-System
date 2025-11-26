/**
 * ReportBuilder Component
 * Interactive custom report builder with filters and field selection
 */

import { Download, Filter, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  availableTemplates,
  exportCustomReport,
} from "../../utils/exportHelpers";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { FormInput } from "../forms";

const ReportBuilder = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [reportConfig, setReportConfig] = useState({
    templateId: "",
    title: "",
    subtitle: "",
    format: "pdf",
    dateRange: {
      start: "",
      end: "",
    },
    filters: [],
    columns: [],
  });

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [availableFilters, setAvailableFilters] = useState([]);

  // Group templates by category
  const templatesByCategory = availableTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  const handleTemplateChange = (templateId) => {
    const template = availableTemplates.find((t) => t.id === templateId);
    setSelectedTemplate(template);
    setReportConfig((prev) => ({
      ...prev,
      templateId,
      title: template ? template.name : "",
    }));

    // Set available filters based on template
    if (template) {
      const filters = getFiltersForTemplate(template.id);
      setAvailableFilters(filters);
    }
  };

  const getFiltersForTemplate = (templateId) => {
    const commonFilters = [
      { id: "dateRange", label: "Date Range", type: "dateRange" },
    ];

    const specificFilters = {
      attendance: [
        ...commonFilters,
        {
          id: "grade",
          label: "Grade",
          type: "select",
          options: Array.from({ length: 14 }, (_, i) => i + 1),
        },
        {
          id: "class",
          label: "Class",
          type: "select",
          options: ["A", "B", "C", "D", "E"],
        },
        {
          id: "status",
          label: "Status",
          type: "select",
          options: ["present", "absent", "late", "leave"],
        },
      ],
      results: [
        ...commonFilters,
        {
          id: "grade",
          label: "Grade",
          type: "select",
          options: Array.from({ length: 14 }, (_, i) => i + 1),
        },
        {
          id: "examType",
          label: "Exam Type",
          type: "select",
          options: ["midterm", "final", "quiz"],
        },
      ],
      studentList: [
        {
          id: "grade",
          label: "Grade",
          type: "select",
          options: Array.from({ length: 14 }, (_, i) => i + 1),
        },
        {
          id: "class",
          label: "Class",
          type: "select",
          options: ["A", "B", "C", "D", "E"],
        },
        {
          id: "gender",
          label: "Gender",
          type: "select",
          options: ["male", "female"],
        },
      ],
      libraryBooks: [
        { id: "category", label: "Category", type: "text" },
        {
          id: "availability",
          label: "Availability",
          type: "select",
          options: ["available", "issued"],
        },
      ],
      libraryTransactions: [
        ...commonFilters,
        {
          id: "status",
          label: "Status",
          type: "select",
          options: ["issued", "returned", "overdue"],
        },
      ],
      sportsParticipants: [
        { id: "sport", label: "Sport", type: "text" },
        {
          id: "category",
          label: "Category",
          type: "select",
          options: ["indoor", "outdoor"],
        },
      ],
    };

    return specificFilters[templateId] || commonFilters;
  };

  const addFilter = (filterId) => {
    const filterDef = availableFilters.find((f) => f.id === filterId);
    if (!filterDef) return;

    const newFilter = {
      id: Date.now(),
      field: filterId,
      label: filterDef.label,
      type: filterDef.type,
      value: filterDef.type === "dateRange" ? { start: "", end: "" } : "",
      options: filterDef.options || [],
    };

    setReportConfig((prev) => ({
      ...prev,
      filters: [...prev.filters, newFilter],
    }));
  };

  const removeFilter = (filterId) => {
    setReportConfig((prev) => ({
      ...prev,
      filters: prev.filters.filter((f) => f.id !== filterId),
    }));
  };

  const updateFilter = (filterId, value) => {
    setReportConfig((prev) => ({
      ...prev,
      filters: prev.filters.map((f) =>
        f.id === filterId ? { ...f, value } : f
      ),
    }));
  };

  const handleGenerate = async () => {
    if (!reportConfig.templateId) {
      alert("Please select a report template");
      return;
    }

    try {
      // In a real implementation, you would fetch data based on filters
      // For now, we'll show a message
      const summary = {
        "Report Type": selectedTemplate?.name,
        "Generated By": user?.name || "Admin",
        "Filters Applied": reportConfig.filters.length,
        Date: new Date().toLocaleDateString(),
      };

      // Mock data for demonstration
      const mockData = [];

      exportCustomReport({
        title: reportConfig.title,
        subtitle:
          reportConfig.subtitle ||
          `Generated on ${new Date().toLocaleDateString()}`,
        data: mockData,
        columns: [], // Would come from template
        filename: reportConfig.title.toLowerCase().replace(/\s+/g, "_"),
        format: reportConfig.format,
        summary,
        footer: `Report generated by ${user?.name || "Edu-Pro System"}`,
      });

      // Close modal after export
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Custom Report Builder"
      size="xl"
    >
      <div className="space-y-6">
        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Template
          </label>
          <select
            value={reportConfig.templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a template...</option>
            {Object.entries(templatesByCategory).map(
              ([category, templates]) => (
                <optgroup key={category} label={category}>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </optgroup>
              )
            )}
          </select>
        </div>

        {selectedTemplate && (
          <>
            {/* Report Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Report Title"
                value={reportConfig.title}
                onChange={(e) =>
                  setReportConfig((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Enter custom title (optional)"
              />
              <FormInput
                label="Subtitle"
                value={reportConfig.subtitle}
                onChange={(e) =>
                  setReportConfig((prev) => ({
                    ...prev,
                    subtitle: e.target.value,
                  }))
                }
                placeholder="Enter subtitle (optional)"
              />
            </div>

            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="flex gap-3">
                {["pdf", "excel", "csv"].map((format) => (
                  <label
                    key={format}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format}
                      checked={reportConfig.format === format}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          format: e.target.value,
                        }))
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 uppercase">
                      {format}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </label>
                {availableFilters.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addFilter(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Add filter...</option>
                    {availableFilters.map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Active Filters */}
              {reportConfig.filters.length > 0 ? (
                <div className="space-y-2">
                  {reportConfig.filters.map((filter) => (
                    <div
                      key={filter.id}
                      className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 block mb-1">
                          {filter.label}
                        </label>
                        {filter.type === "dateRange" ? (
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={filter.value.start}
                              onChange={(e) =>
                                updateFilter(filter.id, {
                                  ...filter.value,
                                  start: e.target.value,
                                })
                              }
                              className="text-sm px-2 py-1 border border-gray-300 rounded"
                            />
                            <input
                              type="date"
                              value={filter.value.end}
                              onChange={(e) =>
                                updateFilter(filter.id, {
                                  ...filter.value,
                                  end: e.target.value,
                                })
                              }
                              className="text-sm px-2 py-1 border border-gray-300 rounded"
                            />
                          </div>
                        ) : filter.type === "select" ? (
                          <select
                            value={filter.value}
                            onChange={(e) =>
                              updateFilter(filter.id, e.target.value)
                            }
                            className="text-sm px-2 py-1 border border-gray-300 rounded w-full"
                          >
                            <option value="">All</option>
                            {filter.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={filter.value}
                            onChange={(e) =>
                              updateFilter(filter.id, e.target.value)
                            }
                            className="text-sm px-2 py-1 border border-gray-300 rounded w-full"
                            placeholder={`Enter ${filter.label.toLowerCase()}`}
                          />
                        )}
                      </div>
                      <button
                        onClick={() => removeFilter(filter.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                  No filters added. Add filters to refine your report.
                </div>
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            icon={<Download className="h-4 w-4" />}
            disabled={!reportConfig.templateId}
          >
            Generate Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportBuilder;
