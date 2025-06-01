import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as departmentsApi from '@/api/departments';

// Async thunks
export const fetchDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.getAllDepartments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch departments' });
    }
  }
);

export const fetchDepartmentById = createAsyncThunk(
  'departments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.getDepartmentById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch department' });
    }
  }
);

export const createNewDepartment = createAsyncThunk(
  'departments/create',
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.createDepartment(departmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create department' });
    }
  }
);

export const updateExistingDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.updateDepartment(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update department' });
    }
  }
);

export const deleteDepartmentById = createAsyncThunk(
  'departments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await departmentsApi.deleteDepartment(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete department' });
    }
  }
);

export const addAdminToDepartment = createAsyncThunk(
  'departments/addAdmin',
  async ({ departmentId, adminData }, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.addDepartmentAdmin(departmentId, adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add admin' });
    }
  }
);

export const removeAdminFromDepartment = createAsyncThunk(
  'departments/removeAdmin',
  async ({ departmentId, email }, { rejectWithValue }) => {
    try {
      await departmentsApi.removeDepartmentAdmin(departmentId, email);
      return { departmentId, email };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove admin' });
    }
  }
);

export const addUserToDepartment = createAsyncThunk(
  'departments/addUser',
  async ({ departmentId, userData }, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.addDepartmentUser(departmentId, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add user to department' });
    }
  }
);

export const removeUserFromDepartment = createAsyncThunk(
  'departments/removeUser',
  async ({ departmentId, email }, { rejectWithValue }) => {
    try {
      await departmentsApi.removeDepartmentUser(departmentId, email);
      return { departmentId, email };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove user from department' });
    }
  }
);

const initialState = {
  departments: [],
  selectedDepartment: null,
  loading: false,
  error: null
};

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all departments
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single department
      .addCase(fetchDepartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDepartment = action.payload;
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create department
      .addCase(createNewDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments.push(action.payload);
      })
      .addCase(createNewDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update department
      .addCase(updateExistingDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.departments.findIndex(
          dept => dept.department_id === action.payload.department_id
        );
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
        if (state.selectedDepartment?.department_id === action.payload.department_id) {
          state.selectedDepartment = action.payload;
        }
      })
      .addCase(updateExistingDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete department
      .addCase(deleteDepartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.filter(
          dept => dept.department_id !== action.payload
        );
        if (state.selectedDepartment?.department_id === action.payload) {
          state.selectedDepartment = null;
        }
      })
      .addCase(deleteDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setSelectedDepartment } = departmentsSlice.actions;
export default departmentsSlice.reducer;
