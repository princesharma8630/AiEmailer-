import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconBgColor?: string;
  width?: number;
  height?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  value,
  label,
  iconBgColor = 'bg-blue-100',
  width = 280,
  height = 100,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Icon Container */}
      <div
        className={`${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
        style={{
          width: '48px',
          height: '48px',
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600 whitespace-nowrap">{label}</div>
      </div>
    </div>
  );
};

export default StatsCard;