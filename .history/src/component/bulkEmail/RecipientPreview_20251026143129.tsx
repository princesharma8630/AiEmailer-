// component/bulkEmail/RecipientPreview.tsx

import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { Recipient } from '../../';

interface RecipientPreviewProps {
  recipients: Recipient[];
  onDownloadSample?: () => void;
}

export default function RecipientPreview({
  recipients,
  onDownloadSample,
}: RecipientPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayCount = isExpanded ? recipients.length : Math.min(5, recipients.length);

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-gray-600" size={20} />
          <h3 className="font-semibold text-gray-800">
            Recipients ({recipients.length})
          </h3>
        </div>
        {onDownloadSample && (
          <button
            onClick={onDownloadSample}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Download size={16} />
            Download Sample CSV
          </button>
        )}
      </div>

      {/* Recipients List */}
      <div className="divide-y divide-gray-200">
        {recipients.slice(0, displayCount).map((recipient, index) => (
          <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{recipient.email}</p>
                <div className="flex gap-4 mt-1">
                  {recipient.name && (
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Name:</span> {recipient.name}
                    </span>
                  )}
                  {recipient.company && (
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Company:</span> {recipient.company}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {recipients.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Show All ({recipients.length - 5} more)
            </>
          )}
        </button>
      )}
    </div>
  );
}