// component/scheduleEmails/ScheduledCampaignCard.tsx


import { Calendar, Users, Mail, Trash2, Clock } from 'lucide-react';
import { ScheduledCampaign } from '..';

interface ScheduledCampaignCardProps {
  campaign: ScheduledCampaign;
  onCancel: (campaignId: string) => void;
  isCancelling?: boolean;
}

export default function ScheduledCampaignCard({
  campaign,
  onCancel,
  isCancelling = false,
}: ScheduledCampaignCardProps) {
  const scheduledDate = new Date(campaign.scheduledAt);
  const now = new Date();
  const isUpcoming = scheduledDate > now;
  
  // Time until execution
  const timeUntil = scheduledDate.getTime() - now.getTime();
  const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
  const daysUntil = Math.floor(hoursUntil / 24);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">{campaign.subject}</h3>
          <p className="text-sm text-gray-500 mt-1">{campaign.name}</p>
        </div>
        {isUpcoming && (
          <button
            onClick={() => onCancel(campaign.id)}
            disabled={isCancelling}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
            title="Cancel schedule"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded p-3">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Users size={16} />
            <span className="text-xs">Recipients</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {campaign.totalRecipients}
          </p>
        </div>

        <div className="bg-gray-50 rounded p-3">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Calendar size={16} />
            <span className="text-xs">Scheduled</span>
          </div>
          <p className="text-sm font-semibold text-gray-800">
            {scheduledDate.toLocaleDateString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded p-3">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Clock size={16} />
            <span className="text-xs">Time</span>
          </div>
          <p className="text-sm font-semibold text-gray-800">
            {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {isUpcoming ? (
            <>
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-sm text-gray-600">
                {daysUntil > 0
                  ? `Sending in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`
                  : hoursUntil > 0
                  ? `Sending in ${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}`
                  : 'Sending soon'}
              </span>
            </>
          ) : (
            <>
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-600">Sent</span>
            </>
          )}
        </div>
        
        {campaign.timezone && (
          <span className="text-xs text-gray-500">{campaign.timezone}</span>
        )}
      </div>

      {/* Recurring Badge */}
      {campaign.isRecurring && (
        <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
          <Clock size={12} />
          Recurring
        </div>
      )}
    </div>
  );
}