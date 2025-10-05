import axios from "./axios";

export const getCrops = async () => {
  try {
    const response = await axios.get("/api/crops");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCropPredictions = async (cropId, params) => {
  try {
    const response = await axios.get(`/api/crops/${cropId}/predictions`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCropHistory = async (cropId, params) => {
  try {
    const response = await axios.get(`/api/crops/${cropId}/history`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCropAlerts = async () => {
  try {
    const response = await axios.get("/api/crops/alerts");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCropAlert = async (alertData) => {
  try {
    const response = await axios.post("/api/crops/alerts", alertData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCropAlert = async (alertId, alertData) => {
  try {
    const response = await axios.put(`/api/crops/alerts/${alertId}`, alertData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCropAlert = async (alertId) => {
  try {
    await axios.delete(`/api/crops/alerts/${alertId}`);
  } catch (error) {
    throw error;
  }
}; 