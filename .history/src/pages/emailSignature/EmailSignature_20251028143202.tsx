
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { SignatureEditor } from '../../component/';
import { SignatureCard } from '../../component/emailSignatures/SignatureCard';
import { DeleteConfirmationModal } from '../../component/emailSignatures/DeleteConfirmationModal';
import { EditSignatureModal } from '../../component/emailSignatures/EditSignatureModal';

// Mock hooks - replace with actual Redux hooks
const useAppDispatch = () => (action: any) => console.log(action);
const useAppSelector = (selector: any) => ({
  signatures: [
    {
      id: '1',
      name: 'Maria Signature',
      content: '<div><p><strong>Maria Jones</strong></p><p>Chief Business Officer</p><p>AIBridze Technologies Pvt. Ltd.</p></div>',
      createdAt: '2025-12-22T10:00:00Z',
      updatedAt: '2025-12-22T10:00:00Z'
    },
    {
      id: '2',
      name: 'John Signature',
      content: '<div><p><strong>John Doe</strong></p><p>Senior Marketing Manager</p></div>',
      createdAt: '2025-12-22T10:30:00Z',
      updatedAt: '2025-12-22T10:30:00Z'
    },
    {
      id: '3',
      name: 'Julia Signature',
      content: '<div><p><strong>Julia Smith</strong></p><p>Product Manager</p></div>',
      createdAt: '2025-12-22T11:00:00Z',
      updatedAt: '2025-12-22T11:00:00Z'
    }
  ],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  editingSignature: null,
  deleteConfirmation: { isOpen: false, signature: null }
});

export const EmailSignatures: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    signatures,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    editingSignature,
    deleteConfirmation
  } = useAppSelector((state: any) => state.signature);

  const [newSignatureName, setNewSignatureName] = useState('');
  const [newSignatureContent, setNewSignatureContent] = useState('');

  useEffect(() => {
    // dispatch(fetchSignatures());
  }, []);

  const handleCreateSignature = () => {
    if (newSignatureName.trim() && newSignatureContent.trim()) {
      // dispatch(createSignature({ name: newSignatureName, content: newSignatureContent }));
      setNewSignatureName('');
      setNewSignatureContent('');
    }
  };

  const handleEditSignature = (signature: any) => {
    // dispatch(setEditingSignature(signature));
  };

  const handleSaveEdit = (id: string, name: string, content: string) => {
    // dispatch(updateSignature({ id, formData: { name, content } }));
  };

  const handleCancelEdit = () => {
    // dispatch(setEditingSignature(null));
  };

  const handleDeleteClick = (signature: any) => {
    // dispatch(openDeleteConfirmation(signature));
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.signature) {
      // dispatch(deleteSignature(deleteConfirmation.signature.id));
    }
  };

  const handleCancelDelete = () => {
    // dispatch(closeDeleteConfirmation());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Email Signatures</h1>
          <p className="text-gray-600 mt-1">Create and manage your email signatures here</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Create Signature Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <SignatureEditor
            signatureName={newSignatureName}
            signatureContent={newSignatureContent}
            onNameChange={setNewSignatureName}
            onContentChange={setNewSignatureContent}
          />

          <button
            onClick={handleCreateSignature}
            disabled={isCreating || !newSignatureName.trim() || !newSignatureContent.trim()}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {isCreating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              'Create Signature'
            )}
          </button>
        </div>

        {/* Signatures List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Signatures</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : signatures.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No signatures yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {signatures.map((signature: any) => (
                <SignatureCard
                  key={signature.id}
                  signature={signature}
                  onEdit={handleEditSignature}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditSignatureModal
        signature={editingSignature}
        isOpen={!!editingSignature}
        isUpdating={isUpdating}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        signature={deleteConfirmation.signature}
        isOpen={deleteConfirmation.isOpen}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};