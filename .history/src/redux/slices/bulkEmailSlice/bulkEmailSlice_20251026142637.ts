// redux/slices/bulkEmailSlice/bulkEmailSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { bulkEmailService } from '../../../services/bulkEmailService/index';
import type {
  Campaign,
  Recipient,
  UploadedFile,
  CSVValidationResult,
  CampaignStats,
} from '../../../type/bulkEmail.type';

interface BulkEmailState {
  // File upload
  uploadedFile: UploadedFile | null;
  csvValidation: CSVValidationResult | null;
  isValidatingCSV: boolean;
  
  // Campaign creation
  currentCampaign: Partial<Campaign> | null;
  campaignName: string;
  campaignSubject: string;
  campaignContent: string;
  recipients: Recipient[];
  
  // UI states
  isUploading: boolean;
  isCreating: boolean;
  isStarting: boolean;
  
  // Campaign tracking
  activeCampaignId: string | null;
  campaignStats: CampaignStats | null;
  
  // Error handling
  error: string | null;
  successMessage: string | null;
  
  // All campaigns
  allCampaigns: Campaign[];
  isLoadingCampaigns: boolean;
}

const initialState: BulkEmailState = {
  uploadedFile: null,
  csvValidation: null,
  isValidatingCSV: false,
  currentCampaign: null,
  campaignName: '',
  campaignSubject: '',
  campaignContent: '',
  recipients: [],
  isUploading: false,
  isCreating: false,
  isStarting: false,
  activeCampaignId: null,
  campaignStats: null,
  error: null,
  successMessage: null,
  allCampaigns: [],
  isLoadingCampaigns: false,
};

// Async Thunks

export const validateCSVFile = createAsyncThunk(
  'bulkEmail/validateCSV',
  async (file: File, { rejectWithValue }) => {
    try {
      const validation = await bulkEmailService.parseCSVFile(file);
      return {
        file: {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        },
        validation,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadCSVFile = createAsyncThunk(
  'bulkEmail/uploadCSV',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await bulkEmailService.uploadCSV(file);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCampaign = createAsyncThunk(
  'bulkEmail/createCampaign',
  async (
    data: {
      name: string;
      subject: string;
      emailContent: string;
      recipients: Recipient[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await bulkEmailService.createCampaign(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const startCampaign = createAsyncThunk(
  'bulkEmail/startCampaign',
  async (campaignId: string, { rejectWithValue }) => {
    try {
      const response = await bulkEmailService.startCampaign(campaignId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCampaignStatus = createAsyncThunk(
  'bulkEmail/fetchStatus',
  async (campaignId: string, { rejectWithValue }) => {
    try {
      const response = await bulkEmailService.getCampaignStatus(campaignId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllCampaigns = createAsyncThunk(
  'bulkEmail/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const campaigns = await bulkEmailService.getAllCampaigns();
      return campaigns;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const bulkEmailSlice = createSlice({
  name: 'bulkEmail',
  initialState,
  reducers: {
    // Set campaign details
    setCampaignName: (state, action: PayloadAction<string>) => {
      state.campaignName = action.payload;
    },
    setCampaignSubject: (state, action: PayloadAction<string>) => {
      state.campaignSubject = action.payload;
    },
    setCampaignContent: (state, action: PayloadAction<string>) => {
      state.campaignContent = action.payload;
    },
    
    // Clear uploaded file
    clearUploadedFile: (state) => {
      state.uploadedFile = null;
      state.csvValidation = null;
      state.recipients = [];
      state.error = null;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear success message
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    
    // Reset entire state
    resetCampaignState: () => initialState,
  },
  extraReducers: (builder) => {
    // Validate CSV
    builder
      .addCase(validateCSVFile.pending, (state) => {
        state.isValidatingCSV = true;
        state.error = null;
      })
    .addCase(validateCSVFile.fulfilled, (state, action) => {
        state.isValidatingCSV = false;
        state.uploadedFile = action.payload.file;
        state.csvValidation = action.payload.validation;
        state.recipients = action.payload.validation.recipients;
        
        if (action.payload.validation.isValid) {
          state.successMessage = `Successfully validated ${action.payload.validation.totalValid} recipients`;
        } else {
          state.error = action.payload.validation.errors.join(', ');
        }
      })
      .addCase(validateCSVFile.rejected, (state, action) => {
        state.isValidatingCSV = false;
        state.error = action.payload as string;
      });

    // Upload CSV
    builder
      .addCase(uploadCSVFile.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadCSVFile.fulfilled, (state, action) => {
        state.isUploading = false;
        state.activeCampaignId = action.payload.campaignId;
        state.recipients = action.payload.recipients;
        state.successMessage = action.payload.message;
      })
      .addCase(uploadCSVFile.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });

    // Create Campaign
    builder
      .addCase(createCampaign.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.isCreating = false;
        state.activeCampaignId = action.payload.campaignId;
        state.successMessage = 'Campaign created successfully!';
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Start Campaign
    builder
      .addCase(startCampaign.pending, (state) => {
        state.isStarting = true;
        state.error = null;
      })
      .addCase(startCampaign.fulfilled, (state, action) => {
        state.isStarting = false;
        state.successMessage = action.payload.message;
      })
      .addCase(startCampaign.rejected, (state, action) => {
        state.isStarting = false;
        state.error = action.payload as string;
      });

    // Fetch Campaign Status
    builder
      .addCase(fetchCampaignStatus.fulfilled, (state, action) => {
        state.campaignStats = action.payload.stats;
        if (state.currentCampaign) {
          state.currentCampaign.status = action.payload.status;
        }
      });

    // Fetch All Campaigns
    builder
      .addCase(fetchAllCampaigns.pending, (state) => {
        state.isLoadingCampaigns = true;
      })
      .addCase(fetchAllCampaigns.fulfilled, (state, action) => {
        state.isLoadingCampaigns = false;
        state.allCampaigns = action.payload;
      })
      .addCase(fetchAllCampaigns.rejected, (state, action) => {
        state.isLoadingCampaigns = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCampaignName,
  setCampaignSubject,
  setCampaignContent,
  clearUploadedFile,
  clearError,
  clearSuccessMessage,
  resetCampaignState,
} = bulkEmailSlice.actions;

export default bulkEmailSlice.reducer;