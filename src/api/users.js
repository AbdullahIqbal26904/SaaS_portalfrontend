import apiClient from './client';

export const getAllUsers = () => {
  return apiClient.get('/users/');
};

export const getUserById = (id) => {
  return apiClient.get(`/users/${id}/`);
};

export const updateUserRole = (id, roleData) => {
  return apiClient.patch(`/users/${id}/`, roleData);
};

export const deleteUser = (id) => {
  return apiClient.delete(`/users/${id}/`);
};
