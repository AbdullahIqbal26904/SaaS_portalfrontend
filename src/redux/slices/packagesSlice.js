import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as packagesApi from '@/api/packages';

// Async thunks
export const fetchServicePackages = createAsyncThunk(
  'packages/fetchAll',
  async (activeOnly = true, { rejectWithValue }) => {
    try {
      const response = await packagesApi.getAllServicePackages(activeOnly);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch service packages' });
    }
  }
);

export const fetchServicePackageById = createAsyncThunk(
  'packages/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await packagesApi.getServicePackageById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch service package' });
    }
  }
);

export const createNewServicePackage = createAsyncThunk(
  'packages/create',
  async (packageData, { rejectWithValue }) => {
    try {
      const response = await packagesApi.createServicePackage(packageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create service package' });
    }
  }
);

export const updateExistingServicePackage = createAsyncThunk(
  'packages/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await packagesApi.updateServicePackage(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update service package' });
    }
  }
);

export const deleteServicePackageById = createAsyncThunk(
  'packages/delete',
  async (id, { rejectWithValue }) => {
    try {
      await packagesApi.deleteServicePackage(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete service package' });
    }
  }
);

const initialState = {
  servicePackages: [],
  selectedPackage: null,
  loading: false,
  error: null
};

const packagesSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPackage: (state, action) => {
      state.selectedPackage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all packages
      .addCase(fetchServicePackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicePackages.fulfilled, (state, action) => {
        state.loading = false;
        state.servicePackages = action.payload;
      })
      .addCase(fetchServicePackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single package
      .addCase(fetchServicePackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicePackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPackage = action.payload;
      })
      .addCase(fetchServicePackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create package
      .addCase(createNewServicePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewServicePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.servicePackages.push(action.payload);
      })
      .addCase(createNewServicePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update package
      .addCase(updateExistingServicePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingServicePackage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.servicePackages.findIndex(
          pkg => pkg.id === action.payload.id
        );
        if (index !== -1) {
          state.servicePackages[index] = action.payload;
        }
        if (state.selectedPackage?.id === action.payload.id) {
          state.selectedPackage = action.payload;
        }
      })
      .addCase(updateExistingServicePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete package
      .addCase(deleteServicePackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteServicePackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.servicePackages = state.servicePackages.filter(
          pkg => pkg.id !== action.payload
        );
        if (state.selectedPackage?.id === action.payload) {
          state.selectedPackage = null;
        }
      })
      .addCase(deleteServicePackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setSelectedPackage } = packagesSlice.actions;
export default packagesSlice.reducer;
