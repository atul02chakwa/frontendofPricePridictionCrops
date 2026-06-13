import axios from "./axios";

export const getCropPrices = async (params) => {
  try {
    const response = await axios.get("/api/crop-prices", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 