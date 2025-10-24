import axios from 'axios';
import { mockMailAnalyticsService } from './mock';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface MailAnalyticsData {
  recipientEmail: string;
  totalOpens: number;
  totalClicks: number;
  lastActivity: string;
}

export interface MailAnalyticsResponse {
  data: MailAnalyticsData[];
  total: number;
  page: number;
  limit: number;
}

// Toggle between mock and real API
const USE_MOCK = true; // Set to false when real API is ready

// Real API service
const realApiService = {
  // Get all mail analytics
  getMailAnalytics: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<MailAnalyticsResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mail-analytics`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get analytics for specific email
  getEmailAnalytics: async (email: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/mail-analytics/${email}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Export based on USE_MOCK flag
export const mailAnalyticsService = USE_MOCK ? mockMailAnalyticsService : realApiService;