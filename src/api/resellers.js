import apiClient from './client';

// Reseller Management
export const getAllResellers = () => {
  return apiClient.get('/api/resellers/resellers/');
};

export const getResellerById = (id) => {
  return apiClient.get(`/api/resellers/resellers/${id}/`);
};

export const createReseller = (resellerData) => {
  return apiClient.post('/api/resellers/resellers/', resellerData);
};

export const updateReseller = (id, resellerData) => {
  return apiClient.patch(`/api/resellers/resellers/${id}/`, resellerData);
};

export const deleteReseller = (id) => {
  return apiClient.delete(`/api/resellers/resellers/${id}/`);
};

// Reseller Admin Management
export const addResellerAdmin = (resellerId, adminData) => {
  return apiClient.post(`/api/resellers/resellers/${resellerId}/admins/`, adminData);
};

export const removeResellerAdmin = (resellerId, email) => {
  return apiClient.delete(`/api/resellers/resellers/${resellerId}/admins/`, {
    data: { email }
  });
};

// Reseller Customer Management
export const getResellerCustomers = (resellerId) => {
  return apiClient.get(`/api/resellers/resellers/${resellerId}/customers/`);
};

export const createResellerCustomer = (resellerId, customerData) => {
  return apiClient.post(`/api/resellers/resellers/${resellerId}/customers/`, customerData);
};

export const deleteResellerCustomer = (resellerId, customerId) => {
  return apiClient.delete(`/api/resellers/resellers/${resellerId}/customers/${customerId}/`);
};

// Reseller Subscription Management
export const createResellerSubscription = (resellerId, subscriptionData) => {
  return apiClient.post(`/api/resellers/resellers/${resellerId}/subscriptions/`, subscriptionData);
};
