import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as usersApi from '@/api/users';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersApi.getAllUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch users' });
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/search',
  async ({ query = '', page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await usersApi.searchUsers(query, page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to search users' });
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await usersApi.getUserById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user' });
    }
  }
);

export const updateUserRoleById = createAsyncThunk(
  'users/updateRole',
  async ({ id, roleData }, { rejectWithValue }) => {
    try {
      const response = await usersApi.updateUserRole(id, roleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update user role' });
    }
  }
);

export const deleteUserById = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await usersApi.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete user' });
    }
  }
);

const initialState = {
  users: [],
  searchResults: [],
  selectedUser: null,
  loading: false,
  searching: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  error: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.searching = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searching = false;
        state.searchResults = action.payload.users;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total
        };
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searching = false;
        state.error = action.payload;
      })
      
      // Fetch single user
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user role
      .addCase(updateUserRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRoleById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          user => user.user_id === action.payload.user_id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.user_id === action.payload.user_id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUserRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete user
      .addCase(deleteUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          user => user.user_id !== action.payload
        );
        if (state.selectedUser?.user_id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.searching = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searching = false;
        state.searchResults = action.payload.users;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total
        };
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searching = false;
        state.error = action.payload;
      })
      
      // Fetch single user
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Other cases remain unchanged
      // ...existing cases...
      ;
  }
;

export const { clearError, setSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
