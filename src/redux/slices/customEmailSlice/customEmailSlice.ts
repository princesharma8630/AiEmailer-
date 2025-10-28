
import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import type { CustomEmailState,  CustomEmailFormData } from '../../../type/customEmail.type';
import { CustomEmailService } from '../../../services/customEmailService';

const initialState: CustomEmailState = {
  formData: {
    recipientEmail: '',
    emailBody: '',
    signatureId: null
  },
  signatures: [],
  generatedContent: null,
  isGenerating: false,
  error: null,
  copiedProvider: null
};

// Async thunks
export const fetchSignatures = createAsyncThunk(
  'customEmail/fetchSignatures',
  async () => {
    const signatures = await CustomEmailService.fetchSignatures();
    return signatures;
  }
);

export const generateTrackingContent = createAsyncThunk(
  'customEmail/generateTrackingContent',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { customEmail: CustomEmailState };
      const { recipientEmail, emailBody, signatureId } = state.customEmail.formData;
      const { signatures } = state.customEmail;

      const content = await CustomEmailService.generateTrackingContent(
        recipientEmail,
        emailBody,
        signatureId,
        signatures
      );

      // Get sender email from signature
      const signature = signatures.find(s => s.id === signatureId);
      const senderEmail = signature?.email || 'unknown@aibridze.com';

      // Save tracking info to backend
      await CustomEmailService.saveTrackingInfo(
        content.trackingId,
        recipientEmail,
        senderEmail
      );

      return content;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const customEmailSlice = createSlice({
  name: 'customEmail',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Partial<CustomEmailFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.generatedContent = null;
      state.error = null;
    },
    setCopiedProvider: (state, action: PayloadAction<string | null>) => {
      state.copiedProvider = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch signatures
      .addCase(fetchSignatures.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSignatures.fulfilled, (state, action) => {
        state.signatures = action.payload;
      })
      .addCase(fetchSignatures.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch signatures';
      })
      // Generate tracking content
      .addCase(generateTrackingContent.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateTrackingContent.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.generatedContent = action.payload;
      })
      .addCase(generateTrackingContent.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      });
  }
});

export const { updateFormData, resetForm, setCopiedProvider, clearError } = customEmailSlice.actions;
export default customEmailSlice.reducer;