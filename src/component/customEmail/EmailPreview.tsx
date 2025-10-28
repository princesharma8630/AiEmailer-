
import React from 'react';

interface EmailPreviewProps {
  html: string;
  trackingId: string;
  linksCount: number;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  html,
  trackingId,
  linksCount
}) => {
  return (
    <div className="mt-8">
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          👀 Email Preview
        </h3>
        
        <div className="bg-white rounded-lg p-6 border border-gray-300 mb-4">
          <div 
            dangerouslySetInnerHTML={{ __html: html }}
            className="prose max-w-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {trackingId.substring(0, 8)}...
            </div>
            <div className="text-sm text-gray-600 mt-1">Tracking ID</div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{linksCount}</div>
            <div className="text-sm text-gray-600 mt-1">Trackable Links</div>
          </div>
        </div>
      </div>
    </div>
  );
};
