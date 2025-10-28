// src/services/authServices/index.ts
// Real API integration with backend

import axios from 'axios';

// ========================================
// API Configuration
// ========================================

// Base API URL - reads from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://aimailer-backend.onrender.com';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for slower connections
});

// Request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || error.response.data?.detail || 'Something went wrong';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || 'Request failed'));
    }
  }
);

// ========================================
// Type Definitions
// ========================================

// Updated to match signup form (organizationName instead of organization)
export interface SignupData {
  name: string;
  email: string;
  organizationName: string; // Changed from 'organization' to match form
  role?: string; // Default will be 'user'
}

export interface SignupResponse {
  message: string;
}

export interface VerifyOTPData {
  email: string;
  code: string;
}

export interface VerifyOTPResponse {
  message: string;
}

export interface ResendOTPData {
  email: string;
}

export interface ResendOTPResponse {
  message: string;
}

export interface CreatePasswordData {
  email: string;
  password: string;
  confirm_password: string;
}

export interface CreatePasswordResponse {
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    organization: string;
    role: string;
  };
}

export interface LogoutResponse {
  message: string;
}

// ========================================
// API Functions
// ========================================

/**
 * POST /auth/signup
 * Register a new user account
 */
export const signupAPI = async (userData: SignupData): Promise<SignupResponse> => {
  try {
    console.log('📤 Sending signup request:', userData);
    
    // Map frontend field name to backend field name
    const response = await apiClient.post<SignupResponse>('/auth/signup', {
      name: userData.name,
      organization: userData.organizationName, // Map organizationName → organization
      email: userData.email,
      role: userData.role || 'user',
    });
    
    console.log('✅ Signup response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Signup error:', error.message);
    throw error;
  }
};

/**
 * POST /auth/verify-email-otp
 * Request OTP for email verification (resend OTP)
 */
export const resendOTPAPI = async (resendData: ResendOTPData): Promise<ResendOTPResponse> => {
  try {
    console.log('📤 Resending OTP to:', resendData.email);
    const response = await apiClient.post<ResendOTPResponse>('/auth/verify-email-otp', { 
      email: resendData.email 
    });
    console.log('✅ OTP resent:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Resend OTP error:', error.message);
    throw error;
  }
};

/**
 * POST /auth/email-verify
 * Verify email using OTP
 */
export const verifyOTPAPI = async (otpData: VerifyOTPData): Promise<VerifyOTPResponse> => {
  try {
    console.log('📤 Verifying OTP for:', otpData.email);
    const response = await apiClient.post<VerifyOTPResponse>('/auth/email-verify', otpData);
    console.log('✅ OTP verified:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ OTP verification error:', error.message);
    throw error;
  }
};

/**
 * POST /auth/create-password
 * Create password after email verification
 */
export const createPasswordAPI = async (passwordData: CreatePasswordData): Promise<CreatePasswordResponse> => {
  try {
    console.log('📤 Creating password for:', passwordData.email);
    const response = await apiClient.post<CreatePasswordResponse>('/auth/create-password', passwordData);
    console.log('✅ Password created:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Create password error:', error.message);
    throw error;
  }
};

/**
 * POST /auth/login
 * Login with email and password
 */
export const loginAPI = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    console.log('📤 Logging in:', loginData.email);
    const response = await apiClient.post<LoginResponse>('/auth/login', loginData);
    
    // Store auth token
    if (response.data.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      console.log('✅ Token stored');
    }
    
    console.log('✅ Login success:', response.data.user);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ Login error:', error.message);
    throw error;
  }
};

/**
 * POST /auth/logout
 * Logout current user (invalidate JWT)
 */
export const logoutAPI = async (): Promise<LogoutResponse> => {
  try {
    console.log('📤 Logging out...');
    const response = await apiClient.post<LogoutResponse>('/auth/logout');
    
    // Clear token from storage
    localStorage.removeItem('token');
    console.log('✅ Logout success');
    
    return response.data;
  } catch (error: any) {
    // Even if API fails, clear local token
    localStorage.removeItem('token');
    console.error('❌ Logout error:', error.message);
    throw error;
  }
};

/**
 * Helper function to check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Helper function to get stored token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Helper function to clear authentication
 */
export const clearAuth = (): void => {
  localStorage.removeItem('token');
};