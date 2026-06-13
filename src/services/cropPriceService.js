import axios from '../api/axios';

// Get crop prices from backend
export const getCropPrices = async (params) => {
  try {
    const response = await axios.get('/api/crop-prices', { params });
    return response.data;
  } catch (error) {
    console.error('Get crop prices error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch crop prices' };
  }
}; 