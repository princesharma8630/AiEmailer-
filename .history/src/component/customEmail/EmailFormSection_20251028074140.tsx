
import React from 'react';

interface EmailFormSectionProps {
  recipientEmail: string;
  onRecipientChange: (email: string) => void;
  signatureId: string | null;
  onSignatureChange: (id: string | null) => void;
  signatures: Array<{ id: string; name: string }>;
}

export const EmailFormSection: React.FC<EmailFormSectionProps> = ({
  recipientEmail,
  onRecipientChange,
  signatureId,
  onSignatureChange,
  signatures
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipient Email Address
        </label>
        <input
          type="email"
          placeholder="recipient@example.com"
          value={recipientEmail}
          onChange={(e) => onRecipientChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Signature (optional)
        </label>
        <select
          value={signatureId || ''}
          onChange={(e) => onSignatureChange(e.target.value || null)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
        >
          <option value="">No Signature</option>
          {signatures.map(sig => (
            <option key={sig.id} value={sig.id}>{sig.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};