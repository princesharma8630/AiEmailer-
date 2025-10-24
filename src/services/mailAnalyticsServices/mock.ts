import type { MailAnalyticsResponse } from './index';

const mockData = [
  {
    recipientEmail: 'phoenix.project@randommail.com',
    totalOpens: 25,
    totalClicks: 25,
    lastActivity: '2025-08-10T14:32:11Z',
  },
  {
    recipientEmail: 'nebula.operation@randommail.com',
    totalOpens: 30,
    totalClicks: 30,
    lastActivity: '2025-08-10T09:45:27Z',
  },
  {
    recipientEmail: 'horizon.initiative@randommail.com',
    totalOpens: 45,
    totalClicks: 45,
    lastActivity: '2025-08-10T18:20:55Z',
  },
  {
    recipientEmail: 'atlas.venture@randommail.com',
    totalOpens: 28,
    totalClicks: 28,
    lastActivity: '2025-08-10T11:05:38Z',
  },
  {
    recipientEmail: 'echo.mission@randommail.com',
    totalOpens: 50,
    totalClicks: 50,
    lastActivity: '2025-08-10T22:15:49Z',
  },
  {
    recipientEmail: 'quantum.task@randommail.com',
    totalOpens: 35,
    totalClicks: 35,
    lastActivity: '2025-08-10T03:50:12Z',
  },
  {
    recipientEmail: 'odyssey.program@randommail.com',
    totalOpens: 60,
    totalClicks: 60,
    lastActivity: '2025-08-10T17:30:04Z',
  },
  {
    recipientEmail: 'apex.strategy@randommail.com',
    totalOpens: 70,
    totalClicks: 70,
    lastActivity: '2025-08-10T12:00:00Z',
  },
];

export const mockMailAnalyticsService = {
  getMailAnalytics: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<MailAnalyticsResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const search = params?.search?.toLowerCase() || '';

        // Filter by search
        let filteredData = mockData;
        if (search) {
          filteredData = mockData.filter((item) =>
            item.recipientEmail.toLowerCase().includes(search)
          );
        }

        // Paginate
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        resolve({
          data: paginatedData,
          total: filteredData.length,
          page: page,
          limit: limit,
        });
      }, 500); // Simulate network delay
    });
  },

  getEmailAnalytics: async (email: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const emailData = mockData.find((item) => item.recipientEmail === email);
        resolve(emailData);
      }, 300);
    });
  },
};