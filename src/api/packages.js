import apiClient from './client';

export const getAllServicePackages = (activeOnly = true) => {
  return apiClient.get('/services/packages/', {
    params: { active_only: activeOnly }
  });
};

export const getServicePackageById = (id) => {
  return apiClient.get(`/services/packages/${id}/`);
};

export const createServicePackage = (packageData) => {
  return apiClient.post('/services/packages/', packageData);
};

export const updateServicePackage = (id, packageData) => {
  return apiClient.patch(`/services/packages/${id}/`, packageData);
};

export const deleteServicePackage = (id) => {
  return apiClient.delete(`/services/packages/${id}/`);
};
