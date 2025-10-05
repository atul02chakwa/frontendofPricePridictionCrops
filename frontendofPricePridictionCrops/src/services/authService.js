import axios from '../api/axios';

// Login a user
export const login = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    console.log('Login response:', response.data); // Debug log
    
    const { success, data } = response.data;
    
    if (!success || !data?.tokens?.accessToken) {
      throw new Error('Invalid response from server');
    }
    
    const { accessToken: token, refreshToken } = data.tokens;
    const user = data.user;
    
    // Store tokens in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Set token in axios headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { token, user };
  } catch (error) {
    console.error('Login error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to login' };
  }
};

// Register a new user
export const register = async (userData) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    console.log('Register response:', response.data); // Debug log
    
    const { success, data } = response.data;
    
    if (!success || !data?.tokens?.accessToken) {
      throw new Error('Invalid response from server');
    }
    
    const { accessToken: token, refreshToken } = data.tokens;
    const user = data.user;
    
    // Store tokens in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Set token in axios headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { token, user };
  } catch (error) {
    console.error('Registration error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to register' };
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await axios.get('/api/user/profile');
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to get user profile' };
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put('/api/user/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Get user preferences
export const getUserPreferences = async () => {
  try {
    const response = await axios.get('/api/user/preferences');
    return response.data;
  } catch (error) {
    console.error('Get preferences error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to get user preferences' };
  }
};

// Update user preferences
export const updateUserPreferences = async (preferences) => {
  try {
    const response = await axios.put('/api/user/preferences', preferences);
    return response.data;
  } catch (error) {
    console.error('Update preferences error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to update preferences' };
  }
};

// Logout user
export const logout = async () => {
  try {
    await axios.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error.response?.data || error);
  } finally {
    // Clear token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Remove token from axios headers
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Set auth token in axios headers
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default axios; 