import { useState, useEffect } from 'react';

// Mock API functions (in a real app, these would make actual API calls)
const fetchCropList = async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return [
    'Rice', 'Wheat', 'Maize', 'Pulses', 'Soybeans', 'Cotton', 
    'Sugarcane', 'Potato', 'Tomato', 'Onion'
  ];
};

const fetchPriceData = async (crop, state, district) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  // Base prices for different crops (₹ per quintal)
  const BASE_PRICES = {
    'Rice': 2000,
    'Wheat': 1800,
    'Maize': 1500,
    'Pulses': 6000,
    'Soybeans': 3800,
    'Cotton': 5500,
    'Sugarcane': 300,
    'Potato': 1200,
    'Tomato': 1800,
    'Onion': 1400
  };
  
  const basePrice = BASE_PRICES[crop] || 2000;
  
  // Generate mock prediction data
  return {
    currentPrice: Math.round(basePrice * (0.95 + Math.random() * 0.1)),
    predictedPrice: Math.round(basePrice * (1.0 + Math.random() * 0.15)),
    changePercentage: Math.round((Math.random() * 10) - 2),
    lastUpdated: new Date().toLocaleString(),
    historicalData: generateHistoricalData(30, basePrice),
    regionalData: generateRegionalData(basePrice),
  };
};

// Helper function to generate historical data
const generateHistoricalData = (days, basePrice) => {
  const data = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate some random fluctuation around the base price
    const randomFactor = 0.9 + Math.random() * 0.2; // Random between 0.9 and 1.1
    const price = Math.round(basePrice * randomFactor);
    
    // Add some seasonality
    const seasonal = Math.sin(i / (days/3) * Math.PI) * (basePrice * 0.05);
    const actualPrice = Math.max(price + seasonal, basePrice * 0.8);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      predicted: Math.round(actualPrice * 1.02),
      actual: Math.round(actualPrice)
    });
  }
  
  return data;
};

// Helper function to generate regional data
const generateRegionalData = (basePrice) => {
  return [
    { region: 'North', price: Math.round(basePrice * (0.9 + Math.random() * 0.2)) },
    { region: 'South', price: Math.round(basePrice * (0.9 + Math.random() * 0.2)) },
    { region: 'East', price: Math.round(basePrice * (0.9 + Math.random() * 0.2)) },
    { region: 'West', price: Math.round(basePrice * (0.9 + Math.random() * 0.2)) },
    { region: 'Central', price: Math.round(basePrice * (0.9 + Math.random() * 0.2)) },
  ];
};

// Custom hook for crop data
export const useCropData = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch crop list on hook initialization
  useEffect(() => {
    const getCrops = async () => {
      setLoading(true);
      try {
        const cropList = await fetchCropList();
        setCrops(cropList);
      } catch (err) {
        console.error('Error fetching crops:', err);
        setError('Failed to load crop data');
      } finally {
        setLoading(false);
      }
    };
    
    getCrops();
  }, []);
  
  // Function to fetch price prediction for a specific crop and location
  const getPricePrediction = async (crop, state, district) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchPriceData(crop, state, district);
      return data;
    } catch (err) {
      console.error('Error fetching price prediction:', err);
      setError('Failed to load price prediction');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    crops,
    loading,
    error,
    getPricePrediction
  };
}; 