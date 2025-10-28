
import React from 'react';
import { X } from 'lucide-react';
import { Signature } from '../../type/signature.type';

interface DeleteConfirmationModalProps {
  signature: Signature | null;
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  signature,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !signature) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Delete Signature</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isDeleting}
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete <strong>{signature.name}</strong> from the list?
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="animate-spin">⏳</span>
                Removing...
              </>
            ) : (
              'Remove'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
