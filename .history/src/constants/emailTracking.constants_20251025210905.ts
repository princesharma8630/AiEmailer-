// constants/emailTracking.constants.ts

export const EMAIL_TRACKING_CONFIG = {
  TRACK_CLICK_URL: import.meta.env.VITE_TRACK_CLICK_URL || 'https://track-click-5hq6q424ca-uc.a.run.app',
  TRACK_OPEN_URL: import.meta.env.VITE_TRACK_OPEN_URL || 'https://track-open-5hq6q424ca-uc.a.run.app',
};

export const CSV_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['text/csv', 'application/vnd.ms-excel'],
  REQUIRED_HEADERS: ['email'],
  OPTIONAL_HEADERS: ['name', 'company', 'first_name', 'last_name'],
};

export const EMAIL_LIMITS = {
  MAX_RECIPIENTS: 10000,
  MIN_RECIPIENTS: 1,
  BATCH_SIZE: 50, // Send 50 emails at a time
};

export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  READY: 'ready',
  SENDING: 'sending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;