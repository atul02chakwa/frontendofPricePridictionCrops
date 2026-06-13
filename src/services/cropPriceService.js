import axios from '../api/axios';

export const getCropPrices = async (params) => {
  try {
    const response = await axios.get('/api/crop-prices', { params });
    return response.data;
  } catch (error) {
    console.error('Get crop prices error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch crop prices' };
  }
};

export const fetchLatestPrices = async (params) => {
  try {
    const response = await axios.get('/api/crop-prices/fetch-latest', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch latest prices error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch latest prices' };
  }
};

export const getPriceAlerts = async () => {
  try {
    const response = await axios.get('/api/alerts');
    return response.data;
  } catch (error) {
    console.error('Get price alerts error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch alerts' };
  }
};

export const createPriceAlert = async (alertData) => {
  try {
    const response = await axios.post('/api/alerts', alertData);
    return response.data;
  } catch (error) {
    console.error('Create price alert error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to create alert' };
  }
};

export const updatePriceAlert = async (alertId, alertData) => {
  try {
    const response = await axios.put(`/api/alerts/${alertId}`, alertData);
    return response.data;
  } catch (error) {
    console.error('Update price alert error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to update alert' };
  }
};

export const deletePriceAlert = async (alertId) => {
  try {
    const response = await axios.delete(`/api/alerts/${alertId}`);
    return response.data;
  } catch (error) {
    console.error('Delete price alert error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to delete alert' };
  }
};
