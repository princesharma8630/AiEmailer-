import React from 'react';
import { Mail, Link as LinkIcon, Clock } from 'lucide-react';

interface RecentActivityItem {
  id: string;
  email: string;
  action: 'opened' | 'clicked';
  link?: string;
  ip: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: RecentActivityItem[];
  width?: number;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  width = 1120,
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      style={{
        maxidth: `${width}px`,
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent activity to display
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors px-4 -mx-4 rounded-lg"
            >
              {/* Left Section - Icon and Details */}
              <div className="flex items-start gap-4 flex-1">
                {/* Icon */}
                <div
                  className={`${
                    activity.action === 'opened'
                      ? 'bg-blue-100'
                      : 'bg-orange-100'
                  } rounded-lg flex items-center justify-center flex-shrink-0`}
                  style={{
                    width: '40px',
                    height: '40px',
                  }}
                >
                  {activity.action === 'opened' ? (
                    <Mail className="text-blue-600" size={20} />
                  ) : (
                    <LinkIcon className="text-orange-600" size={20} />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">
                      {activity.email}
                    </span>
                    <span className="text-gray-600">
                      has {activity.action} your email
                    </span>
                    {activity.action === 'clicked' && activity.link && (
                      <a
                        href={activity.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                      >
                        <LinkIcon size={14} />
                        Visit Link
                      </a>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    IP: {activity.ip}
                  </div>
                </div>
              </div>

              {/* Right Section - Timestamp */}
              <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap ml-4">
                <Clock size={16} />
                {formatTimestamp(activity.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;