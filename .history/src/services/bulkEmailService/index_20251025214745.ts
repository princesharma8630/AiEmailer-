// services/bulkEmailServices/index.ts

import axios from 'axios';
import {
  UploadCSVResponse,
  StartCampaignResponse,
  CampaignStatusResponse,
  Recipient,
  Campaign,
} from '../.';
import { CSVParser } from './csvParser';
import { EmailTracker } from './emailTracker';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with auth interceptor
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bulkEmailService = {
  
  // Parse CSV file locally (client-side validation)
  async parseCSVFile(file: File) {
    try {
      const validation = await CSVParser.parseFile(file);
      return validation;
    } catch (error: any) {
      throw new Error('Failed to parse CSV file: ' + error.message);
    }
  },
  
  // Upload CSV and create campaign
  async uploadCSV(file: File): Promise<UploadCSVResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post<UploadCSVResponse>(
        '/email-campaign/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to upload CSV file'
      );
    }
  },
  
  // Create campaign with email content
  async createCampaign(data: {
    name: string;
    subject: string;
    emailContent: string;
    recipients: Recipient[];
  }): Promise<{ campaignId: string }> {
    try {
      const response = await apiClient.post('/email-campaign/create', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to create campaign'
      );
    }
  },
  
  // Generate tracked emails for all recipients
  async generateTrackedEmails(campaignId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post(
        `/email-campaign/${campaignId}/generate-tracking`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to generate tracked emails'
      );
    }
  },
  
  // Start sending campaign
  async startCampaign(campaignId: string): Promise<StartCampaignResponse> {
    try {
      const response = await apiClient.post<StartCampaignResponse>(
        `/email-campaign/${campaignId}/start`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to start campaign'
      );
    }
  },
  
  // Get campaign status
  async getCampaignStatus(campaignId: string): Promise<CampaignStatusResponse> {
    try {
      const response = await apiClient.get<CampaignStatusResponse>(
        `/email-campaign/${campaignId}/status`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get campaign status'
      );
    }
  },
  
  // Get all campaigns
  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const response = await apiClient.get<{ campaigns: Campaign[] }>(
        '/email-campaign/list'
      );
      return response.data.campaigns;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get campaigns'
      );
    }
  },
  
  // Delete campaign
  async deleteCampaign(campaignId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(
        `/email-campaign/${campaignId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete campaign'
      );
    }
  },
  
  // Download sample CSV
  downloadSampleCSV(): void {
    const csvContent = CSVParser.generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-recipients.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};