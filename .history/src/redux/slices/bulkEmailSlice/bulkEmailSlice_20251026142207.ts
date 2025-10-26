// redux/slices/bulkEmailSlice/bulkEmailSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { bulkEmailService } from '../../../services/bulkEmailService/index';
import type {
  Campaign,
  Recipient,
  UploadedFile,
  CSVValidationResult,
  CampaignStats,
  UploadCSVResponse,
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
        .addCase(validateCSVFile.fulfilled, (state, action: PayloadAction<{ file: UploadedFile; validation: CSVValidationResult }>) => {
          state.isValidatingCSV = false;
          state.uploadedFile = action.payload.file;
          state.csvValidation = action.payload.validation;
          // if the validation result includes parsed rows, set recipients
          // (adjust the property name if your service returns a different shape)
          // @ts-ignore - be tolerant if validation has different shape
          state.recipients = action.payload.validation.validRows ?? [];
          state.error = null;
        })
        .addCase(validateCSVFile.rejected, (state, action: any) => {
          state.isValidatingCSV = false;
          state.error = action.payload ?? action.error?.message ?? 'Failed to validate CSV';
        })
  
        // Upload CSV
        .addCase(uploadCSVFile.pending, (state) => {
          state.isUploading = true;
          state.error = null;
        })
        .addCase(uploadCSVFile.fulfilled, (state, action: PayloadAction<UploadCSVResponse>) => {
          state.isUploading = false;
          // If UploadCSVResponse contains the uploaded file, assign it accordingly
          state.uploadedFile = action.payload.file ?? null;
          state.successMessage = 'File uploaded successfully';
          state.error = null;
        })
        .addCase(uploadCSVFile.rejected, (state, action: any) => {
          state.isUploading = false;
          state.error = action.payload ?? action.error?.message ?? 'Failed to upload file';
        })
  
        // Create campaign
        .addCase(createCampaign.pending, (state) => {
          state.isCreating = true;
          state.error = null;
        })
        .addCase(createCampaign.fulfilled, (state, action) => {
          state.isCreating = false;
          state.currentCampaign = {
            id: action.payload?.campaignId ?? null
          };
          state.activeCampaignId = action.payload?.campaignId ?? null;
          state.successMessage = 'Campaign created successfully';
          state.error = null;
        })
        .addCase(createCampaign.rejected, (state, action: any) => {
          state.isCreating = false;
          state.error = action.payload ?? action.error?.message ?? 'Failed to create campaign';
        })
  
        // Start campaign
        .addCase(startCampaign.pending, (state) => {
          state.isStarting = true;
          state.error = null;
        })
        .addCase(startCampaign.fulfilled, (state, action: any) => {
          state.isStarting = false;
          // try to set activeCampaignId from payload or from the argument passed
          state.activeCampaignId = action.payload?.id ?? action.meta?.arg ?? state.activeCampaignId;
          state.successMessage = 'Campaign started';
          state.error = null;
        })
        .addCase(startCampaign.rejected, (state, action: any) => {
          state.isStarting = false;
          state.error = action.payload ?? action.error?.message ?? 'Failed to start campaign';
        })
  
                // Fetch campaign status
                .addCase(fetchCampaignStatus.fulfilled, (state, action: PayloadAction<CampaignStats>) => {
                  state.campaignStats = action.payload;
                  state.error = null;
                })
                .addCase(fetchCampaignStatus.rejected, (state, action: any) => {
                  state.error = action.payload ?? action.error?.message ?? 'Failed to fetch campaign status';
                })
        // If your thunk returns CampaignStatusResponse, update the type accordingly:
                // Fetch campaign status
                .addCase(fetchCampaignStatus.fulfilled, (state, action: PayloadAction<CampaignStatusResponse>) => {
                  // If you need to transform CampaignStatusResponse to CampaignStats, do it here
                  // Example: state.campaignStats = transformToCampaignStats(action.payload);
                  state.campaignStats = action.payload as unknown as CampaignStats;
                  state.error = null;
                })
                .addCase(fetchCampaignStatus.rejected, (state, action: any) => {
                  state.error = action.payload ?? action.error?.message ?? 'Failed to fetch campaign status';
                })
  
        // Fetch all campaigns
        .addCase(fetchAllCampaigns.pending, (state) => {
          state.isLoadingCampaigns = true;
          state.error = null;
        })
        .addCase(fetchAllCampaigns.fulfilled, (state, action: PayloadAction<Campaign[]>) => {
          state.isLoadingCampaigns = false;
          state.allCampaigns = action.payload;
          state.error = null;
        })
        .addCase(fetchAllCampaigns.rejected, (state, action: any) => {
          state.isLoadingCampaigns = false;
          state.error = action.payload ?? action.error?.message ?? 'Failed to load campaigns';
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