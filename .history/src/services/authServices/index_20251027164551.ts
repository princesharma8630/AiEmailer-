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

export interface SignupData {
  name: string;
  email: string;
  organization: string;
  role?: string; // Default will be 'user'
}

export interface SignupResponse {
  message: string;
}

export interface VerifyEmailOTPData {
  email: string;
  code: string;
}

export interface VerifyEmailOTPResponse {
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
    const response = await apiClient.post<SignupResponse>('/auth/signup', {
      name: userData.name,
      organization: userData.organization,
      email: userData.email,
      role: userData.role || 'user',
    });
    
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * POST /auth/verify-email-otp
 * Request OTP for email verification (if you need to manually request OTP)
 * Note: Signup already sends OTP, so this might not be needed in your flow
 */
export const requestOTPAPI = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/auth/verify-email-otp', { email });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * POST /auth/email-verify
 * Verify email using OTP
 */
export const verifyOTPAPI = async (otpData: VerifyEmailOTPData): Promise<VerifyEmailOTPResponse> => {
  try {
    const response = await apiClient.post<VerifyEmailOTPResponse>('/auth/email-verify', otpData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * POST /auth/create-password
 * Create password after email verification
 */
export const createPasswordAPI = async (passwordData: CreatePasswordData): Promise<CreatePasswordResponse> => {
  try {
    const response = await apiClient.post<CreatePasswordResponse>('/auth/create-password', passwordData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * POST /auth/login
 * Login with email and password
 */
export const loginAPI = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', loginData);
    
    // Store auth token
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * POST /auth/logout
 * Logout current user (invalidate JWT)
 */
export const logoutAPI = async (): Promise<LogoutResponse> => {
  try {
    const response = await apiClient.post<LogoutResponse>('/auth/logout');
    
    // Clear token from storage
    localStorage.removeItem('token');
    
    return response.data;
  } catch (error: any) {
    // Even if API fails, clear local token
    localStorage.removeItem('token');
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