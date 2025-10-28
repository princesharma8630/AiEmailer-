
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type Signature } from '../../type/signature.type';
import { SignatureEditor } from './signtureEditor';

interface EditSignatureModalProps {
  signature: Signature | null;
  isOpen: boolean;
  isUpdating: boolean;
  onSave: (id: string, name: string, content: string) => void;
  onCancel: () => void;
}

export const EditSignatureModal: React.FC<EditSignatureModalProps> = ({
  signature,
  isOpen,
  isUpdating,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (signature) {
      setName(signature.name);
      setContent(signature.content);
    }
  }, [signature]);

  if (!isOpen || !signature) return null;

  const handleSave = () => {
    if (name.trim() && content.trim()) {
      onSave(signature.id, name, content);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Edit Signature</h3>
            <p className="text-sm text-gray-600 mt-1">Edit your email signature here</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isUpdating}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <SignatureEditor
            signatureName={name}
            signatureContent={content}
            onNameChange={setName}
            onContentChange={setContent}
          />
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating || !name.trim() || !content.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <span className="animate-spin">⏳</span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};