import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '@/api/auth';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('LoginUser thunk executing with:', credentials);
      const response = await authApi.login(credentials);
      
      // Check if the response has the expected format
      if (!response.data || !response.data.tokens) {
        console.error('Invalid response format:', response.data);
        return rejectWithValue({ 
          message: 'Server returned an unexpected response format. Please try again.' 
        });
      }
      
      // Store tokens
      authApi.storeAuthTokens(response.data.tokens);
      console.log('Tokens stored successfully');
      
      return response.data;
    } catch (error) {
      console.error('Login error in thunk:', error);
      // Extract the most useful error information
      const errorResponse = error.response?.data;
      const errorMessage = 
        errorResponse?.detail || 
        errorResponse?.message || 
        errorResponse?.non_field_errors?.[0] || 
        'Login failed. Please check your credentials.';
      
      return rejectWithValue({ 
        ...errorResponse,
        message: errorMessage 
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Handle direct customer registration vs reseller customer registration
      const isResellerRegistration = userData.reseller_id && userData.reseller_id > 0;
      
      let response;
      if (isResellerRegistration) {
        // If registering under a reseller, we use registerResellerCustomer
        console.log('Registering as reseller customer with:', userData);
        response = await authApi.registerResellerCustomer(userData);
      } else {
        // Direct customer registration
        console.log('Registering as direct customer with:', userData);
        response = await authApi.register(userData);
      }
      
      // Store tokens in local storage
      authApi.storeAuthTokens(response.data.tokens);
      
      console.log('Registration successful, user data:', response.data.user);
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error.response || error);
      return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Attempting to fetch user profile');
      const response = await authApi.getUserProfile();
      console.log('User profile fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      
      // If we get a 401 Unauthorized, the token is invalid or expired
      if (error.response?.status === 401) {
        // Clear tokens as they're invalid
        authApi.removeAuthTokens();
      }
      
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user profile' });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (options = {}, { rejectWithValue }) => {
    try {
      const { redirect = true } = options;
      authApi.removeAuthTokens();
      
      // Redirect to home page after logout if requested
      if (redirect && typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/';
        }, 300);
      }
      
      return null;
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: typeof window !== 'undefined' ? authApi.isAuthenticated() : false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If we're rejecting the profile fetch, we should set isAuthenticated to false
        // since the token is likely invalid
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
