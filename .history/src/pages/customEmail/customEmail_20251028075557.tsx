
import React, { useEffect } from 'react';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { EmailFormSection } from '../../component/customEmail/EmailFormSection';
import { EmailBodyEditor } from '../../component/customEmail/EmailBodyEditor';
import { ProviderCopyButtons } from '../../component/customEmail/ProviderCopyButton';
import { EmailPreview } from '../../component/customEmail/EmailPreview';

// Mock hooks - replace with your actual Redux hooks
const useAppSelector = ((state: any) => any) => ({
  formData: { recipientEmail: '', emailBody: '', signatureId: null },
  signatures: [
    { id: '1', email: 'ashish@aibridze.com', name: 'Ashish Chauhan' },
    { id: '2', email: 'anand@aibridze.biz', name: 'Anand Prakash (aibridze.biz)' },
    { id: '3', email: 'anand@aibridze.us', name: 'Anand Prakash (aibridze.us)' }
  ],
  generatedContent: {
    trackedHtml: '',
    trackingId: '',
    originalLinksCount: 0
  },
  isGenerating: false,
  error: null,
  copiedProvider: null
});

export const CustomEmail: React.FC = () => {
  const { formData, signatures, generatedContent, isGenerating, error, copiedProvider } = useAppSelector((state: any) => state.customEmail);

  useEffect(() => {
    // dispatch(fetchSignatures());
  }, []);

  const handleRecipientChange = () => {
    // dispatch(updateFormData({ recipientEmail: email }));
  };

  const handleBodyChange = () => {
    // dispatch(updateFormData({ emailBody: body }));
  };

  const handleSignatureChange = () => {
    // dispatch(updateFormData({ signatureId: id }));
  };

  const handleGenerate = () => {
    // dispatch(generateTrackingContent());
  };

  const handleReset = () => {
    // dispatch(resetForm());
  };

  const handleCopy = (   content: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    try {
      const range = document.createRange();
      range.selectNode(tempDiv);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand('copy');
      selection?.removeAllRanges();
      
      // dispatch(setCopiedProvider(providerId));
      setTimeout(() => {
        // dispatch(setCopiedProvider(null));
      }, 2000);
    } catch (err) {
      navigator.clipboard.writeText(content);
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  const handleClearError = () => {
    // dispatch(clearError());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">Email Campaign</div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Email Campaign</h1>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Info className="text-blue-500 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-blue-900 font-medium">
                ✅ Works with: Gmail, Zoho Mail, Outlook, Yahoo Mail, Apple Mail, and most other email clients.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Choose your email provider below for optimized copy buttons. URLs will be automatically tracked.
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            📝 Convert your plain email content into trackable HTML
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            All URLs in your email will be automatically converted into tracked links. We'll also add an invisible tracking pixel to detect email opens.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <span className="text-red-500">⚠️</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <button 
                onClick={handleClearError}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form Sections */}
          <EmailFormSection
            recipientEmail={formData.recipientEmail}
            onRecipientChange={handleRecipientChange}
            signatureId={formData.signatureId}
            onSignatureChange={handleSignatureChange}
            signatures={signatures}
          />

          <EmailBodyEditor
            emailBody={formData.emailBody}
            onBodyChange={handleBodyChange}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition shadow-sm hover:shadow-md"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating Tracking Content...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  {generatedContent ? '🔄 Re-generate Tracking Content' : '🚀 Generate Tracking Content'}
                </>
              )}
            </button>

            {generatedContent && (
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Reset Form
              </button>
            )}
          </div>

          {/* Provider Copy Buttons */}
          {generatedContent && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Copy for Your Email Provider
              </h3>
              <ProviderCopyButtons
                trackedHtml={generatedContent.trackedHtml}
                copiedProvider={copiedProvider}
                onCopy={handleCopy}
              />
            </div>
          )}

          {/* Email Preview */}
          {generatedContent && (
            <EmailPreview
              html={generatedContent.trackedHtml}
              trackingId={generatedContent.trackingId}
              linksCount={generatedContent.originalLinksCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};
