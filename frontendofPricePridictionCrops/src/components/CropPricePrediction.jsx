import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCropPricePrediction } from '../services/cropPriceService';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// Mock data for demonstration
const CROPS = [
  'Rice', 'Wheat', 'Maize', 'Pulses', 'Soybeans', 'Cotton', 'Sugarcane', 'Potato', 'Tomato', 'Onion'
];

const STATES = [
  'Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal',
  'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala'
];

const DISTRICTS = {
  'Punjab': ['Amritsar', 'Ludhiana', 'Patiala', 'Jalandhar', 'Bathinda'],
  'Haryana': ['Ambala', 'Karnal', 'Panipat', 'Rohtak', 'Hisar'],
  'Maharashtra': ['Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur']
  // Add more districts for other states as needed
};

// Mock historical data
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

// Mock region comparison data
const generateRegionData = (crop, basePrice) => {
  return [
    { region: 'North', price: Math.round(basePrice * (0.9 + Math.random() * 0.2)) },
    { region: 'South', price: Math.round(basePrice * (0.9 + Math.random() * 0.2)) },
    { region: 'East', price: Math.round(basePrice * (0.9 + Math.random() * 0.2)) },
    { region: 'West', price: Math.round(basePrice * (0.9 + Math.random() * 0.2)) },
    { region: 'Central', price: Math.round(basePrice * (0.9 + Math.random() * 0.2)) },
  ];
};

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

const CropPricePrediction = () => {
  // State variables
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [timeRange, setTimeRange] = useState('30-day'); // '7-day' or '30-day'

  // Update districts when state changes
  useEffect(() => {
    if (selectedState && DISTRICTS[selectedState]) {
      setDistricts(DISTRICTS[selectedState]);
      setSelectedDistrict('');
    } else {
      setDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedState]);

  // Fetch predictions when user clicks predict button
  const fetchPredictions = async () => {
    if (!selectedCrop || !selectedState || !selectedDistrict) {
      setError('Please select all fields before predicting');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare prediction data for the API
      const predictionRequestData = {
        croptype: selectedCrop,
        state: selectedState,
        city: selectedDistrict,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        season: getSeason(new Date().getMonth() + 1),
        temp: 25, // Default temperature
        rainfall: 100, // Default rainfall
        supply: 1000, // Default supply
        demand: 1000, // Default demand
        fertilizerused: 50 // Default fertilizer usage
      };

      // Call the Hugging Face prediction API
      const response = await getCropPricePrediction(predictionRequestData);
      
      if (response.success && response.data) {
        const predictionData = response.data;
        
        // Set the prediction data
        setPredictionData({
          crop: predictionData.cropName,
          location: predictionData.location,
          currentPrice: predictionData.currentPrice,
          predictedPrice: predictionData.predictedPrice,
          changePercentage: predictionData.changePercentage,
          lastUpdated: new Date(predictionData.lastUpdated).toLocaleString(),
          confidence: predictionData.confidence
        });
        
        // Generate historical and regional data based on the prediction
        const basePrice = predictionData.currentPrice || BASE_PRICES[selectedCrop] || 2000;
        setHistoricalData(generateHistoricalData(timeRange === '7-day' ? 7 : 30, basePrice));
        setRegionData(generateRegionData(selectedCrop, basePrice));
      } else {
        throw new Error(response.error || 'Failed to get prediction');
      }
      
    } catch (err) {
      console.error('Error fetching prediction data:', err);
      setError(err.message || 'Failed to fetch prediction data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get season based on month
  const getSeason = (month) => {
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Autumn';
    return 'Winter';
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    if (predictionData) {
      const basePrice = BASE_PRICES[selectedCrop] || 2000;
      setHistoricalData(generateHistoricalData(range === '7-day' ? 7 : 30, basePrice));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg p-6 shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary mb-6">Crop Price Prediction</h2>
      
      {/* Selection Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label htmlFor="crop" className="block text-sm font-medium text-gray-700 mb-1">
            Select Crop
          </label>
          <select
            id="crop"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
          >
            <option value="">Select a crop</option>
            {CROPS.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            Select State
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
          >
            <option value="">Select a state</option>
            {STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
            Select District
          </label>
          <select
            id="district"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
            disabled={!selectedState || districts.length === 0}
          >
            <option value="">Select a district</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchPredictions}
            disabled={isLoading}
            className="w-full p-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Predict Price"
            )}
          </motion.button>
        </div>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-red-100 text-red-700 rounded-md"
        >
          {error}
        </motion.div>
      )}
      
      {/* Placeholder message when no data */}
      {!isLoading && !predictionData && !error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-gray-500"
        >
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg">Select a crop and location to see predictions</p>
        </motion.div>
      )}
      
      {/* Prediction Results */}
      {predictionData && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-primary mb-3">Price Prediction Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-500">Crop</p>
                <p className="text-xl font-bold">{predictionData.crop}</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-xl font-bold">{predictionData.location}</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="text-xl font-bold">₹{predictionData.currentPrice}/quintal</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-500">Predicted Price</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold">₹{predictionData.predictedPrice}/quintal</p>
                  <span className={`ml-2 text-sm ${predictionData.changePercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {predictionData.changePercentage >= 0 ? '+' : ''}{predictionData.changePercentage}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Last updated: {predictionData.lastUpdated}</p>
          </div>
          
          {/* Price Trend Chart */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">Price Trend</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleTimeRangeChange('7-day')}
                  className={`px-3 py-1 text-sm rounded-md ${timeRange === '7-day' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  7 Day
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('30-day')}
                  className={`px-3 py-1 text-sm rounded-md ${timeRange === '30-day' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  30 Day
                </button>
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 rounded-lg h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historicalData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`₹${value}`, 'Price']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#203a8f"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 6 }}
                    name="Actual Price"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#00d9b2"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 2 }}
                    activeDot={{ r: 6 }}
                    name="Predicted Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Region Comparison Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-primary mb-4">Regional Price Comparison</h3>
            <div className="bg-white p-4 border border-gray-200 rounded-lg h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`₹${value}`, 'Price/quintal']}
                  />
                  <Bar dataKey="price" fill="#00d9b2" barSize={40} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Market Insights */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Market Insights</h3>
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Price Factors</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Seasonal demand-supply gap expected to {predictionData.changePercentage >= 0 ? 'increase' : 'decrease'} prices</li>
                    <li>Weather conditions in major growing regions favorable</li>
                    <li>Government procurement policies stable</li>
                    <li>Import/export trends show normal activity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>{predictionData.changePercentage >= 2 ? 'Consider selling at current prices' : 'Consider holding for better prices'}</li>
                    <li>Monitor weather updates for potential impact</li>
                    <li>Track government announcements on MSP</li>
                    <li>Watch market arrivals in nearby mandis</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Disclaimer: Predictions are based on historical data and may vary from actual market prices. 
                Always consult with market experts before making business decisions.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CropPricePrediction; 