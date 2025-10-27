// component/scheduleEmails/DateTimePicker.tsx

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  minDate?: string;
}

export default function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  minDate,
}: DateTimePickerProps) {
  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const minDateValue = minDate || today;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Schedule Date & Time</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Date Picker */}
        <div>
          <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="text-gray-400" size={20} />
            </div>
            <input
              id="schedule-date"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              min={minDateValue}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Time Picker */}
        <div>
          <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-700 mb-2">
            Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="text-gray-400" size={20} />
            </div>
            <input
              id="schedule-time"
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      {date && time && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Scheduled for:</span>{' '}
            {new Date(`${date}T${time}`).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      )}
    </div>
  );
}