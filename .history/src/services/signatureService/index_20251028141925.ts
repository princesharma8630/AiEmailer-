
import { Signature, SignatureFormData } from '../../type/signature.type';

export class SignatureService {
  // Fetch all signatures
  static async fetchSignatures(): Promise<Signature[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const signatures: Signature[] = [
          {
            id: '1',
            name: 'Maria Signature',
            content: `<div style="font-family: Arial, sans-serif; font-size: 13px; color: #333;">
  <p style="margin: 0;"><strong>Maria Jones</strong></p>
  <p style="margin: 5px 0; color: #666;">Chief Business Officer</p>
  <p style="margin: 5px 0; color: #666;">AIBridze Technologies Pvt. Ltd.</p>
</div>`,
            createdAt: '2025-12-22T10:00:00Z',
            updatedAt: '2025-12-22T10:00:00Z'
          },
          {
            id: '2',
            name: 'John Signature',
            content: `<div style="font-family: Arial, sans-serif; font-size: 13px; color: #333;">
  <p style="margin: 0;"><strong>John Doe</strong></p>
  <p style="margin: 5px 0; color: #666;">Senior Marketing Manager</p>
  <p style="margin: 5px 0; color: #666;">📧 john@aimailer.com | 📞 +1 (555) 123-4567</p>
</div>`,
            createdAt: '2025-12-22T10:30:00Z',
            updatedAt: '2025-12-22T10:30:00Z'
          },
          {
            id: '3',
            name: 'Julia Signature',
            content: `<div style="font-family: Arial, sans-serif; font-size: 13px; color: #333;">
  <p style="margin: 0;"><strong>Julia Smith</strong></p>
  <p style="margin: 5px 0; color: #666;">Product Manager</p>
  <p style="margin: 5px 0; color: #1a73e8;">🌐 www.aimailer.com</p>
</div>`,
            createdAt: '2025-12-22T11:00:00Z',
            updatedAt: '2025-12-22T11:00:00Z'
          }
        ];
        resolve(signatures);
      }, 500);
    });
  }

  // Create new signature
  static async createSignature(formData: SignatureFormData): Promise<Signature> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!formData.name.trim()) {
          reject(new Error('Signature name is required'));
          return;
        }
        if (!formData.content.trim()) {
          reject(new Error('Signature content is required'));
          return;
        }

        const newSignature: Signature = {
          id: Date.now().toString(),
          name: formData.name,
          content: formData.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        resolve(newSignature);
      }, 800);
    });
  }

  // Update signature
  static async updateSignature(id: string, formData: SignatureFormData): Promise<Signature> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!formData.name.trim()) {
          reject(new Error('Signature name is required'));
          return;
        }
        if (!formData.content.trim()) {
          reject(new Error('Signature content is required'));
          return;
        }

        const updatedSignature: Signature = {
          id,
          name: formData.name,
          content: formData.content,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Mock created date
          updatedAt: new Date().toISOString()
        };

        resolve(updatedSignature);
      }, 800);
    });
  }

  // Delete signature
  static async deleteSignature(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Signature deleted:', id);
        resolve();
      }, 500);
    });
  }
}