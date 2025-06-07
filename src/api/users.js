import apiClient from './client';

export const getAllUsers = () => {
  return apiClient.get('/api/users/');
};

export const searchUsers = (query = '', page = 1, limit = 10) => {
  return apiClient.get('/api/users/search/', {
    params: { query, page, limit }
  });
};

export const getUserById = (id) => {
  return apiClient.get(`/api/users/${id}/`);
};

export const updateUserRole = (id, roleData) => {
  return apiClient.patch(`/api/users/${id}/`, roleData);
};

export const deleteUser = (id) => {
  return apiClient.delete(`/api/users/${id}/`);
};

export const getUsersByDepartment = (departmentId) => {
  return apiClient.get(`/api/departments/${departmentId}/users/`);
};

export const getUsersBySubscription = (subscriptionId) => {
  return apiClient.get(`/api/subscriptions/${subscriptionId}/users/`);
};
