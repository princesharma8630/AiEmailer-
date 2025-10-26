import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ActivityDataPoint {
  day: string;
  opened: number;
  clicked: number;
}

interface ActivityChartProps {
  data: ActivityDataPoint[];
  width?: number;
  height?: number;
}

const ActivityChart: React.FC<ActivityChartProps> = ({
  data,
  width = 567,
  height = 450,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      style={{
        width: `${width}px`,
        minHeight: `${height}px`,
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Activity Over Time</h2>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="day"
            tick={{ fill: '#6B7280', fontSize: 14 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 14 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            domain={[0, 120]}
            ticks={[0, 20, 40, 60, 80, 100, 120]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#111827', fontWeight: 600 }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={10}
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
              color: '#6B7280',
            }}
          />
          <Line
            type="monotone"
            dataKey="opened"
            name="Opened"
            stroke="#14B8A6"
            strokeWidth={2}
            dot={{ fill: '#14B8A6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="clicked"
            name="Clicked"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;