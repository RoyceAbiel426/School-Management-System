import {
  Area,
  CartesianGrid,
  Legend,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  chartColors,
  customTooltipFormatter,
  formatChartNumber,
} from "../../utils/chartHelpers";

/**
 * AreaChart Component
 * Wrapper around Recharts AreaChart with custom styling
 *
 * Features:
 * - Responsive container
 * - Gradient fills
 * - Custom colors
 * - Formatted tooltips
 * - Grid lines
 * - Legend
 * - Multiple areas support
 * - Stacked option
 *
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {Array} props.areas - Array of area configurations [{dataKey, name, color}]
 * @param {string} props.xAxisKey - Key for X-axis data
 * @param {string} props.title - Chart title
 * @param {number|string} props.height - Chart height (default: 300)
 * @param {boolean} props.showGrid - Show grid lines (default: true)
 * @param {boolean} props.showLegend - Show legend (default: true)
 * @param {boolean} props.showTooltip - Show tooltip (default: true)
 * @param {boolean} props.stacked - Stack areas (default: false)
 * @param {boolean} props.gradient - Use gradient fill (default: true)
 * @param {number} props.fillOpacity - Fill opacity (default: 0.6)
 * @param {Function} props.xAxisFormatter - X-axis label formatter
 * @param {Function} props.yAxisFormatter - Y-axis label formatter
 * @param {string} props.className - Additional CSS classes
 */
const AreaChart = ({
  data = [],
  areas = [],
  xAxisKey = "name",
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  stacked = false,
  gradient = true,
  fillOpacity = 0.6,
  xAxisFormatter,
  yAxisFormatter = formatChartNumber,
  className = "",
}) => {
  // Default area configuration
  const defaultAreas =
    areas.length > 0
      ? areas
      : [{ dataKey: "value", name: "Value", color: chartColors.primary[0] }];

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            {gradient &&
              defaultAreas.map((area, index) => {
                const color =
                  area.color ||
                  chartColors.primary[index % chartColors.primary.length];
                return (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`gradient-${area.dataKey}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                  </linearGradient>
                );
              })}
          </defs>

          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}

          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickLine={{ stroke: "#E5E7EB" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickFormatter={xAxisFormatter}
          />

          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickLine={{ stroke: "#E5E7EB" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickFormatter={yAxisFormatter}
          />

          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #E5E7EB",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={customTooltipFormatter}
            />
          )}

          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
          )}

          {defaultAreas.map((area, index) => {
            const color =
              area.color ||
              chartColors.primary[index % chartColors.primary.length];
            return (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                name={area.name || area.dataKey}
                stroke={color}
                fill={gradient ? `url(#gradient-${area.dataKey})` : color}
                fillOpacity={gradient ? 1 : fillOpacity}
                strokeWidth={2}
                stackId={stacked ? "stack" : undefined}
                animationDuration={500}
              />
            );
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
