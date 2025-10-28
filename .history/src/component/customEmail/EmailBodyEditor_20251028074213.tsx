
import React from 'react';

interface EmailBodyEditorProps {
  emailBody: string;
  onBodyChange: (body: string) => void;
}

export const EmailBodyEditor: React.FC<EmailBodyEditorProps> = ({
  emailBody,
  onBodyChange
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Body (Plain Text or HTML)
      </label>
      <textarea
        placeholder="Paste your email content here...

Example:
Hi John,

I hope you're doing well. Check out our latest project at https://aibridze.com/portfolio/.

Best regards!"
        value={emailBody}
        onChange={(e) => onBodyChange(e.target.value)}
        rows={12}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical transition font-mono text-sm"
      />
      <p className="mt-2 text-xs text-gray-500">
        💡 Tip: URLs will be automatically converted to trackable links
      </p>
    </div>
  );
};