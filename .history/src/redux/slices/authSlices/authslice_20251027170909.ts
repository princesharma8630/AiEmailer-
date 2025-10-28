// src/redux/slices/authSlices/authslice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  signupAPI,
  verifyOTPAPI,
  resendOTPAPI,
  createPasswordAPI,
  loginAPI,
  logoutAPI,
  type SignupData,
  type VerifyOTPData,
  type ResendOTPData,
  type CreatePasswordData,
  type LoginData,
} from '../../../services/authServices';

// ========================================
// State Interface
// ========================================
interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  otpVerified: boolean;
  passwordCreated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  success: false,
  otpVerified: false,
  passwordCreated: false,
};

// ========================================
// Async Thunks
// ========================================

/**
 * Signup User
 */
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const response = await signupAPI(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

/**
 * Verify OTP
 */
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData: VerifyOTPData, { rejectWithValue }) => {
    try {
      const response = await verifyOTPAPI(otpData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

/**
 * Resend OTP
 */
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (resendData: ResendOTPData, { rejectWithValue }) => {
    try {
      const response = await resendOTPAPI(resendData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to resend OTP');
    }
  }
);

/**
 * Create Password
 */
export const createPassword = createAsyncThunk(
  'auth/createPassword',
  async (passwordData: CreatePasswordData, { rejectWithValue }) => {
    try {
      const response = await createPasswordAPI(passwordData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create password');
    }
  }
);

/**
 * Login User
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await loginAPI(loginData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Logout User
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutAPI();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// ========================================
// Auth Slice
// ========================================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.otpVerified = false;
      state.passwordCreated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // ========================================
    // Signup User
    // ========================================
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        console.log('✅ Signup success:', action.payload.message);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        console.error('❌ Signup failed:', action.payload);
      });

    // ========================================
    // Verify OTP
    // ========================================
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.error = null;
        console.log('✅ OTP verified:', action.payload.message);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.otpVerified = false;
        console.error('❌ OTP verification failed:', action.payload);
      });

    // ========================================
    // Resend OTP
    // ========================================
    builder
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log('✅ OTP resent:', action.payload.message);
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('❌ Resend OTP failed:', action.payload);
      });

    // ========================================
    // Create Password
    // ========================================
    builder
      .addCase(createPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordCreated = false;
      })
      .addCase(createPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordCreated = true;
        state.error = null;
        console.log('✅ Password created:', action.payload.message);
      })
      .addCase(createPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.passwordCreated = false;
        console.error('❌ Create password failed:', action.payload);
      });

    // ========================================
    // Login User
    // ========================================
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.error = null;
        console.log('✅ Login success:', action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('❌ Login failed:', action.payload);
      });

    // ========================================
    // Logout User
    // ========================================
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.success = false;
        state.otpVerified = false;
        state.passwordCreated = false;
        console.log('✅ Logout success');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Still clear user data even if API call fails
        state.user = null;
        state.token = null;
        console.error('❌ Logout failed:', action.payload);
      });
  },
});

export const { resetAuthState, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;