import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatChartNumber, getChartColors } from "../../utils/chartHelpers";

/**
 * PieChart Component
 * Wrapper around Recharts PieChart with custom styling
 *
 * Features:
 * - Responsive container
 * - Auto-generated colors
 * - Formatted tooltips
 * - Legend
 * - Custom labels
 * - Percentage display
 *
 * @param {Object} props
 * @param {Array} props.data - Chart data array [{name, value}]
 * @param {string} props.title - Chart title
 * @param {number|string} props.height - Chart height (default: 300)
 * @param {boolean} props.showLegend - Show legend (default: true)
 * @param {boolean} props.showTooltip - Show tooltip (default: true)
 * @param {boolean} props.showLabels - Show labels on slices (default: true)
 * @param {boolean} props.showPercentage - Show percentage (default: true)
 * @param {Array} props.colors - Custom color array
 * @param {string} props.colorPalette - Color palette name (default: 'primary')
 * @param {string} props.className - Additional CSS classes
 */
const PieChart = ({
  data = [],
  title,
  height = 300,
  showLegend = true,
  showTooltip = true,
  showLabels = true,
  showPercentage = true,
  colors,
  colorPalette = "primary",
  className = "",
}) => {
  // Get colors for chart
  const chartColorArray = colors || getChartColors(data.length, colorPalette);

  // Custom label renderer
  const renderLabel = (entry) => {
    if (!showLabels) return null;

    if (showPercentage) {
      return `${entry.name}: ${entry.percent.toFixed(0)}%`;
    }
    return entry.name;
  };

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">
          Value:{" "}
          <span className="font-semibold">{formatChartNumber(data.value)}</span>
        </p>
        {showPercentage && (
          <p className="text-sm text-gray-600">
            Percentage:{" "}
            <span className="font-semibold">
              {data.payload.percent.toFixed(1)}%
            </span>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels ? renderLabel : false}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
            animationDuration={500}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColorArray[index % chartColorArray.length]}
              />
            ))}
          </Pie>

          {showTooltip && <Tooltip content={<CustomTooltip />} />}

          {showLegend && (
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
