
export interface Signature {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignatureFormData {
  name: string;
  content: string;
}

export interface SignatureState {
  signatures: Signature[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  editingSignature: Signature | null;
  deleteConfirmation: {
    isOpen: boolean;
    signature: Signature | null;
  };
}
