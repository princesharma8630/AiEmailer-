// types/scheduleEmail.types.ts

import type { Recipient, Campaign } from './bulkEmail.type';

export interface ScheduledCampaign extends Campaign {
  scheduledAt: string; // ISO date string
  timezone: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  lastExecutedAt?: string;
  nextExecutionAt?: string;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // Every X days/weeks/months
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday) for weekly
  dayOfMonth?: number; // 1-31 for monthly
  endDate?: string; // When to stop
}

export interface ScheduleEmailRequest {
  name: string;
  subject: string;
  emailContent: string;
  recipients: Recipient[];
  scheduledAt: string;
  timezone: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
}

export interface ScheduledCampaignResponse {
  success: boolean;
  campaignId: string;
  scheduledAt: string;
  message: string;
}

export interface UpdateScheduleRequest {
  campaignId: string;
  scheduledAt: string;
  timezone: string;
}