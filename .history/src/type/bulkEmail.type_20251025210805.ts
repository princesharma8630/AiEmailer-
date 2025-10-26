 // types/bulkEmail.types.ts

export interface Recipient {
  email: string;
  name?: string;
  company?: string;
  customFields?: Record<string, string>;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  emailContent: string;
  recipients: Recipient[];
  totalRecipients: number;
  status: 'draft' | 'ready' | 'sending' | 'completed' | 'failed';
  createdAt: string;
  sentAt?: string;
}

export interface CampaignRecipient extends Recipient {
  id: string;
  campaignId: string;
  trackingId: string;
  trackedHtmlContent: string;
  sentAt?: string;
  deliveryStatus: 'pending' | 'sent' | 'failed' | 'bounced';
  opened: boolean;
  openedAt?: string;
  clicked: boolean;
  clickedAt?: string;
}

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface CSVValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recipients: Recipient[];
  totalValid: number;
  totalInvalid: number;
}

export interface TrackingConfig {
  trackOpenUrl: string;
  trackClickUrl: string;
}

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
}

// API Response Types
export interface UploadCSVResponse {
  success: boolean;
  campaignId: string;
  emailCount: number;
  recipients: Recipient[];
  message: string;
}

export interface StartCampaignResponse {
  success: boolean;
  jobId: string;
  estimatedTime: number;
  message: string;
}

export interface CampaignStatusResponse {
  campaignId: string;
  status: Campaign['status'];
  stats: CampaignStats;
  recipients: CampaignRecipient[];
}