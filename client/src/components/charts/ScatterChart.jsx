import {
  CartesianGrid,
  Legend,
  ScatterChart as RechartsScatterChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { chartColors, formatChartNumber } from "../../utils/chartHelpers";

/**
 * ScatterChart Component
 * Wrapper around Recharts ScatterChart for correlation data
 *
 * Features:
 * - Responsive container
 * - Custom colors
 * - Formatted tooltips
 * - Grid lines
 * - Legend
 * - Multiple scatter series
 * - Size variation (z-axis)
 *
 * @param {Object} props
 * @param {Array} props.scatters - Array of scatter configurations [{data, name, color}]
 * @param {string} props.xAxisLabel - X-axis label
 * @param {string} props.yAxisLabel - Y-axis label
 * @param {string} props.title - Chart title
 * @param {number|string} props.height - Chart height (default: 400)
 * @param {boolean} props.showGrid - Show grid lines (default: true)
 * @param {boolean} props.showLegend - Show legend (default: true)
 * @param {boolean} props.showTooltip - Show tooltip (default: true)
 * @param {Function} props.xAxisFormatter - X-axis label formatter
 * @param {Function} props.yAxisFormatter - Y-axis label formatter
 * @param {string} props.className - Additional CSS classes
 */
const ScatterChart = ({
  scatters = [],
  xAxisLabel,
  yAxisLabel,
  title,
  height = 400,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  xAxisFormatter = formatChartNumber,
  yAxisFormatter = formatChartNumber,
  className = "",
}) => {
  // Default scatter configuration
  const defaultScatters =
    scatters.length > 0
      ? scatters
      : [{ data: [], name: "Data", color: chartColors.primary[0] }];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          X: <span className="font-semibold">{xAxisFormatter(data.x)}</span>
        </p>
        <p className="text-sm text-gray-600">
          Y: <span className="font-semibold">{yAxisFormatter(data.y)}</span>
        </p>
        {data.z && (
          <p className="text-sm text-gray-600">
            Size: <span className="font-semibold">{data.z}</span>
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
        <RechartsScatterChart
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}

          <XAxis
            type="number"
            dataKey="x"
            name={xAxisLabel || "X"}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickLine={{ stroke: "#E5E7EB" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickFormatter={xAxisFormatter}
            label={{
              value: xAxisLabel,
              position: "insideBottom",
              offset: -10,
              style: { fill: "#6B7280", fontSize: 12 },
            }}
          />

          <YAxis
            type="number"
            dataKey="y"
            name={yAxisLabel || "Y"}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickLine={{ stroke: "#E5E7EB" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickFormatter={yAxisFormatter}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              style: { fill: "#6B7280", fontSize: 12 },
            }}
          />

          <ZAxis type="number" dataKey="z" range={[60, 400]} />

          {showTooltip && <Tooltip content={<CustomTooltip />} />}

          {showLegend && <Legend verticalAlign="top" height={36} />}

          {defaultScatters.map((scatter, index) => (
            <Scatter
              key={scatter.name}
              name={scatter.name}
              data={scatter.data}
              fill={
                scatter.color ||
                chartColors.primary[index % chartColors.primary.length]
              }
              animationDuration={500}
            />
          ))}
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterChart;
