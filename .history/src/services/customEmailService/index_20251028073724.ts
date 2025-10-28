
import { TrackingContent, EmailSignature } from '../../type/customEmail.type';
import { TrackingGenerator } from './trackingGenerator';
import { EmailValidator } from './emailValidator';
import { EMAIL_SIGNATURES_DATA } from '../../constants/emailSignatures.constants';

export class CustomEmailService {
  // Get all signatures
  static async fetchSignatures(): Promise<EmailSignature[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(EMAIL_SIGNATURES_DATA);
      }, 300);
    });
  }

  // Generate trackable email content
  static async generateTrackingContent(
    recipientEmail: string,
    emailBody: string,
    signatureId: string | null,
    signatures: EmailSignature[]
  ): Promise<TrackingContent> {
    return new Promise((resolve, reject) => {
      // Validate form
      const validation = EmailValidator.validateEmailForm(recipientEmail, emailBody);
      
      if (!validation.isValid) {
        reject(new Error(validation.errors.join(', ')));
        return;
      }

      setTimeout(() => {
        // Get signature content
        const signatureContent = signatureId
          ? signatures.find(s => s.id === signatureId)?.content || ''
          : '';

        // Generate tracked HTML
        const { trackingId, html, linksCount } = TrackingGenerator.generateTrackedHtml(
          emailBody,
          recipientEmail,
          signatureContent
        );

        const trackingContent: TrackingContent = {
          trackingId,
          trackedHtml: html,
          originalLinksCount: linksCount,
          generatedAt: new Date().toISOString()
        };

        resolve(trackingContent);
      }, 1000);
    });
  }

  // Save tracking info to backend (mock)
  static async saveTrackingInfo(
    trackingId: string,
    recipientEmail: string,
    senderEmail: string
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Tracking info saved:', {
          trackingId,
          recipientEmail,
          senderEmail,
          timestamp: new Date().toISOString()
        });
        resolve();
      }, 200);
    });
  }
}

export { EmailValidator, TrackingGenerator };


// ==========================================
// FILE: src/redux/slices/customEmailSlice/customEmailSlice.ts
// ==========================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CustomEmailState, TrackingContent, EmailSignature, CustomEmailFormData } from '../../../type/customEmail.type';
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