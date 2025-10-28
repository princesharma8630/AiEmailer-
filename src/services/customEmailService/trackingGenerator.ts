
export class TrackingGenerator {
  private static TRACK_CLICK_URL = 'https://track-click-5hq6q424ca-uc.a.run.app';
  private static TRACK_OPEN_URL = 'https://track-open-5hq6q424ca-uc.a.run.app';

  // Generate unique tracking ID
  static generateTrackingId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Create tracking pixel for email opens
  static generateTrackingPixel(trackingId: string, recipientEmail: string): string {
    const pixelUrl = `${this.TRACK_OPEN_URL}?id=${trackingId}&email=${encodeURIComponent(recipientEmail)}`;
    return `<img src="${pixelUrl}" width="1" height="1" style="display:none;" alt="" />`;
  }

  // Replace URLs with tracked links
  static createTrackedLinks(text: string, trackingId: string, recipientEmail: string): string {
    const urlPattern = /https?:\/\/[^\s<>"']*[^\s<>"'\.,;:!?)]/g;
    
    return text.replace(urlPattern, (url) => {
      // Clean up punctuation at the end
      let punctuation = '';
      let cleanUrl = url;
      
      while (cleanUrl && '.,;:!?)]}\'\"'.includes(cleanUrl[cleanUrl.length - 1])) {
        punctuation = cleanUrl[cleanUrl.length - 1] + punctuation;
        cleanUrl = cleanUrl.substring(0, cleanUrl.length - 1);
      }
      
      // Encode URL for tracking
      const encodedUrl = btoa(cleanUrl);
      const trackedUrl = `${this.TRACK_CLICK_URL}?id=${trackingId}&email=${encodeURIComponent(recipientEmail)}&url=${encodedUrl}`;
      
      return `<a href="${trackedUrl}" style="color: #1a73e8; text-decoration: underline;">${cleanUrl}</a>${punctuation}`;
    });
  }

  // Count URLs in text
  static countLinks(text: string): number {
    const urlPattern = /https?:\/\/[^\s<>"']*[^\s<>"'\.,;:!?)]/g;
    const matches = text.match(urlPattern);
    return matches ? matches.length : 0;
  }

  // Convert plain text to HTML with line breaks
  static convertNewlinesToHtml(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  // Generate complete tracked HTML
  static generateTrackedHtml(
    emailBody: string,
    recipientEmail: string,
    signatureContent: string
  ): { trackingId: string; html: string; linksCount: number } {
    const trackingId = this.generateTrackingId();
    const linksCount = this.countLinks(emailBody);
    
    // Convert newlines to HTML breaks
    let bodyWithBreaks = this.convertNewlinesToHtml(emailBody);
    
    // Add tracked links
    const bodyWithTrackedLinks = this.createTrackedLinks(bodyWithBreaks, trackingId, recipientEmail);
    
    // Add tracking pixel
    const trackingPixel = this.generateTrackingPixel(trackingId, recipientEmail);
    
    // Combine all parts
    const fullHtml = `${trackingPixel}${bodyWithTrackedLinks}${signatureContent}`;
    
    return {
      trackingId,
      html: fullHtml,
      linksCount
    };
  }
}


// ==========================================
// FILE: src/services/customEmailService/emailValidator.ts
// ==========================================

export class EmailValidator {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateEmailForm(recipientEmail: string, emailBody: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!recipientEmail.trim()) {
      errors.push('Recipient email is required');
    } else if (!this.isValidEmail(recipientEmail)) {
      errors.push('Please enter a valid email address');
    }

    if (!emailBody.trim()) {
      errors.push('Email body is required');
    } else if (emailBody.trim().length < 10) {
      errors.push('Email body must be at least 10 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
