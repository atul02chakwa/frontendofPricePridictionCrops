// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true); // Start loading
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Assuming getCurrentUser from authService fetches the complete user profile
        // including myManagedCrops upon initial load or refresh
        const response = await authService.getCurrentUser(); 
        console.log("AuthContext initAuth user:", response.data);
        setUser(response.data); // response.data IS the user object
      } catch (err) {
        console.error('AuthContext initAuth error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogin = async (email, password) => {
    // ... (your existing login logic)
    // Ensure it sets the full user object: setUser(response.user);
    setLoading(true);
    setError(null);
    try {
      const apiResponse = await authService.login(email, password);
      if (apiResponse.token && apiResponse.user) {
        setUser(apiResponse.user); // apiResponse.user should be the full user profile
        return apiResponse.user;
      }
      throw new Error(apiResponse.error || "Login failed: No token or user data received");
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    // ... (your existing register logic)
    // Ensure it sets the full user object: setUser(response.user);
    setLoading(true);
    setError(null);
    try {
      const apiResponse = await authService.register(userData);
      if (apiResponse.token && apiResponse.user) {
        setUser(apiResponse.user); // apiResponse.user should be the full user profile
        return apiResponse.user;
      }
      throw new Error(apiResponse.error || "Registration failed: No token or user data received");
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // ... (your existing logout logic)
    try {
      await authService.logout(); 
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setError(null);
    }
  };
  
  // Function specifically to update the user object in the context
  // This can be called by MyCrops.jsx or Profile.jsx after a successful API update
  const updateUserInContext = (updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
  };

  const handleUpdateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateUserProfile(profileData);
      // Assuming response.data is the updated user object
      setUser(response.data); 
      return response.data;
    } catch (err) {
      console.error('Update profile error:', err);
      const errorMessage = err.details?.[0]?.message || err.error || err.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateProfile: handleUpdateProfile,
        updateUserInContext, // <<< EXPOSE THIS NEW FUNCTION
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};