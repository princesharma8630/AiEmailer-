
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