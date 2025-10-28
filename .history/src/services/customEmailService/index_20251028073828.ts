
import { TrackingContent, EmailSignature } from '..';
import { TrackingGenerator } from './trackingGenerator';
import { EmailValidator } from './emailValidator';
import { EMAIL_SIGNATURES_DATA } from '../../constants/emailSignatures.constants';

export class CustomEmailService {
  // Get all signatures
  static async fetchSignatures(): Promise<EmailSignature[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(EMAIL_SIGNATURES_DATA);
      }, 300);
    });
  }

  // Generate trackable email content
  static async generateTrackingContent(
    recipientEmail: string,
    emailBody: string,
    signatureId: string | null,
    signatures: EmailSignature[]
  ): Promise<TrackingContent> {
    return new Promise((resolve, reject) => {
      // Validate form
      const validation = EmailValidator.validateEmailForm(recipientEmail, emailBody);
      
      if (!validation.isValid) {
        reject(new Error(validation.errors.join(', ')));
        return;
      }

      setTimeout(() => {
        // Get signature content
        const signatureContent = signatureId
          ? signatures.find(s => s.id === signatureId)?.content || ''
          : '';

        // Generate tracked HTML
        const { trackingId, html, linksCount } = TrackingGenerator.generateTrackedHtml(
          emailBody,
          recipientEmail,
          signatureContent
        );

        const trackingContent: TrackingContent = {
          trackingId,
          trackedHtml: html,
          originalLinksCount: linksCount,
          generatedAt: new Date().toISOString()
        };

        resolve(trackingContent);
      }, 1000);
    });
  }

  // Save tracking info to backend (mock)
  static async saveTrackingInfo(
    trackingId: string,
    recipientEmail: string,
    senderEmail: string
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Tracking info saved:', {
          trackingId,
          recipientEmail,
          senderEmail,
          timestamp: new Date().toISOString()
        });
        resolve();
      }, 200);
    });
  }
}

export { EmailValidator, TrackingGenerator };
