// services/bulkEmailServices/emailTracker.ts

import { EMAIL_TRACKING_CONFIG } from '../../constants/emailTracking.constants';
import { generateTrackingId } from '../../Utils/uuid';

export class EmailTracker {
  
  static generateTrackingPixel(trackingId: string, recipientEmail: string): string {
    const pixelUrl = `${EMAIL_TRACKING_CONFIG.TRACK_OPEN_URL}?id=${trackingId}&email=${encodeURIComponent(recipientEmail)}`;
    return `<img src="${pixelUrl}" width="1" height="1" style="display:none;" alt="" />`;
  }
  
  static wrapLinksWithTracking(
    htmlContent: string,
    trackingId: string,
    recipientEmail: string
  ): string {
    // URL regex pattern
    const urlPattern = /https?:\/\/[^\s<>"']+/g;
    
    return htmlContent.replace(urlPattern, (url) => {
      // Clean up trailing punctuation
      let cleanUrl = url;
      let punctuation = '';
      
      while (cleanUrl && '.,;:!?)]}\'\"'.includes(cleanUrl[cleanUrl.length - 1])) {
        punctuation = cleanUrl[cleanUrl.length - 1] + punctuation;
        cleanUrl = cleanUrl.substring(0, cleanUrl.length - 1);
      }
      
      // Encode original URL
      const encodedUrl = btoa(cleanUrl);
      
      // Create tracked URL
      const trackedUrl = `${EMAIL_TRACKING_CONFIG.TRACK_CLICK_URL}?id=${trackingId}&email=${encodeURIComponent(recipientEmail)}&url=${encodedUrl}`;
      
      return `<a href="${trackedUrl}" style="color: #1a73e8; text-decoration: underline;">${cleanUrl}</a>${punctuation}`;
    });
  }
  
  static generateTrackedEmail(
    emailContent: string,
    recipientEmail: string,
    recipientName?: string,
    recipientCompany?: string
  ): { trackingId: string; trackedHtml: string } {
    const trackingId = generateTrackingId();
    
    // Convert plain text to HTML if needed
    let htmlContent = emailContent.includes('<html') || emailContent.includes('<body')
      ? emailContent
      : emailContent.replace(/\n/g, '<br>');
    
    // Personalize content
    htmlContent = htmlContent
      .replace(/\{\{name\}\}/g, recipientName || '')
      .replace(/\{\{company\}\}/g, recipientCompany || '')
      .replace(/\{\{email\}\}/g, recipientEmail);
    
    // Wrap links with tracking
    const trackedContent = this.wrapLinksWithTracking(htmlContent, trackingId, recipientEmail);
    
    // Add tracking pixel
    const trackingPixel = this.generateTrackingPixel(trackingId, recipientEmail);
    
    // Combine everything
    const trackedHtml = `${trackingPixel}${trackedContent}`;
    
    return {
      trackingId,
      trackedHtml,
    };
  }
  
  static extractLinksFromContent(content: string): string[] {
    const urlPattern = /https?:\/\/[^\s<>"']+/g;
    const matches = content.match(urlPattern);
    return matches || [];
  }
}