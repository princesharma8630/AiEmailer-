
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchSignatures,
  createSignature,
  updateSignature,
  deleteSignature,
  setEditingSignature,
  openDeleteConfirmation,
  closeDeleteConfirmation,
  clearError
} from '../../';
import { SignatureEditor } from '../../component/emailSignatures/SignatureEditor';
import { SignatureCard } from '../../component/emailSignatures/SignatureCard';
import { DeleteConfirmationModal } from '../../component/emailSignatures/DeleteConfirmationModal';
import { EditSignatureModal } from '../../component/emailSignatures/EditSignatureModal';

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
  } = useAppSelector((state) => state.signature);

  const [newSignatureName, setNewSignatureName] = useState('');
  const [newSignatureContent, setNewSignatureContent] = useState('');

  // Fetch signatures on mount
  useEffect(() => {
    dispatch(fetchSignatures());
  }, [dispatch]);

  // Handle create signature
  const handleCreateSignature = async () => {
    if (newSignatureName.trim() && newSignatureContent.trim()) {
      const result = await dispatch(createSignature({ 
        name: newSignatureName, 
        content: newSignatureContent 
      }));
      
      // Clear form on success
      if (createSignature.fulfilled.match(result)) {
        setNewSignatureName('');
        setNewSignatureContent('');
      }
    }
  };

  // Handle edit signature
  const handleEditSignature = (signature: any) => {
    dispatch(setEditingSignature(signature));
  };

  // Handle save edit
  const handleSaveEdit = (id: string, name: string, content: string) => {
    dispatch(updateSignature({ id, formData: { name, content } }));
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    dispatch(setEditingSignature(null));
  };

  // Handle delete click
  const handleDeleteClick = (signature: any) => {
    dispatch(openDeleteConfirmation(signature));
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (deleteConfirmation.signature) {
      dispatch(deleteSignature(deleteConfirmation.signature.id));
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    dispatch(closeDeleteConfirmation());
  };

  // Handle clear error
  const handleClearError = () => {
    dispatch(clearError());
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
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition shadow-sm hover:shadow-md"
          >
            {isCreating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating Signature...
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
              <div className="text-gray-400 text-5xl mb-4">✍️</div>
              <p className="text-gray-500 font-medium">No signatures yet</p>
              <p className="text-sm text-gray-400 mt-1">Create your first signature above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {signatures.map((signature) => (
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
