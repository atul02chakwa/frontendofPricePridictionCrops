import axios from '../api/axios';

// Get all available crops
export const getCrops = async () => {
  try {
    const response = await axios.get('/api/prices/crops');
    return response.data;
  } catch (error) {
    console.error('Get crops error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch crops' };
  }
};

// Get price predictions for a specific crop
export const getCropPredictions = async (cropId, params) => {
  try {
    const response = await axios.get(`/api/prices/crops/${cropId}/predictions`, { params });
    return response.data;
  } catch (error) {
    console.error('Get predictions error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch predictions' };
  }
};

// Get historical prices for a specific crop
export const getCropHistory = async (cropId, params) => {
  try {
    const response = await axios.get(`/api/prices/crops/${cropId}/history`, { params });
    return response.data;
  } catch (error) {
    console.error('Get history error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch historical data' };
  }
};

// Get price alerts for the user
export const getPriceAlerts = async () => {
  try {
    const response = await axios.get('/api/prices/alerts');
    return response.data;
  } catch (error) {
    console.error('Get alerts error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to fetch alerts' };
  }
};

// Create a new price alert
export const createPriceAlert = async (alertData) => {
  try {
    const response = await axios.post('/api/prices/alerts', alertData);
    return response.data;
  } catch (error) {
    console.error('Create alert error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to create alert' };
  }
};

// Update an existing price alert
export const updatePriceAlert = async (alertId, alertData) => {
  try {
    const response = await axios.put(`/api/prices/alerts/${alertId}`, alertData);
    return response.data;
  } catch (error) {
    console.error('Update alert error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to update alert' };
  }
};

// Delete a price alert
export const deletePriceAlert = async (alertId) => {
  try {
    await axios.delete(`/api/prices/alerts/${alertId}`);
  } catch (error) {
    console.error('Delete alert error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to delete alert' };
  }
};

// Get crop price prediction using Hugging Face model
export const getCropPricePrediction = async (predictionData) => {
  try {
    const response = await axios.post('/api/predictions', predictionData);
    return response.data;
  } catch (error) {
    console.error('Get prediction error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to get price prediction' };
  }
};

// Get predicted price (alternative endpoint)
export const getPredictedPrice = async (predictionData) => {
  try {
    const response = await axios.post('/api/prices/predict', predictionData);
    return response.data;
  } catch (error) {
    console.error('Get predicted price error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to get predicted price' };
  }
}; 