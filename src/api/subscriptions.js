import apiClient from './client';

export const createSubscription = (subscriptionData) => {
  return apiClient.post('/services/subscribe/', subscriptionData);
};

export const getAllSubscriptions = () => {
  return apiClient.get('/services/subscriptions/');
};

export const getSubscriptionById = (id) => {
  return apiClient.get(`/services/subscriptions/${id}/`);
};

export const updateSubscriptionStatus = (id, status) => {
  return apiClient.patch(`/services/subscriptions/${id}/`, { status });
};

export const grantServiceAccess = (subscriptionId, userId) => {
  return apiClient.post(`/services/subscription-users/${subscriptionId}/`, {
    user_id: userId
  });
};

export const revokeServiceAccess = (accessId) => {
  return apiClient.delete(`/services/subscription-users/${accessId}/`);
};
