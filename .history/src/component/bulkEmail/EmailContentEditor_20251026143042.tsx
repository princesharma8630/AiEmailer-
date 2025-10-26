// component/bulkEmail/EmailContentEditor.tsx

import React from 'react';
import { Mail, Info } from 'lucide-react';

interface EmailContentEditorProps {
  subject: string;
  content: string;
  onSubjectChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export default function EmailContentEditor({
  subject,
  content,
  onSubjectChange,
  onContentChange,
}: EmailContentEditorProps) {
  return (
    <div className="space-y-4">
      {/* Subject Line */}
      <div>
        <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 mb-2">
          Email Subject <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="text-gray-400" size={20} />
          </div>
          <input
            id="email-subject"
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="Enter email subject line"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Email Body */}
      <div>
        <label htmlFor="email-content" className="block text-sm font-medium text-gray-700 mb-2">
          Email Body <span className="text-red-500">*</span>
        </label>
        <textarea
          id="email-content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write your email content here...

You can use personalization:
- {{name}} - Recipient's name
- {{email}} - Recipient's email
- {{company}} - Recipient's company

Example:
Hi {{name}},

I hope this email finds you well. I wanted to reach out regarding...

Best regards"
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-vertical font-mono text-sm"
        />
      </div>

      {/* Helper Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="text-blue-500 flex-shrink-0" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Tips for better emails:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Use personalization tags to make emails more engaging</li>
              <li>Include clear call-to-action links</li>
              <li>All links will be automatically tracked for analytics</li>
              <li>Keep subject line under 50 characters for better open rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}