import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StatusData {
  opened: number;
  clicked: number;
  notOpened: number;
  total: number;
}

interface StatusOverviewProps {
  data: StatusData;
  width?: number;
  height?: number;
}

const StatusOverview: React.FC<StatusOverviewProps> = ({
  data,
  width = 500,
  height = 400,
}) => {
  const { opened, clicked, notOpened, total } = data;

  // Prepare chart data
  const chartData = [
    { name: 'Opened', value: opened, color: '#14B8A6' }, // Teal
    { name: 'Clicked', value: clicked, color: '#3B82F6' }, // Blue
    { name: 'Not Opened', value: notOpened, color: '#FCD34D' }, // Yellow
  ];

  // Legend data
  const legendData = [
    { label: 'Opened', value: opened, color: '#14B8A6' },
    { label: 'Clicked', value: clicked, color: '#3B82F6' },
    { label: 'Not Opened', value: notOpened, color: '#FCD34D' },
  ];

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
        <h2 className="text-xl font-bold text-gray-900">Status Overview</h2>
        <p className="text-sm text-gray-600 mt-1">
          View the current status of your email campaigns.
        </p>
      </div>

      {/* Chart and Legend Container */}
      <div className="flex items-center justify-between gap-8">
        {/* Donut Chart */}
        <div className="relative" style={{ width: '250px', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Total */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-xs text-gray-500 mb-1">Total</div>
            <div className="text-4xl font-bold text-gray-900">{total}</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1">
          {/* Table Header */}
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-700">Label</div>
            <div className="text-sm font-semibold text-gray-700">Value</div>
          </div>

          {/* Legend Items */}
          <div className="space-y-4">
            {legendData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-base text-gray-700">{item.label}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusOverview;