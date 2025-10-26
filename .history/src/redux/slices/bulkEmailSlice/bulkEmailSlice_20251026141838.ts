// redux/slices/bulkEmailSlice/bulkEmailSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bulkEmailService } from '../../../services/bulkEmailServices';
import {
  Campaign,
  Recipient,
  UploadedFile,
  CSVValidationResult,
  CampaignStats,
} from '../../../';

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
      .addCase(validateCSVFile.fulfilled, (state, action)