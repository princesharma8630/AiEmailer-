// component/bulkEmail/CampaignSummary.tsx


import { Mail, Users, FileText, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import type { Recipient } from '../../type/bulkEmail.type';
import { EmailTracker } from '../../services/bulkEmailServices/emailTracker';

interface CampaignSummaryProps {
  subject: string;
  content: string;
  recipients: Recipient[];
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CampaignSummary({
  subject,
  content,
  recipients,
  onConfirm,
  onCancel,
  isLoading = false,
}: CampaignSummaryProps) {
  const linkCount = EmailTracker.extractLinksFromContent(content).length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Campaign Summary</h2>
        <p className="text-blue-100 text-sm mt-1">Review your campaign before sending</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{recipients.length}</p>
                <p className="text-sm text-gray-600">Recipients</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded">
                <LinkIcon className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{linkCount}</p>
                <p className="text-sm text-gray-600">Tracked Links</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded">
                <FileText className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{content.length}</p>
                <p className="text-sm text-gray-600">Characters</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Line
            </label>
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <p className="text-gray-800">{subject}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Preview
            </label>
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
              <p className="text-gray-800 whitespace-pre-wrap text-sm">{content}</p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Emails will be sent immediately after confirmation</li>
                <li>All links will be tracked for open and click analytics</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Starting Campaign...
              </>
            ) : (
              <>
                <Mail size={20} />
                Start Campaign Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}