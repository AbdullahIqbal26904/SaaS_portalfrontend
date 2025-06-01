import apiClient from './client';

export const login = (credentials) => {
  console.log('Login attempt with:', credentials);
  return apiClient.post('/users/auth/login/', credentials)
    .catch(error => {
      console.error('Login API error:', error.response || error);
      throw error;
    });
};

export const register = (userData) => {
  return apiClient.post('/users/auth/register/', userData);
};

export const getUserProfile = () => {
  return apiClient.get('/users/profile/');
};

export const refreshToken = (refreshToken) => {
  return apiClient.post('/token/refresh/', { refresh: refreshToken });
};

// Store tokens in localStorage
export const storeAuthTokens = (tokens) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
  
  // Set a cookie for additional security (httpOnly would be better but requires server-side code)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now
  document.cookie = `auth_session=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
};

// Remove tokens from localStorage
export const removeAuthTokens = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // Clear the auth cookie
  document.cookie = 'auth_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  // Check both localStorage and cookies for better reliability
  const hasToken = !!localStorage.getItem('accessToken');
  const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('auth_session='));
  
  return hasToken && hasCookie;
};
