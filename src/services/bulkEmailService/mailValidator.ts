// services/bulkEmailServices/emailValidator.ts

export class EmailValidator {
  
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static isDisposableEmail(email: string): boolean {
    const disposableDomains = [
      'tempmail.com',
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      // Add more...
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  }
  
  static validateBulk(emails: string[]): {
    valid: string[];
    invalid: string[];
    duplicates: string[];
  } {
    const valid: string[] = [];
    const invalid: string[] = [];
    const seen = new Set<string>();
    const duplicates: string[] = [];
    
    for (const email of emails) {
      const trimmedEmail = email.trim().toLowerCase();
      
      if (!this.isValidEmail(trimmedEmail)) {
        invalid.push(email);
        continue;
      }
      
      if (seen.has(trimmedEmail)) {
        duplicates.push(email);
        continue;
      }
      
      seen.add(trimmedEmail);
      valid.push(trimmedEmail);
    }
    
    return { valid, invalid, duplicates };
  }
}