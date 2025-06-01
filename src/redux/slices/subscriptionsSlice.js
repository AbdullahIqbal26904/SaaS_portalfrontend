import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as subscriptionsApi from '@/api/subscriptions';

// Async thunks
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionsApi.getAllSubscriptions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch subscriptions' });
    }
  }
);

export const fetchSubscriptionById = createAsyncThunk(
  'subscriptions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await subscriptionsApi.getSubscriptionById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch subscription' });
    }
  }
);

export const createNewSubscription = createAsyncThunk(
  'subscriptions/create',
  async (subscriptionData, { rejectWithValue }) => {
    try {
      // Calculate end date based on billing cycle and start date if not provided
      if (!subscriptionData.end_date) {
        const startDate = new Date(subscriptionData.start_date);
        let endDate = new Date(startDate);
        
        switch (subscriptionData.billing_cycle) {
          case 'monthly':
            endDate.setMonth(endDate.getMonth() + 1);
            break;
          case 'quarterly':
            endDate.setMonth(endDate.getMonth() + 3);
            break;
          case 'yearly':
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
          default:
            endDate.setMonth(endDate.getMonth() + 1); // Default to monthly
        }
        
        subscriptionData.end_date = endDate.toISOString().split('T')[0];
      }
      
      // Set status if not provided
      if (!subscriptionData.status) {
        subscriptionData.status = 'active';
      }
      
      const response = await subscriptionsApi.createSubscription(subscriptionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create subscription' });
    }
  }
);

export const updateSubscriptionStatusById = createAsyncThunk(
  'subscriptions/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await subscriptionsApi.updateSubscriptionStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update subscription status' });
    }
  }
);

export const grantUserServiceAccess = createAsyncThunk(
  'subscriptions/grantAccess',
  async ({ subscriptionId, userId }, { rejectWithValue }) => {
    try {
      const response = await subscriptionsApi.grantServiceAccess(subscriptionId, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to grant service access' });
    }
  }
);

export const revokeUserServiceAccess = createAsyncThunk(
  'subscriptions/revokeAccess',
  async (accessId, { rejectWithValue }) => {
    try {
      await subscriptionsApi.revokeServiceAccess(accessId);
      return accessId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to revoke service access' });
    }
  }
);

const initialState = {
  subscriptions: [],
  selectedSubscription: null,
  serviceAccesses: [],
  loading: false,
  error: null
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedSubscription: (state, action) => {
      state.selectedSubscription = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single subscription
      .addCase(fetchSubscriptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubscription = action.payload;
      })
      .addCase(fetchSubscriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create subscription
      .addCase(createNewSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions.push(action.payload);
      })
      .addCase(createNewSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update subscription status
      .addCase(updateSubscriptionStatusById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionStatusById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subscriptions.findIndex(
          sub => sub.id === action.payload.id
        );
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
        if (state.selectedSubscription?.id === action.payload.id) {
          state.selectedSubscription = action.payload;
        }
      })
      .addCase(updateSubscriptionStatusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Grant service access
      .addCase(grantUserServiceAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(grantUserServiceAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceAccesses.push(action.payload);
      })
      .addCase(grantUserServiceAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Revoke service access
      .addCase(revokeUserServiceAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revokeUserServiceAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceAccesses = state.serviceAccesses.filter(
          access => access.id !== action.payload
        );
      })
      .addCase(revokeUserServiceAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setSelectedSubscription } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
