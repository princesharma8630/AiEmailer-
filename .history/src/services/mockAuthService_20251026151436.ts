// src/services/mockAuthService.ts
// This is a MOCK service for testing without backend

import type {
  SignupData,
  SignupResponse,
  VerifyOTPData,
  VerifyOTPResponse,
  ResendOTPData,
  ResendOTPResponse,
  LoginData,
  LoginResponse,
} from './authServices';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for mock data
const mockDatabase = {
  users: new Map<string, any>(),
  otps: new Map<string, string>(),
};

// Generate mock OTP (always returns "123456" for testing)
const generateMockOTP = (): string => {
  return '123456'; // Fixed OTP for easy testing
};

// Generate mock token
const generateMockToken = (email: string): string => {
  return `mock_token_${email}_${Date.now()}`;
};

// ========================================
// MOCK API Functions
// ========================================

/**
 * Mock Signup API
 */
export const mockSignupAPI = async (userData: SignupData): Promise<SignupResponse> => {
  await delay(1000); // Simulate network delay

  try {
    // Check if user already exists
    if (mockDatabase.users.has(userData.email)) {
      throw new Error('Email already exists');
    }

    // Create user
    const user = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      organizationName: userData.organizationName,
      password: userData.password, // In real app, this should be hashed
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    // Save user
    mockDatabase.users.set(userData.email, user);

    // Generate and store OTP
    const otp = generateMockOTP();
    mockDatabase.otps.set(userData.email, otp);

    // Log OTP to console for testing
    console.log('🔐 Mock OTP for', userData.email, ':', otp);

    // Generate temp token
    const tempToken = generateMockToken(userData.email);
    localStorage.setItem('tempToken', tempToken);

    return {
      success: true,
      message: 'Signup successful. OTP sent to your email.',
      email: userData.email,
      tempToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationName: user.organizationName,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Signup failed');
  }
};

/**
 * Mock Verify OTP API
 */
export const mockVerifyOTPAPI = async (otpData: VerifyOTPData): Promise<VerifyOTPResponse> => {
  await delay(800); // Simulate network delay

  try {
    // Check if user exists
    const user = mockDatabase.users.get(otpData.email);
    if (!user) {
      throw new Error('User not found');
    }

    // Get stored OTP
    const storedOTP = mockDatabase.otps.get(otpData.email);
    if (!storedOTP) {
      throw new Error('OTP expired or not found');
    }

    // Verify OTP
    if (storedOTP !== otpData.otp) {
      throw new Error('Invalid OTP');
    }

    // Mark user as verified
    user.isVerified = true;
    mockDatabase.users.set(otpData.email, user);

    // Delete OTP
    mockDatabase.otps.delete(otpData.email);

    // Generate auth token
    const token = generateMockToken(otpData.email);
    localStorage.setItem('token', token);
    localStorage.removeItem('tempToken');

    console.log('✅ OTP Verified successfully for', otpData.email);

    return {
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationName: user.organizationName,
        isVerified: user.isVerified,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'OTP verification failed');
  }
};

/**
 * Mock Resend OTP API
 */
export const mockResendOTPAPI = async (resendData: ResendOTPData): Promise<ResendOTPResponse> => {
  await delay(600); // Simulate network delay

  try {
    // Check if user exists
    const user = mockDatabase.users.get(resendData.email);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if already verified
    if (user.isVerified) {
      throw new Error('User is already verified');
    }

    // Generate new OTP
    const otp = generateMockOTP();
    mockDatabase.otps.set(resendData.email, otp);

    // Log new OTP
    console.log('🔐 New Mock OTP for', resendData.email, ':', otp);

    return {
      success: true,
      message: 'OTP resent successfully',
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to resend OTP');
  }
};

/**
 * Mock Login API
 */
export const mockLoginAPI = async (loginData: LoginData): Promise<LoginResponse> => {
  await delay(1000); // Simulate network delay

  try {
    // Check if user exists
    const user = mockDatabase.users.get(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password (in real app, use bcrypt.compare)
    if (user.password !== loginData.password) {
      throw new Error('Invalid email or password');
    }

    // Check if verified
    if (!user.isVerified) {
      throw new Error('Please verify your email first');
    }

    // Generate token
    const token = generateMockToken(loginData.email);
    localStorage.setItem('token', token);

    console.log('✅ Login successful for', loginData.email);

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationName: user.organizationName,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Mock Get Current User API
 */
export const mockGetCurrentUserAPI = async (): Promise<any> => {
  await delay(500); // Simulate network delay

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Extract email from mock token
    const email = token.split('_')[2];
    const user = mockDatabase.users.get(email);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationName: user.organizationName,
        isVerified: user.isVerified,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user');
  }
};

// ========================================
// Helper: Clear Mock Database (for testing)
// ========================================
export const clearMockDatabase = () => {
  mockDatabase.users.clear();
  mockDatabase.otps.clear();
  console.log('🗑️ Mock database cleared');
};