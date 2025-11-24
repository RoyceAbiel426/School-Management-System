import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Download,
  FileText,
  Upload,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../../components/common/Alert";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

export default function BulkImportStudents() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please select a CSV file");
      return;
    }

    setFile(selectedFile);
    setError(null);
    parseCSV(selectedFile);
  };

  const parseCSV = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n");

      if (lines.length < 2) {
        setError("CSV file is empty or invalid");
        return;
      }

      // Parse header
      const headers = lines[0].split(",").map((h) => h.trim());

      // Parse rows
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(",").map((v) => v.trim());
        const row = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });

        data.push(row);
      }

      setCsvData(data);
      validateCSVData(data);
    };

    reader.onerror = () => {
      setError("Failed to read CSV file");
    };

    reader.readAsText(file);
  };

  const validateCSVData = (data) => {
    const results = {
      valid: [],
      invalid: [],
      total: data.length,
    };

    const requiredFields = [
      "name",
      "email",
      "class",
      "rollNumber",
      "phone",
      "address",
    ];

    data.forEach((row, index) => {
      const errors = [];

      // Check required fields
      requiredFields.forEach((field) => {
        if (!row[field] || !row[field].trim()) {
          errors.push(`Missing ${field}`);
        }
      });

      // Validate email format
      if (row.email && !row.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push("Invalid email format");
      }

      // Validate phone format
      if (row.phone && !row.phone.match(/^\d{10}$/)) {
        errors.push("Invalid phone number (should be 10 digits)");
      }

      const result = {
        index: index + 1,
        data: row,
        errors,
        isValid: errors.length === 0,
      };

      if (result.isValid) {
        results.valid.push(result);
      } else {
        results.invalid.push(result);
      }
    });

    setValidationResults(results);
  };

  const handleImport = async () => {
    if (!validationResults || validationResults.valid.length === 0) {
      setError("No valid students to import");
      return;
    }

    try {
      setImporting(true);
      setError(null);

      const studentsToImport = validationResults.valid.map((v) => v.data);

      // Import students in batches
      const batchSize = 10;
      const results = {
        successful: 0,
        failed: 0,
        errors: [],
      };

      for (let i = 0; i < studentsToImport.length; i += batchSize) {
        const batch = studentsToImport.slice(i, i + batchSize);

        for (const student of batch) {
          try {
            await adminService.createStudent(student);
            results.successful++;
          } catch (err) {
            results.failed++;
            results.errors.push({
              student: student.name,
              error: err.response?.data?.message || "Failed to create student",
            });
          }
        }
      }

      setImportResults(results);
    } catch (err) {
      console.error("Error importing students:", err);
      setError("Failed to import students");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,email,dateOfBirth,gender,bloodGroup,class,section,rollNumber,admissionDate,phone,parentPhone,parentEmail,address,city,state,pincode,status
John Doe,john@example.com,2010-01-15,Male,O+,Class 5,A,101,2024-04-01,9876543210,9876543211,parent@example.com,123 Main St,Mumbai,Maharashtra,400001,active
Jane Smith,jane@example.com,2010-03-20,Female,A+,Class 5,B,102,2024-04-01,9876543220,9876543221,parent2@example.com,456 Park Ave,Delhi,Delhi,110001,active`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetImport = () => {
    setFile(null);
    setCsvData([]);
    setValidationResults(null);
    setImportResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.STUDENTS)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Bulk Import Students</h1>
        <p className="text-muted-foreground">
          Import multiple students at once using a CSV file
        </p>
      </div>

      {/* Error Message */}
      {error && <Alert type="error">{error}</Alert>}

      {/* Import Results */}
      {importResults && (
        <Alert type={importResults.failed === 0 ? "success" : "warning"}>
          <div className="space-y-2">
            <p className="font-semibold">Import Complete!</p>
            <p>Successfully imported: {importResults.successful} students</p>
            {importResults.failed > 0 && (
              <>
                <p>Failed: {importResults.failed} students</p>
                <div className="mt-2 space-y-1">
                  {importResults.errors.map((err, index) => (
                    <p key={index} className="text-sm">
                      • {err.student}: {err.error}
                    </p>
                  ))}
                </div>
              </>
            )}
            <Button
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN_ROUTES.STUDENTS)}
              className="mt-2"
            >
              View Students
            </Button>
          </div>
        </Alert>
      )}

      {/* Instructions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Download the CSV template using the button below</li>
          <li>Fill in the student information in the CSV file</li>
          <li>
            Required fields: name, email, class, rollNumber, phone, address
          </li>
          <li>Upload the completed CSV file</li>
          <li>Review the validation results</li>
          <li>Click "Import Students" to add them to the system</li>
        </ol>

        <Button variant="outline" onClick={downloadTemplate} className="mt-4">
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </Card>

      {/* File Upload */}
      {!importResults && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Upload CSV File</h3>

          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                {file ? file.name : "Click to select CSV file"}
              </p>
              <p className="text-sm text-muted-foreground">
                or drag and drop your CSV file here
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {file && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={resetImport}>
                  Remove
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Validation Results */}
      {validationResults && !importResults && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Validation Results</h3>
            <div className="flex gap-2">
              <Badge variant="success">
                <CheckCircle className="w-3 h-3 mr-1" />
                {validationResults.valid.length} Valid
              </Badge>
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                {validationResults.invalid.length} Invalid
              </Badge>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total Records</div>
              <div className="text-2xl font-bold">
                {validationResults.total}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-700">Valid</div>
              <div className="text-2xl font-bold text-green-700">
                {validationResults.valid.length}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-sm text-red-700">Invalid</div>
              <div className="text-2xl font-bold text-red-700">
                {validationResults.invalid.length}
              </div>
            </div>
          </div>

          {/* Invalid Records */}
          {validationResults.invalid.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                Invalid Records
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {validationResults.invalid.map((record) => (
                  <div
                    key={record.index}
                    className="border border-red-200 rounded-lg p-3 bg-red-50"
                  >
                    <div className="font-medium mb-1">
                      Row {record.index}: {record.data.name || "Unnamed"}
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {record.errors.map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Valid Records Preview */}
          {validationResults.valid.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Valid Records (Preview - First 5)
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {validationResults.valid.slice(0, 5).map((record) => (
                  <div
                    key={record.index}
                    className="border border-green-200 rounded-lg p-3 bg-green-50"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        <span className="font-medium">{record.data.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        <span className="font-medium">{record.data.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Class:</span>{" "}
                        <span className="font-medium">{record.data.class}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Roll:</span>{" "}
                        <span className="font-medium">
                          {record.data.rollNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {validationResults.valid.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    ... and {validationResults.valid.length - 5} more valid
                    records
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Import Button */}
          {validationResults.valid.length > 0 && (
            <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t">
              <Button
                variant="outline"
                onClick={resetImport}
                disabled={importing}
              >
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={importing}>
                {importing ? (
                  "Importing..."
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import {validationResults.valid.length} Students
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
