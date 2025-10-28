
import { createSlice, createAsyncThunk,tyow PayloadAction } from '@reduxjs/toolkit';
import type{ SignatureState, Signature, SignatureFormData } from '../../../type/signature.type';
import { SignatureService } from '../../../services/signatureService';

const initialState: SignatureState = {
  signatures: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  editingSignature: null,
  deleteConfirmation: {
    isOpen: false,
    signature: null
  }
};

// Async thunks
export const fetchSignatures = createAsyncThunk(
  'signature/fetchSignatures',
  async () => {
    const signatures = await SignatureService.fetchSignatures();
    return signatures;
  }
);

export const createSignature = createAsyncThunk(
  'signature/createSignature',
  async (formData: SignatureFormData, { rejectWithValue }) => {
    try {
      const signature = await SignatureService.createSignature(formData);
      return signature;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSignature = createAsyncThunk(
  'signature/updateSignature',
  async ({ id, formData }: { id: string; formData: SignatureFormData }, { rejectWithValue }) => {
    try {
      const signature = await SignatureService.updateSignature(id, formData);
      return signature;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSignature = createAsyncThunk(
  'signature/deleteSignature',
  async (id: string, { rejectWithValue }) => {
    try {
      await SignatureService.deleteSignature(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const signatureSlice = createSlice({
  name: 'signature',
  initialState,
  reducers: {
    setEditingSignature: (state, action: PayloadAction<Signature | null>) => {
      state.editingSignature = action.payload;
    },
    openDeleteConfirmation: (state, action: PayloadAction<Signature>) => {
      state.deleteConfirmation = {
        isOpen: true,
        signature: action.payload
      };
    },
    closeDeleteConfirmation: (state) => {
      state.deleteConfirmation = {
        isOpen: false,
        signature: null
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch signatures
      .addCase(fetchSignatures.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSignatures.fulfilled, (state, action) => {
        state.isLoading = false;
        state.signatures = action.payload;
      })
      .addCase(fetchSignatures.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch signatures';
      })
      // Create signature
      .addCase(createSignature.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createSignature.fulfilled, (state, action) => {
        state.isCreating = false;
        state.signatures.push(action.payload);
      })
      .addCase(createSignature.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      // Update signature
      .addCase(updateSignature.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSignature.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.signatures.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.signatures[index] = action.payload;
        }
        state.editingSignature = null;
      })
      .addCase(updateSignature.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Delete signature
      .addCase(deleteSignature.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteSignature.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.signatures = state.signatures.filter(s => s.id !== action.payload);
        state.deleteConfirmation = { isOpen: false, signature: null };
      })
      .addCase(deleteSignature.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setEditingSignature,
  openDeleteConfirmation,
  closeDeleteConfirmation,
  clearError
} = signatureSlice.actions;

export default signatureSlice.reducer;