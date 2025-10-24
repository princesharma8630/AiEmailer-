import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import dashboardService, {
  type DashboardStats,
  type StatusOverview,
  type ActivityData,
  type RecentActivity,
  type ChartFilters,
} from '../../../services/dashboardServices/dashboardService';

// Define interfaces
interface DashboardState {
  stats: DashboardStats | null;
  statusOverview: StatusOverview | null;
  activityData: ActivityData[];
  recentActivity: RecentActivity[];
  searchResults: any | null;
  filteredData: any | null;
  loading: boolean;
  statsLoading: boolean;
  statusLoading: boolean;
  activityLoading: boolean;
  recentActivityLoading: boolean;
  searchLoading: boolean;
  error: string | null;
  currentFilters: ChartFilters | null;
}

// Initial state
const initialState: DashboardState = {
  stats: null,
  statusOverview: null,
  activityData: [],
  recentActivity: [],
  searchResults: null,
  filteredData: null,
  loading: false,
  statsLoading: false,
  statusLoading: false,
  activityLoading: false,
  recentActivityLoading: false,
  searchLoading: false,
  error: null,
  currentFilters: null,
};

// Async Thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getStats();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch stats');
    }
  }
);

// Async Thunk for fetching status overview
export const fetchStatusOverview = createAsyncThunk(
  'dashboard/fetchStatusOverview',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getStatusOverview();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch status overview');
    }
  }
);

// Async Thunk for fetching activity over time
export const fetchActivityOverTime = createAsyncThunk(
  'dashboard/fetchActivityOverTime',
  async (filters: ChartFilters | undefined, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getActivityOverTime(filters);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch activity data');
    }
  }
);

// Async Thunk for fetching recent activity
export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchRecentActivity',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getRecentActivity(limit);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch recent activity');
    }
  }
);

// Async Thunk for searching campaigns
export const searchCampaigns = createAsyncThunk(
  'dashboard/searchCampaigns',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await dashboardService.searchCampaigns(email);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to search campaigns');
    }
  }
);

// Async Thunk for fetching filtered data
export const fetchFilteredData = createAsyncThunk(
  'dashboard/fetchFilteredData',
  async (filters: ChartFilters, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getFilteredData(filters);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch filtered data');
    }
  }
);

// Dashboard Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set current filters
    setFilters: (state, action: PayloadAction<ChartFilters>) => {
      state.currentFilters = action.payload;
    },

    // Clear filters
    clearFilters: (state) => {
      state.currentFilters = null;
    },

    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = null;
    },

    // Reset dashboard state
    resetDashboard: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Status Overview
    builder
      .addCase(fetchStatusOverview.pending, (state) => {
        state.statusLoading = true;
        state.error = null;
      })
      .addCase(fetchStatusOverview.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.statusOverview = action.payload;
      })
      .addCase(fetchStatusOverview.rejected, (state, action) => {
        state.statusLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Activity Over Time
    builder
      .addCase(fetchActivityOverTime.pending, (state) => {
        state.activityLoading = true;
        state.error = null;
      })
      .addCase(fetchActivityOverTime.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.activityData = action.payload;
      })
      .addCase(fetchActivityOverTime.rejected, (state, action) => {
        state.activityLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Recent Activity
    builder
      .addCase(fetchRecentActivity.pending, (state) => {
        state.recentActivityLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.recentActivityLoading = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.recentActivityLoading = false;
        state.error = action.payload as string;
      });

    // Search Campaigns
    builder
      .addCase(searchCampaigns.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchCampaigns.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchCampaigns.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Filtered Data
    builder
      .addCase(fetchFilteredData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredData.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredData = action.payload;
        state.currentFilters = action.meta.arg;
      })
      .addCase(fetchFilteredData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  clearSearchResults,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;