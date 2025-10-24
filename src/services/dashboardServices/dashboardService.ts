// import api from './api'; // Uncomment this when using real API

// TypeScript interfaces for API responses
export interface DashboardStats {
  totalOpens: number;
  totalClicks: number;
  uniqueRecipients: number;
  recentActivity: string;
}

export interface StatusOverview {
  opened: number;
  clicked: number;
  notOpened: number;
  total: number;
}

export interface ActivityData {
  day: string;
  opened: number;
  clicked: number;
}

export interface RecentActivity {
  id: string;
  email: string;
  action: 'opened' | 'clicked';
  link?: string;
  ip: string;
  timestamp: string;
}

export interface ChartFilters {
  fromDate?: string;
  toDate?: string;
  email?: string;
}

// =============================================
//    MOCK API FUNCTIONS - DELETE WHEN USING REAL API
// =============================================

const mockDashboardStats: DashboardStats = {
  totalOpens: 22,
  totalClicks: 9,
  uniqueRecipients: 2,
  recentActivity: '22 hrs ago',
};

const mockStatusOverview: StatusOverview = {
  opened: 112,
  clicked: 56,
  notOpened: 40,
  total: 208,
};

const mockActivityData: ActivityData[] = [
  { day: 'Mon', opened: 10, clicked: 5 },
  { day: 'Tue', opened: 65, clicked: 30 },
  { day: 'Wed', opened: 25, clicked: 8 },
  { day: 'Thu', opened: 80, clicked: 115 },
  { day: 'Fri', opened: 65, clicked: 90 },
  { day: 'Sat', opened: 75, clicked: 100 },
  { day: 'Sun', opened: 5, clicked: 10 },
];

const mockRecentActivities: RecentActivity[] = [
  {
    id: '1',
    email: 'johndoe@gmail.com',
    action: 'opened',
    ip: '122.161.66.211',
    timestamp: '2025-10-22T09:30:00Z',
  },
  {
    id: '2',
    email: 'johndoe@gmail.com',
    action: 'opened',
    ip: '122.161.66.211',
    timestamp: '2025-10-22T09:30:00Z',
  },
  {
    id: '3',
    email: 'johndoe@gmail.com',
    action: 'clicked',
    link: 'https://example.com',
    ip: '122.161.66.211',
    timestamp: '2025-10-22T09:30:00Z',
  },
  {
    id: '4',
    email: 'johndoe@gmail.com',
    action: 'opened',
    ip: '122.161.66.211',
    timestamp: '2025-10-22T09:30:00Z',
  },
  {
    id: '5',
    email: 'johndoe@gmail.com',
    action: 'clicked',
    link: 'https://example.com',
    ip: '122.161.66.211',
    timestamp: '2025-10-22T09:30:00Z',
  },
];

// Mock API delay function
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock API Functions
const mockAPI = {
  getStats: async (): Promise<DashboardStats> => {
    await mockDelay();
    return mockDashboardStats;
  },

  getStatusOverview: async (): Promise<StatusOverview> => {
    await mockDelay();
    return mockStatusOverview;
  },

  getActivityOverTime: async (filters?: ChartFilters): Promise<ActivityData[]> => {
    await mockDelay();
    // You can add filter logic here if needed
    console.log('Filters applied:', filters);
    return mockActivityData;
  },

  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    await mockDelay();
    return mockRecentActivities.slice(0, limit);
  },

  searchCampaigns: async (email: string): Promise<any> => {
    await mockDelay();
    console.log('Searching for:', email);
    return {
      results: mockRecentActivities.filter((activity) =>
        activity.email.includes(email)
      ),
    };
  },

  getFilteredData: async (filters: ChartFilters): Promise<any> => {
    await mockDelay();
    console.log('Filtering data with:', filters);
    return {
      stats: mockDashboardStats,
      activities: mockActivityData,
    };
  },
};

// =============================================
//    DASHBOARD SERVICE - SWITCH BETWEEN MOCK AND REAL API
// =============================================

const USE_MOCK_API = true; // Set to false when using real API

const dashboardService = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    try {
      if (USE_MOCK_API) {
        return await mockAPI.getStats();
      }
      
      // REAL API CODE (Uncomment when ready)
      // const response = await api.get('/dashboard/stats');
      // return response.data;
      
      throw new Error('Real API not implemented yet');
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get status overview (for pie chart)
  getStatusOverview: async (): Promise<StatusOverview> => {
    try {
      if (USE_MOCK_API) {
        return await mockAPI.getStatusOverview();
      }
      
      // REAL API CODE (Uncomment when ready)
      // const response = await api.get('/dashboard/status-overview');
      // return response.data;
      
      throw new Error('Real API not implemented yet');
    } catch (error) {
      console.error('Error fetching status overview:', error);
      throw error;
    }
  },

  // Get activity over time (for line chart)
  getActivityOverTime: async (filters?: ChartFilters): Promise<ActivityData[]> => {
    try {
      if (USE_MOCK_API) {
        return await mockAPI.getActivityOverTime(filters);
      }
      
      // REAL API CODE (Uncomment when ready)
      // const response = await api.get('/dashboard/activity-chart', {
      //   params: filters,
      // });
      // return response.data;
      
      throw new Error('Real API not implemented yet');
    } catch (error) {
      console.error('Error fetching activity chart data:', error);
      throw error;
    }
  },

  // Get recent activity list
  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    try {
      if (USE_MOCK_API) {
        return await mockAPI.getRecentActivity(limit);
      }
      
      // REAL API CODE (Uncomment when ready)
      // const response = await api.get('/dashboard/recent-activity', {
      //   params: { limit },
      // });
      // return response.data;
      
      throw new Error('Real API not implemented yet');
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  },

  // Search campaigns by email
  searchCampaigns: async (email: string): Promise<any> => {
    try {
      if (USE_MOCK_API) {
        return await mockAPI.searchCampaigns(email);
      }
      
      // REAL API CODE (Uncomment when ready)
      // const response = await api.get('/dashboard/search', {
      //   params: { email },
      // });
      // return response.data;
      
      throw new Error('Real API not implemented yet');
    } catch (error) {
      console.error('Error searching campaigns:', error);
      throw error;
    }
  },

  // Get filtered data based on date range
  getFilteredData: async (filters: ChartFilters): Promise<any> => {
    try {
      if (USE_MOCK_API) {
        return await mockAPI.getFilteredData(filters);
      }
      
      // REAL API CODE (Uncomment when ready)
      // const response = await api.get('/dashboard/filtered-data', {
      //   params: filters,
      // });
      // return response.data;
      
      throw new Error('Real API not implemented yet');
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      throw error;
    }
  },
};

export default dashboardService;