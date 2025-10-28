
import React from 'react';
import { Copy, Check } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  icon: string;
  description: string[];
  color: string;
}

interface ProviderCopyButtonsProps {
  trackedHtml: string;
  copiedProvider: string | null;
  onCopy: (providerId: string, content: string) => void;
}

const providers: Provider[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    description: ['Best rich text support', 'Full HTML rendering', 'Perfect tracking'],
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    id: 'zoho',
    name: 'Zoho Mail',
    icon: '📫',
    description: ['Excellent HTML support', 'Rich text formatting', 'Full tracking'],
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: '📨',
    description: ['Good HTML compatibility', 'Desktop & web', 'Reliable tracking'],
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    id: 'rawHtml',
    name: 'Raw HTML',
    icon: '🔧',
    description: ['For advanced users', 'Custom email clients', 'API integrations'],
    color: 'bg-gray-700 hover:bg-gray-800'
  }
];

export const ProviderCopyButtons: React.FC<ProviderCopyButtonsProps> = ({
  trackedHtml,
  copiedProvider,
  onCopy
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {providers.map((provider) => {
        const isCopied = copiedProvider === provider.id;
        
        return (
          <div
            key={provider.id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
              <span className="text-2xl">{provider.icon}</span>
              {provider.name}
            </h4>
            
            <ul className="text-xs text-gray-600 mb-4 space-y-1">
              {provider.description.map((desc, idx) => (
                <li key={idx}>• {desc}</li>
              ))}
            </ul>
            
            <button
              onClick={() => onCopy(provider.id, trackedHtml)}
              className={`w-full ${provider.color} text-white py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2`}
            >
              {isCopied ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

