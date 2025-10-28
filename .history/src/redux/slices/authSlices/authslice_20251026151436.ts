import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  mockSignupAPI, 
  mockVerifyOTPAPI, 
  mockResendOTPAPI,
  mockLoginAPI,
  mockGetCurrentUserAPI 
} from '../../../services/mockAuthService';

// Define interfaces
interface User {
  id?: string;
  name?: string;
  email: string;
  organizationName?: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  userEmail: string | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
  isInitialized: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  userEmail: null,
  token: localStorage.getItem('token') || null,
  isLoggedIn: false,
  loading: false,
  error: null,
  success: false,
  isInitialized: false,
};

// =============================================
//    ASYNC THUNKS
// =============================================

// Signup User
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (
    userData: {
      name: string;
      organizationName: string;
      email: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await mockSignupAPI({
        ...userData,
        password: 'dummy123',
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Verify OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ otp, email }: { otp: string; email: string }, { rejectWithValue }) => {
    try {
      const data = await mockVerifyOTPAPI({ otp, email });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Resend OTP
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await mockResendOTPAPI({ email });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// 🆕 Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    loginData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await mockLoginAPI(loginData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// 🆕 Initialize Auth - Check if user is already logged in
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { isLoggedIn: false };
      }

      const data = await mockGetCurrentUserAPI();
      return {
        isLoggedIn: true,
        user: data.user,
        token,
      };
    } catch (error: any) {
      // If token is invalid, clear it
      localStorage.removeItem('token');
      return rejectWithValue(error.message || 'Session expired');
    }
  }
);

// =============================================
//    AUTH SLICE
// =============================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear success
    clearSuccess: (state) => {
      state.success = false;
    },

    // 🆕 Logout action
    logout: (state) => {
      state.user = null;
      state.userEmail = null;
      state.token = null;
      state.isLoggedIn = false;
      state.success = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('tempToken');
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
        state.user = action.payload.user;
        state.userEmail = action.payload.email || action.meta.arg.email;
        state.isLoggedIn = false; // Not logged in until OTP verified
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    // ========================================
    // Verify OTP
    // ========================================
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.isLoggedIn = true; // Now logged in after OTP verification
        state.user = action.payload.user || state.user;
        state.token = action.payload.token;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    // ========================================
    // Resend OTP
    // ========================================
    builder
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================
    // 🆕 Login User
    // ========================================
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userEmail = action.payload.user.email;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    // ========================================
    // 🆕 Initialize Auth
    // ========================================
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        if (action.payload.isLoggedIn) {
          state.isLoggedIn = true;
          state.user = action.payload.user;
          
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, clearSuccess, logout } = authSlice.actions;
export default authSlice.reducer;