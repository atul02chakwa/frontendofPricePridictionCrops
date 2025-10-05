// Token storage keys
const ACCESS_TOKEN_KEY = 'crop_access_token';
const USER_KEY = 'crop_user';

// Store tokens and user data in localStorage
export const setTokens = (accessToken, user) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  
  if (user) {
    // Only store non-sensitive user data
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }
};

// Get access token from localStorage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Get user data from localStorage
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Clear all auth tokens and user data
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
}; 