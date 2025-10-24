import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { mailAnalyticsService,type MailAnalyticsData } from '../../../services/mailAnalyticsServices';

interface MailAnalyticsState {
  analytics: MailAnalyticsData[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  total: number;
}

const initialState: MailAnalyticsState = {
  analytics: [],
  loading: false,
  error: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  total: 0,
};

// Async thunks
export const fetchMailAnalytics = createAsyncThunk(
  'mailAnalytics/fetchAll',
  async (params: { page?: number; limit?: number; search?: string }) => {
    const response = await mailAnalyticsService.getMailAnalytics(params);
    return response;
  }
);

export const fetchEmailAnalytics = createAsyncThunk(
  'mailAnalytics/fetchEmail',
  async (email: string) => {
    const response = await mailAnalyticsService.getEmailAnalytics(email);
    return response;
  }
);

const mailAnalyticsSlice = createSlice({
  name: 'mailAnalytics',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all analytics
      .addCase(fetchMailAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMailAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = Math.ceil(action.payload.total / action.payload.limit);
      })
      .addCase(fetchMailAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      })
      // Fetch single email analytics
      .addCase(fetchEmailAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailAnalytics.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchEmailAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch email analytics';
      });
  },
});

export const { setSearchQuery, setCurrentPage, clearError } = mailAnalyticsSlice.actions;
export default mailAnalyticsSlice.reducer;