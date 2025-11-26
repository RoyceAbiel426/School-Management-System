/**
 * Chart Configuration and Utilities
 * Color themes, data transformation helpers, and chart settings
 */

/**
 * Chart Color Palettes
 */
export const chartColors = {
  // Primary palette (6 colors)
  primary: [
    "#4F46E5", // indigo-600
    "#7C3AED", // violet-600
    "#EC4899", // pink-600
    "#F59E0B", // amber-500
    "#10B981", // emerald-500
    "#3B82F6", // blue-500
  ],

  // Success palette (green shades)
  success: [
    "#10B981", // emerald-500
    "#34D399", // emerald-400
    "#6EE7B7", // emerald-300
    "#A7F3D0", // emerald-200
  ],

  // Warning palette (yellow/orange shades)
  warning: [
    "#F59E0B", // amber-500
    "#FBBF24", // amber-400
    "#FCD34D", // amber-300
    "#FDE68A", // amber-200
  ],

  // Danger palette (red shades)
  danger: [
    "#EF4444", // red-500
    "#F87171", // red-400
    "#FCA5A5", // red-300
    "#FECACA", // red-200
  ],

  // Info palette (blue shades)
  info: [
    "#3B82F6", // blue-500
    "#60A5FA", // blue-400
    "#93C5FD", // blue-300
    "#BFDBFE", // blue-200
  ],

  // Gradient colors
  gradient: {
    from: "#4F46E5",
    to: "#7C3AED",
  },

  // Chart specific colors
  attendance: {
    present: "#10B981", // green
    absent: "#EF4444", // red
    late: "#F59E0B", // amber
    excused: "#3B82F6", // blue
  },

  results: {
    excellent: "#10B981", // green
    good: "#3B82F6", // blue
    average: "#F59E0B", // amber
    poor: "#EF4444", // red
  },

  library: {
    issued: "#4F46E5", // indigo
    returned: "#10B981", // green
    overdue: "#EF4444", // red
    available: "#3B82F6", // blue
  },

  sports: {
    gold: "#F59E0B", // amber
    silver: "#9CA3AF", // gray
    bronze: "#D97706", // amber-600
  },
};

/**
 * Default chart configuration
 */
export const defaultChartConfig = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
  animationDuration: 500,
  animationEasing: "ease-in-out",
};

/**
 * Responsive chart dimensions
 */
export const chartDimensions = {
  sm: { width: 300, height: 200 },
  md: { width: 500, height: 300 },
  lg: { width: 700, height: 400 },
  xl: { width: 900, height: 500 },
  full: { width: "100%", height: 400 },
};

/**
 * Format number for chart display
 */
export const formatChartNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return "0";

  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)}M`;
  } else if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(decimals)}K`;
  }

  return value.toFixed(decimals);
};

/**
 * Format percentage for chart display
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return "0%";
  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Generate color array for charts
 */
export const getChartColors = (count, palette = "primary") => {
  const colors = chartColors[palette] || chartColors.primary;

  if (count <= colors.length) {
    return colors.slice(0, count);
  }

  // If more colors needed, repeat the palette
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
};

/**
 * Transform data for pie/donut charts
 */
export const transformToPieData = (data, nameKey, valueKey) => {
  return data.map((item) => ({
    name: item[nameKey],
    value: item[valueKey],
  }));
};

/**
 * Transform data for line/bar charts
 */
export const transformToLineData = (data, xKey, yKeys) => {
  return data.map((item) => {
    const result = { [xKey]: item[xKey] };
    yKeys.forEach((key) => {
      result[key] = item[key];
    });
    return result;
  });
};

/**
 * Calculate percentage distribution
 */
export const calculatePercentages = (data, valueKey) => {
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);

  return data.map((item) => ({
    ...item,
    percentage: total > 0 ? ((item[valueKey] / total) * 100).toFixed(1) : 0,
  }));
};

/**
 * Generate gradient ID for charts
 */
export const generateGradientId = (name) => {
  return `gradient-${name}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get month names
 */
export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Get day names
 */
export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Format date for chart axis
 */
export const formatChartDate = (date, format = "short") => {
  const d = new Date(date);

  switch (format) {
    case "short":
      return `${d.getDate()}/${d.getMonth() + 1}`;
    case "month":
      return monthNames[d.getMonth()];
    case "day":
      return dayNames[d.getDay()];
    case "full":
      return d.toLocaleDateString();
    default:
      return date;
  }
};

/**
 * Calculate trend (up/down/stable)
 */
export const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return "neutral";

  const change = ((current - previous) / previous) * 100;

  if (change > 5) return "up";
  if (change < -5) return "down";
  return "stable";
};

/**
 * Get trend color
 */
export const getTrendColor = (trend, inverse = false) => {
  if (trend === "neutral" || trend === "stable") return "#6B7280"; // gray

  if (inverse) {
    return trend === "up" ? "#EF4444" : "#10B981"; // red for up, green for down
  }

  return trend === "up" ? "#10B981" : "#EF4444"; // green for up, red for down
};

/**
 * Calculate average
 */
export const calculateAverage = (data, key) => {
  if (!data || data.length === 0) return 0;
  const sum = data.reduce((acc, item) => acc + (item[key] || 0), 0);
  return sum / data.length;
};

/**
 * Find min and max values
 */
export const findMinMax = (data, key) => {
  if (!data || data.length === 0) return { min: 0, max: 0 };

  const values = data
    .map((item) => item[key])
    .filter((val) => val !== null && val !== undefined);

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

/**
 * Group data by period (day, week, month)
 */
export const groupByPeriod = (data, dateKey, period = "day") => {
  const grouped = {};

  data.forEach((item) => {
    const date = new Date(item[dateKey]);
    let key;

    switch (period) {
      case "day":
        key = date.toISOString().split("T")[0];
        break;
      case "week":
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        key = startOfWeek.toISOString().split("T")[0];
        break;
      case "month":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        break;
      default:
        key = date.toISOString();
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
};

/**
 * Sort data for charts
 */
export const sortChartData = (data, key, order = "asc") => {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (order === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

/**
 * Limit data points for better visualization
 */
export const limitDataPoints = (data, maxPoints = 30) => {
  if (data.length <= maxPoints) return data;

  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
};

/**
 * Custom tooltip formatter
 */
export const customTooltipFormatter = (value, name, props) => {
  if (typeof value === "number") {
    if (
      name.toLowerCase().includes("percent") ||
      name.toLowerCase().includes("%")
    ) {
      return [formatPercentage(value), name];
    }
    return [formatChartNumber(value, 2), name];
  }
  return [value, name];
};

/**
 * Export chart data to CSV
 */
export const exportChartToCSV = (data, filename = "chart-data.csv") => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => row[header]).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get grade color based on percentage
 */
export const getGradeColor = (percentage) => {
  if (percentage >= 80) return chartColors.results.excellent;
  if (percentage >= 60) return chartColors.results.good;
  if (percentage >= 40) return chartColors.results.average;
  return chartColors.results.poor;
};

/**
 * Get attendance color based on percentage
 */
export const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return chartColors.success[0];
  if (percentage >= 75) return chartColors.info[0];
  if (percentage >= 60) return chartColors.warning[0];
  return chartColors.danger[0];
};
