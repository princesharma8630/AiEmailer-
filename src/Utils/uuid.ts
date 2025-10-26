// utils/uuid.ts

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function generateTrackingId(): string {
  // Shorter tracking ID for URLs
  return `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateCampaignId(): string {
  return `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}