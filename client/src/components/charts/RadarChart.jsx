import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { chartColors, customTooltipFormatter } from "../../utils/chartHelpers";

/**
 * RadarChart Component
 * Wrapper around Recharts RadarChart for multi-dimensional data
 *
 * Features:
 * - Responsive container
 * - Custom colors
 * - Formatted tooltips
 * - Legend
 * - Multiple radars support
 * - Perfect for comparing performance across multiple dimensions
 *
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {Array} props.radars - Array of radar configurations [{dataKey, name, color}]
 * @param {string} props.angleKey - Key for angle axis (categories)
 * @param {string} props.title - Chart title
 * @param {number|string} props.height - Chart height (default: 400)
 * @param {boolean} props.showLegend - Show legend (default: true)
 * @param {boolean} props.showTooltip - Show tooltip (default: true)
 * @param {boolean} props.fillOpacity - Fill opacity (default: 0.3)
 * @param {string} props.className - Additional CSS classes
 */
const RadarChart = ({
  data = [],
  radars = [],
  angleKey = "subject",
  title,
  height = 400,
  showLegend = true,
  showTooltip = true,
  fillOpacity = 0.3,
  className = "",
}) => {
  // Default radar configuration
  const defaultRadars =
    radars.length > 0
      ? radars
      : [{ dataKey: "value", name: "Value", color: chartColors.primary[0] }];

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid stroke="#E5E7EB" />

          <PolarAngleAxis
            dataKey={angleKey}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />

          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#6B7280", fontSize: 10 }}
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

          {showLegend && <Legend verticalAlign="bottom" height={36} />}

          {defaultRadars.map((radar, index) => (
            <Radar
              key={radar.dataKey}
              name={radar.name || radar.dataKey}
              dataKey={radar.dataKey}
              stroke={
                radar.color ||
                chartColors.primary[index % chartColors.primary.length]
              }
              fill={
                radar.color ||
                chartColors.primary[index % chartColors.primary.length]
              }
              fillOpacity={fillOpacity}
              strokeWidth={2}
              animationDuration={500}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
