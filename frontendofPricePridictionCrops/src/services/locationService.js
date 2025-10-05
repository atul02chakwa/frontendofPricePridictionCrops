import axios from '../api/axios';

// Get all available locations
export const getLocations = async () => {
  try {
    const response = await axios.get('/api/locations');
    return response.data;
  } catch (error) {
    console.error('Get locations error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch locations' };
  }
};

// Get location details
export const getLocationDetails = async (locationId) => {
  try {
    const response = await axios.get(`/api/locations/${locationId}`);
    return response.data;
  } catch (error) {
    console.error('Get location details error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch location details' };
  }
};

// Get crop prices for a specific location
export const getLocationCropPrices = async (locationId, params) => {
  try {
    const response = await axios.get(`/api/locations/${locationId}/prices`, { params });
    return response.data;
  } catch (error) {
    console.error('Get location prices error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch location prices' };
  }
};

// Get market information for a location
export const getLocationMarkets = async (locationId) => {
  try {
    const response = await axios.get(`/api/locations/${locationId}/markets`);
    return response.data;
  } catch (error) {
    console.error('Get location markets error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch market information' };
  }
}; 