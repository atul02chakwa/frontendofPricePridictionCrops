// src/services/myCropsService.js
import axiosInstance from '../api/axios'; // Your configured axios instance

// const BASE_URL = '/api/user/my-managed-crops'; // Old base URL
const BASE_URL = '/api/managed-crops'; // *** NEW BASE URL ***

// Fetch all managed crops for the current user
// This endpoint should be designed to return only the crops for the authenticated user.
export const fetchMyManagedCrops = async () => {
  try {
    const response = await axiosInstance.get(BASE_URL); 
    return response.data.data; // Assuming backend returns { success: true, data: [crops] }
  } catch (error) {
    console.error("Error fetching managed crops:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Add a new managed crop
export const addMyManagedCrop = async (cropData) => {
  try {
    const response = await axiosInstance.post(BASE_URL, cropData);
    // The backend at POST /api/managed-crops should ideally return the newly created crop 
    // or the updated list of all managed crops for the user.
    // If it returns the updated User object, that's also fine.
    return response.data; // Expecting { success: true, data: createdCropOrUpdatedUser }
  } catch (error) {
    console.error("Error adding managed crop:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Update an existing managed crop
export const updateMyManagedCrop = async (cropMongoId, cropData) => {
  try {
    // The :cropMongoId is part of the URL path
    const response = await axiosInstance.put(`${BASE_URL}/${cropMongoId}`, cropData);
    return response.data; // Expecting { success: true, data: updatedCropOrUpdatedUser }
  } catch (error) {
    console.error("Error updating managed crop:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Delete a managed crop
export const deleteMyManagedCrop = async (cropMongoId) => {
  try {
    // The :cropMongoId is part of the URL path
    const response = await axiosInstance.delete(`${BASE_URL}/${cropMongoId}`);
    // Backend might return a success message or the updated user object / crop list
    return response.data; 
  } catch (error) {
    console.error("Error deleting managed crop:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};