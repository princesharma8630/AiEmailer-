// services/bulkEmailServices/csvParser.ts

import Papa from 'papaparse';
import { Recipient, CSVValidationResult } from '../../types/bulkEmail.types';
import { EmailValidator } from './emailValidator';
import { CSV_UPLOAD_CONFIG } from '../../constants/emailTracking.constants';

export class CSVParser {
  
  static async parseFile(file: File): Promise<CSVValidationResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
        complete: (results) => {
          const validation = this.validateCSVData(results.data);
          resolve(validation);
        },
        error: (error) => {
          resolve({
            isValid: false,
            errors: [error.message],
            warnings: [],
            recipients: [],
            totalValid: 0,
            totalInvalid: 0,
          });
        },
      });
    });
  }
  
  static validateCSVData(data: any[]): CSVValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recipients: Recipient[] = [];
    let totalInvalid = 0;
    
    // Check if CSV has data
    if (data.length === 0) {
      errors.push('CSV file is empty');
      return {
        isValid: false,
        errors,
        warnings,
        recipients: [],
        totalValid: 0,
        totalInvalid: 0,
      };
    }
    
    // Check for required headers
    const firstRow = data[0];
    if (!firstRow.email && !firstRow.Email) {
      errors.push('CSV must have an "email" column');
      return {
        isValid: false,
        errors,
        warnings,
        recipients: [],
        totalValid: 0,
        totalInvalid: 0,
      };
    }
    
    // Parse each row
    const emails = new Set<string>();
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const email = (row.email || row.Email || '').trim().toLowerCase();
      
      // Skip empty rows
      if (!email) {
        continue;
      }
      
      // Validate email
      if (!EmailValidator.isValidEmail(email)) {
        totalInvalid++;
        warnings.push(`Row ${i + 2}: Invalid email "${email}"`);
        continue;
      }
      
      // Check for duplicates
      if (emails.has(email)) {
        warnings.push(`Row ${i + 2}: Duplicate email "${email}"`);
        continue;
      }
      
      emails.add(email);
      
      // Add recipient
      recipients.push({
        email,
        name: row.name || row.Name || row.first_name || row.FirstName || '',
        company: row.company || row.Company || '',
        customFields: {
          ...row,
        },
      });
    }
    
    // Final validation
    if (recipients.length === 0) {
      errors.push('No valid email addresses found in CSV');
    }
    
    if (recipients.length > CSV_UPLOAD_CONFIG.MAX_RECIPIENTS) {
      errors.push(`Too many recipients. Maximum allowed: ${CSV_UPLOAD_CONFIG.MAX_RECIPIENTS}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recipients,
      totalValid: recipients.length,
      totalInvalid,
    };
  }
  
  static generateSampleCSV(): string {
    return `email,name,company
john@example.com,John Doe,ABC Corp
jane@example.com,Jane Smith,XYZ Inc
bob@example.com,Bob Johnson,Tech Co`;
  }
}