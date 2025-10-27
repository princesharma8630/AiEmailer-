// services/scheduleEmailServices/index.ts

import axios from 'axios';
import {
  ScheduleEmailRequest,
  ScheduledCampaignResponse,
  ScheduledCampaign,
  UpdateScheduleRequest,
} from '../../type/scheduleEmail.type';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const scheduleEmailService = {
  
  // Schedule new campaign
  async scheduleCampaign(data: ScheduleEmailRequest): Promise<ScheduledCampaignResponse> {
    try {
      const response = await apiClient.post<ScheduledCampaignResponse>(
        '/email-campaign/schedule',
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to schedule campaign'
      );
    }
  },
  
  // Get all scheduled campaigns
  async getScheduledCampaigns(): Promise<ScheduledCampaign[]> {
    try {
      const response = await apiClient.get<{ campaigns: ScheduledCampaign[] }>(
        '/email-campaign/scheduled'
      );
      return response.data.campaigns;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get scheduled campaigns'
      );
    }
  },
  
  // Update schedule time
  async updateSchedule(data: UpdateScheduleRequest): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.put(
        `/email-campaign/${data.campaignId}/schedule`,
        {
          scheduledAt: data.scheduledAt,
          timezone: data.timezone,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to update schedule'
      );
    }
  },
  
  // Cancel scheduled campaign
  async cancelSchedule(campaignId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(
        `/email-campaign/${campaignId}/schedule`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to cancel schedule'
      );
    }
  },
  
  // Get available timezones
  getTimezones(): string[] {
    return Intl.supportedValuesOf('timeZone');
  },
  
  // Validate schedule time (must be in future)
  validateScheduleTime(scheduledAt: string): { isValid: boolean; error?: string } {
    const scheduleDate = new Date(scheduledAt);
    const now = new Date();
    
    if (scheduleDate <= now) {
      return {
        isValid: false,
        error: 'Schedule time must be in the future',
      };
    }
    
    // Check if not too far in future (e.g., max 1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    if (scheduleDate > oneYearFromNow) {
      return {
        isValid: false,
        error: 'Schedule time cannot be more than 1 year in future',
      };
    }
    
    return { isValid: true };
  },
};