import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authentication interceptor
apiClient.interceptors.request.use(config => {
  // Check if we're in the browser environment before accessing localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add token refresh interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Only attempt refresh if we get a 401 Unauthorized and haven't tried refreshing this request already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Token expired, attempting refresh');
      
      try {
        // Check if we're in the browser environment
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            console.error('No refresh token available');
            throw new Error('No refresh token available');
          }
          
          console.log('Attempting token refresh');
          const response = await axios.post(`${API_URL}/api/token/refresh/`, {
            refresh: refreshToken
          });
          
          if (response.data && response.data.access) {
            console.log('Token refresh successful');
            localStorage.setItem('accessToken', response.data.access);
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return apiClient(originalRequest);
          } else {
            console.error('Token refresh API did not return an access token');
            throw new Error('Token refresh failed');
          }
        }
      } catch (err) {
        console.error('Token refresh failed:', err);
        // Refresh token expired or invalid, redirect to home page with login modal trigger
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          // Use a delay to avoid redirect loops and ensure the current request completes
          setTimeout(() => {
            // Only redirect if we're not already on the home page
            if (!window.location.pathname.includes('home-page')) {
              window.location.href = '/?login=true';
            }
          }, 100);
        }
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
