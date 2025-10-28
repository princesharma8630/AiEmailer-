
export interface EmailSignature {
  id: string;
  email: string;
  name: string;
  content: string;
}

export interface CustomEmailFormData {
  recipientEmail: string;
  emailBody: string;
  signatureId: string | null;
}

export interface TrackingContent {
  trackingId: string;
  trackedHtml: string;
  originalLinksCount: number;
  generatedAt: string;
}

export interface CustomEmailState {
  formData: CustomEmailFormData;
  signatures: EmailSignature[];
  generatedContent: TrackingContent | null;
  isGenerating: boolean;
  error: string | null;
  copiedProvider: string | null;
}

export enum EmailProvider {
  GMAIL = 'gmail',
  ZOHO = 'zoho',
  OUTLOOK = 'outlook',
  RAW_HTML = 'rawHtml'
}