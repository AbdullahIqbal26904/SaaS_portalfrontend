import apiClient from './client';

export const createSubscription = (subscriptionData) => {
  return apiClient.post('/api/services/subscribe/', subscriptionData);
};

export const getAllSubscriptions = () => {
  return apiClient.get('/api/services/subscriptions/');
};

export const getSubscriptionById = (id) => {
  return apiClient.get(`/api/services/subscriptions/${id}/`);
};

export const updateSubscriptionStatus = (id, status) => {
  return apiClient.patch(`/api/services/subscriptions/${id}/`, { status });
};

export const grantServiceAccess = (subscriptionId, userId) => {
  return apiClient.post(`/api/services/subscription-users/${subscriptionId}/`, {
    user_id: userId
  });
};

export const revokeServiceAccess = (accessId) => {
  return apiClient.delete(`/api/services/subscription-users/${accessId}/`);
};
