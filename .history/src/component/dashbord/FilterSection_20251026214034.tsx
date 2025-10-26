import React from 'react';
import { Search, Calendar } from 'lucide-react';

interface FilterSectionProps {
  searchValue: string;
  fromDate: string;
  toDate: string;
  onSearchChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  width?: number;
  height?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchValue,
  fromDate,
  toDate,
  onSearchChange,
  onFromDateChange,
  onToDateChange,
  width = 1029,
  height = 37,
}) => {
  return (
    <div
      className="bg-white flex items-center justify-between"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Search Input */}
      <div className="relative flex-shrink-0" style={{ width: '304px', height: '37px' }}>
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by email address"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-full pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Date Filters */}
      <div className="flex items-center flex-shrink-0" style={{ gap: '16px' }}>
        {/* From Date */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            From date
          </label>
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              placeholder="dd/mm/yyyy"
              className="h-[37px] px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              style={{ width: '160px' }}
            />
            <Calendar
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        {/* To Date */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            To date
          </label>
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              placeholder="dd/mm/yyyy"
              className="h-[37px] px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              style={{ width: '160px' }}
            />
            <Calendar
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;