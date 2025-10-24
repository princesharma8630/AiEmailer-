// src/services/authServices/index.ts
// Export types and real API functions

import axios from 'axios';


// Base API URL - update this with your actual backend URL
// For Create React App, use process.env; for Vite, use import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const tempToken = localStorage.getItem('tempToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (tempToken) {
      config.headers.Authorization = `Bearer ${tempToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================================
// Type Definitions
// ========================================

export interface SignupData {
  name: string;
  email: string;
  organizationName: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  email: string;
  tempToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    organizationName: string;
  };
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    organizationName: string;
    isVerified: boolean;
  };
}

export interface ResendOTPData {
  email: string;
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    organizationName: string;
  };
}

// ========================================
// API Functions (Real API calls)
// ========================================

/**
 * Signup API
 */
export const signupAPI = async (userData: SignupData): Promise<SignupResponse> => {
  try {
    const response = await apiClient.post<SignupResponse>('/auth/signup', userData);
    
    // Store temp token
    if (response.data.tempToken) {
      localStorage.setItem('tempToken', response.data.tempToken);
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Signup failed');
  }
};

/**
 * Verify OTP API
 */
export const verifyOTPAPI = async (otpData: VerifyOTPData): Promise<VerifyOTPResponse> => {
  try {
    const response = await apiClient.post<VerifyOTPResponse>('/auth/verify-otp', otpData);
    
    // Store auth token and remove temp token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.removeItem('tempToken');
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'OTP verification failed');
  }
};

/**
 * Resend OTP API
 */
export const resendOTPAPI = async (resendData: ResendOTPData): Promise<ResendOTPResponse> => {
  try {
    const response = await apiClient.post<ResendOTPResponse>('/auth/resend-otp', resendData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to resend OTP');
  }
};

/**
 * Login API
 */
export const loginAPI = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', loginData);
    
    // Store auth token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Login failed');
  }
};

/**
 * Get Current User API
 */
export const getCurrentUserAPI = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user');
  }
};