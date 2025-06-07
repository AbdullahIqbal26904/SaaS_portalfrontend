import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as resellersApi from '@/api/resellers';

// Async thunks
export const fetchResellers = createAsyncThunk(
  'resellers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await resellersApi.getAllResellers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch resellers' });
    }
  }
);

export const fetchResellerById = createAsyncThunk(
  'resellers/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await resellersApi.getResellerById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch reseller' });
    }
  }
);

export const createNewReseller = createAsyncThunk(
  'resellers/create',
  async (resellerData, { rejectWithValue }) => {
    try {
      const response = await resellersApi.createReseller(resellerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create reseller' });
    }
  }
);

export const updateExistingReseller = createAsyncThunk(
  'resellers/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await resellersApi.updateReseller(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update reseller' });
    }
  }
);

export const deleteResellerById = createAsyncThunk(
  'resellers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await resellersApi.deleteReseller(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete reseller' });
    }
  }
);

export const addAdminToReseller = createAsyncThunk(
  'resellers/addAdmin',
  async ({ resellerId, adminData }, { rejectWithValue }) => {
    try {
      const response = await resellersApi.addResellerAdmin(resellerId, adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add reseller admin' });
    }
  }
);

export const removeAdminFromReseller = createAsyncThunk(
  'resellers/removeAdmin',
  async ({ resellerId, email }, { rejectWithValue }) => {
    try {
      await resellersApi.removeResellerAdmin(resellerId, email);
      return { resellerId, email };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove reseller admin' });
    }
  }
);

export const fetchResellerCustomers = createAsyncThunk(
  'resellers/customers/fetchAll',
  async (resellerId, { rejectWithValue }) => {
    try {
      const response = await resellersApi.getResellerCustomers(resellerId);
      return { resellerId, customers: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch reseller customers' });
    }
  }
);

export const createResellerCustomer = createAsyncThunk(
  'resellers/customers/create',
  async ({ resellerId, customerData }, { rejectWithValue }) => {
    try {
      const response = await resellersApi.createResellerCustomer(resellerId, customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create reseller customer' });
    }
  }
);

export const createResellerSubscription = createAsyncThunk(
  'resellers/subscriptions/create',
  async ({ resellerId, subscriptionData }, { rejectWithValue }) => {
    try {
      const response = await resellersApi.createResellerSubscription(resellerId, subscriptionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create reseller subscription' });
    }
  }
);

const initialState = {
  resellers: [],
  selectedReseller: null,
  resellerCustomers: {},
  loading: false,
  error: null
};

const resellersSlice = createSlice({
  name: 'resellers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedReseller: (state, action) => {
      state.selectedReseller = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all resellers
      .addCase(fetchResellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResellers.fulfilled, (state, action) => {
        state.loading = false;
        state.resellers = action.payload;
      })
      .addCase(fetchResellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single reseller
      .addCase(fetchResellerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResellerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReseller = action.payload;
      })
      .addCase(fetchResellerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create reseller
      .addCase(createNewReseller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewReseller.fulfilled, (state, action) => {
        state.loading = false;
        state.resellers.push(action.payload);
      })
      .addCase(createNewReseller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update reseller
      .addCase(updateExistingReseller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingReseller.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.resellers.findIndex(
          reseller => reseller.reseller_id === action.payload.reseller_id
        );
        if (index !== -1) {
          state.resellers[index] = action.payload;
        }
        if (state.selectedReseller?.reseller_id === action.payload.reseller_id) {
          state.selectedReseller = action.payload;
        }
      })
      .addCase(updateExistingReseller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete reseller
      .addCase(deleteResellerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResellerById.fulfilled, (state, action) => {
        state.loading = false;
        state.resellers = state.resellers.filter(
          reseller => reseller.reseller_id !== action.payload
        );
        if (state.selectedReseller?.reseller_id === action.payload) {
          state.selectedReseller = null;
        }
      })
      .addCase(deleteResellerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add reseller admin
      .addCase(addAdminToReseller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdminToReseller.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedReseller?.reseller_id === action.payload.reseller) {
          if (!state.selectedReseller.admins) {
            state.selectedReseller.admins = [];
          }
          state.selectedReseller.admins.push(action.payload.user_details);
        }
      })
      .addCase(addAdminToReseller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove reseller admin
      .addCase(removeAdminFromReseller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAdminFromReseller.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedReseller?.reseller_id === action.payload.resellerId) {
          state.selectedReseller.admins = state.selectedReseller.admins.filter(
            admin => admin.email !== action.payload.email
          );
        }
      })
      .addCase(removeAdminFromReseller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch reseller customers
      .addCase(fetchResellerCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResellerCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.resellerCustomers[action.payload.resellerId] = action.payload.customers;
      })
      .addCase(fetchResellerCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create reseller customer
      .addCase(createResellerCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResellerCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const resellerId = action.payload.reseller;
        if (state.resellerCustomers[resellerId]) {
          state.resellerCustomers[resellerId].push(action.payload);
        } else {
          state.resellerCustomers[resellerId] = [action.payload];
        }
      })
      .addCase(createResellerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create reseller subscription
      .addCase(createResellerSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResellerSubscription.fulfilled, (state, action) => {
        state.loading = false;
        // Note: We don't need to update the state here as subscriptions are managed in the subscriptionsSlice
      })
      .addCase(createResellerSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setSelectedReseller } = resellersSlice.actions;
export default resellersSlice.reducer;
