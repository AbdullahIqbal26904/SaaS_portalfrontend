import apiClient from './client';

export const getAllServicePackages = (activeOnly = true) => {
  return apiClient.get('/api/services/packages/', {
    params: { active_only: activeOnly }
  });
};

export const getServicePackageById = (id) => {
  return apiClient.get(`/api/services/packages/${id}/`);
};

export const createServicePackage = (packageData) => {
  return apiClient.post('/api/services/packages/', packageData);
};

export const updateServicePackage = (id, packageData) => {
  return apiClient.patch(`/api/services/packages/${id}/`, packageData);
};

export const deleteServicePackage = (id) => {
  return apiClient.delete(`/api/services/packages/${id}/`);
};
