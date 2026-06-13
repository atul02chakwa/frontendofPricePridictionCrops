import axios from '../api/axios';

// Get all states
export const getStates = async () => {
  try {
    const response = await axios.get('/api/locations/states');
    return response.data;
  } catch (error) {
    console.error('Get states error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch states' };
  }
};

// Get districts by state
export const getDistrictsByState = async (state) => {
  try {
    const response = await axios.get('/api/locations/districts', { params: { state } });
    return response.data;
  } catch (error) {
    console.error('Get districts error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch districts' };
  }
};

// Get crops by location
export const getCropsByLocation = async (state, district) => {
  try {
    const response = await axios.get('/api/locations/crops', { params: { state, district } });
    return response.data;
  } catch (error) {
    console.error('Get crops error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch crops' };
  }
}; 