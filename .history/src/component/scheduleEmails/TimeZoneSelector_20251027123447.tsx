// component/scheduleEmails/TimeZoneSelector.tsx

import { Globe } from 'lucide-react';

interface TimeZoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
}

// Popular timezones
const POPULAR_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney',
];

export default function TimeZoneSelector({ value, onChange }: TimeZoneSelectorProps) {
  // Get all available timezones
  const allTimezones = Intl.supportedValuesOf('timeZone');

  return (
    <div>
      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
        <div className="flex items-center gap-2">
          <Globe size={16} />
          <span>Timezone</span>
        </div>
      </label>
      <select
        id="timezone"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <optgroup label="Popular Timezones">
          {POPULAR_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')} ({new Date().toLocaleTimeString('en-US', { timeZone: tz, timeStyle: 'short' })})
            </option>
          ))}
        </optgroup>
        <optgroup label="All Timezones">
          {allTimezones
            .filter((tz) => !POPULAR_TIMEZONES.includes(tz))
            .map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, ' ')}
              </option>
            ))}
        </optgroup>
      </select>
      
      <p className="text-xs text-gray-500 mt-2">
        Current time in selected timezone:{' '}
        <span className="font-medium">
          {new Date().toLocaleString('en-US', { timeZone: value })}
        </span>
      </p>
    </div>
  );
}