// redux/slices/scheduleEmailSlice/scheduleEmailSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { scheduleEmailService } from '../../../services/scheduleEmail.types/index';
import type{
  ScheduledCampaign,
  ScheduleEmailRequest,
} from '../../../type/scheduleEmail.type';
import type { Recipient, UploadedFile, CSVValidationResult } from '../../../type/bulkEmail.type';

interface ScheduleEmailState {
  // File & Recipients
  uploadedFile: UploadedFile | null;
  csvValidation: CSVValidationResult | null;
  recipients: Recipient[];
  
  // Campaign Details
  campaignName: string;
  campaignSubject: string;
  campaignContent: string;
  
  // Schedule Settings
  scheduledDate: string; // Date part: YYYY-MM-DD
  scheduledTime: string; // Time part: HH:MM
  timezone: string;
  
  // Recurring (optional)
  isRecurring: boolean;
  recurringFrequency: 'daily' | 'weekly' | 'monthly' | null;
  
  // All Scheduled Campaigns
  scheduledCampaigns: ScheduledCampaign[];
  
  // UI States
  isValidatingCSV: boolean;
  isScheduling: boolean;
  isLoadingCampaigns: boolean;
  isCancelling: boolean;
  
  // Messages
  error: string | null;
  successMessage: string | null;
}

const initialState: ScheduleEmailState = {
  uploadedFile: null,
  csvValidation: null,
  recipients: [],
  campaignName: '',
  campaignSubject: '',
  campaignContent: '',
  scheduledDate: '',
  scheduledTime: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  isRecurring: false,
  recurringFrequency: null,
  scheduledCampaigns: [],
  isValidatingCSV: false,
  isScheduling: false,
  isLoadingCampaigns: false,
  isCancelling: false,
  error: null,
  successMessage: null,
};

// Async Thunks

export const scheduleCampaign = createAsyncThunk(
  'scheduleEmail/schedule',
  async (data: ScheduleEmailRequest, { rejectWithValue }) => {
    try {
      const response = await scheduleEmailService.scheduleCampaign(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchScheduledCampaigns = createAsyncThunk(
  'scheduleEmail/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const campaigns = await scheduleEmailService.getScheduledCampaigns();
      return campaigns;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelScheduledCampaign = createAsyncThunk(
  'scheduleEmail/cancel',
  async (campaignId: string, { rejectWithValue }) => {
    try {
      await scheduleEmailService.cancelSchedule(campaignId);
      return campaignId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const scheduleEmailSlice = createSlice({
  name: 'scheduleEmail',
  initialState,
  reducers: {
    setCampaignName: (state, action: PayloadAction<string>) => {
      state.campaignName = action.payload;
    },
    setCampaignSubject: (state, action: PayloadAction<string>) => {
      state.campaignSubject = action.payload;
    },
    setCampaignContent: (state, action: PayloadAction<string>) => {
      state.campaignContent = action.payload;
    },
    setScheduledDate: (state, action: PayloadAction<string>) => {
      state.scheduledDate = action.payload;
    },
    setScheduledTime: (state, action: PayloadAction<string>) => {
      state.scheduledTime = action.payload;
    },
    setTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    setIsRecurring: (state, action: PayloadAction<boolean>) => {
      state.isRecurring = action.payload;
    },
    setRecurringFrequency: (
      state,
      action: PayloadAction<'daily' | 'weekly' | 'monthly' | null>
    ) => {
      state.recurringFrequency = action.payload;
    },
    setRecipients: (state, action: PayloadAction<Recipient[]>) => {
      state.recipients = action.payload;
    },
    setUploadedFile: (state, action: PayloadAction<UploadedFile>) => {
      state.uploadedFile = action.payload;
    },
    setCSVValidation: (state, action: PayloadAction<CSVValidationResult>) => {
      state.csvValidation = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearUploadedFile: (state) => {
      state.uploadedFile = null;
      state.csvValidation = null;
      state.recipients = [];
    },
    resetScheduleState: () => initialState,
  },
  extraReducers: (builder) => {
    // Schedule Campaign
    builder
      .addCase(scheduleCampaign.pending, (state) => {
        state.isScheduling = true;
        state.error = null;
      })
      .addCase(scheduleCampaign.fulfilled, (state, action) => {
        state.isScheduling = false;
        state.successMessage = action.payload.message;
      })
      .addCase(scheduleCampaign.rejected, (state, action) => {
        state.isScheduling = false;
        state.error = action.payload as string;
      });

    // Fetch Scheduled Campaigns
    builder
      .addCase(fetchScheduledCampaigns.pending, (state) => {
        state.isLoadingCampaigns = true;
      })
      .addCase(fetchScheduledCampaigns.fulfilled, (state, action) => {
        state.isLoadingCampaigns = false;
        state.scheduledCampaigns = action.payload;
      })
      .addCase(fetchScheduledCampaigns.rejected, (state, action) => {
        state.isLoadingCampaigns = false;
        state.error = action.payload as string;
      });

    // Cancel Campaign
    builder
      .addCase(cancelScheduledCampaign.pending, (state) => {
        state.isCancelling = true;
      })
      .addCase(cancelScheduledCampaign.fulfilled, (state, action) => {
        state.isCancelling = false;
        state.scheduledCampaigns = state.scheduledCampaigns.filter(
          (c) => c.id !== action.payload
        );
        state.successMessage = 'Campaign cancelled successfully';
      })
      .addCase(cancelScheduledCampaign.rejected, (state, action) => {
        state.isCancelling = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCampaignName,
  setCampaignSubject,
  setCampaignContent,
  setScheduledDate,
  setScheduledTime,
  setTimezone,
  setIsRecurring,
  setRecurringFrequency,
  setRecipients,
  setUploadedFile,
  setCSVValidation,
  clearError,
  clearSuccessMessage,
  clearUploadedFile,
  resetScheduleState,
} = scheduleEmailSlice.actions;

export default scheduleEmailSlice.reducer;