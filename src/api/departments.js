import apiClient from './client';

export const getAllDepartments = () => {
  return apiClient.get('/departments/departments/');
};

export const getDepartmentById = (id) => {
  return apiClient.get(`/departments/departments/${id}/`);
};

export const createDepartment = (departmentData) => {
  return apiClient.post('/departments/departments/', departmentData);
};

export const updateDepartment = (id, departmentData) => {
  return apiClient.patch(`/departments/departments/${id}/`, departmentData);
};

export const deleteDepartment = (id) => {
  return apiClient.delete(`/departments/departments/${id}/`);
};

// Department Admin Management
export const addDepartmentAdmin = (departmentId, adminData) => {
  return apiClient.post(`/departments/departments/${departmentId}/admins/`, adminData);
};

export const removeDepartmentAdmin = (departmentId, email) => {
  return apiClient.delete(`/departments/departments/${departmentId}/admins/`, {
    data: { email }
  });
};

// Department User Management
export const addDepartmentUser = (departmentId, userData) => {
  return apiClient.post(`/departments/departments/${departmentId}/users/`, userData);
};

export const removeDepartmentUser = (departmentId, email) => {
  return apiClient.delete(`/departments/departments/${departmentId}/users/`, {
    data: { email }
  });
};
