// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PredictPriceForm = ({ onPredictionResult, onLoadingChange }) => {
  const [formData, setFormData] = useState({
    state: '',
    city: '',
    date: '',
    croptype: '',
    season: '',
    temp: '',
    rainfall: '',
    supply: '',
    demand: '',
    fertilizerused: '',
    n_periods: 7
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.croptype.trim()) newErrors.croptype = 'Crop is required';
    if (!formData.season.trim()) newErrors.season = 'Season is required';
    if (!formData.temp || formData.temp <= 0) newErrors.temp = 'Valid temperature is required';
    if (!formData.rainfall || formData.rainfall < 0) newErrors.rainfall = 'Valid rainfall is required';
    if (!formData.supply || formData.supply <= 0) newErrors.supply = 'Valid supply is required';
    if (!formData.demand || formData.demand <= 0) newErrors.demand = 'Valid demand is required';
    if (!formData.fertilizerused || formData.fertilizerused < 0) newErrors.fertilizerused = 'Valid fertilizer usage is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onLoadingChange(true);
    
    try {
      // Call the correct backend API endpoint
      const response = await fetch('http://localhost:5000/api/predictions/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      onPredictionResult(result, formData);
      
    } catch (error) {
      console.error('Prediction error:', error);
      onPredictionResult({ error: 'Prediction failed. Please try again.' }, formData);
    } finally {
      onLoadingChange(false);
    }
  };

  // Sample data for dropdowns
  const states = ['Maharashtra', 'Karnataka', 'Punjab', 'Uttar Pradesh', 'Gujarat'];
  const cities = {
    'Maharashtra': ['Pune', 'Mumbai', 'Nagpur', 'Nashik'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Belgaum'],
    'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot']
  };
  const crops = ['Wheat', 'Rice', 'Corn', 'Soybean', 'Cotton', 'Sugarcane'];
  const seasons = ['Kharif', 'Rabi', 'Summer'];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Predict Crop Price</h2>
        <p className="text-gray-600">
          Enter the required information to get price prediction
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* State */}
          <div>
            <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-700">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-700">
              City *
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!formData.state}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              } ${!formData.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">Select City</option>
              {formData.state && cities[formData.state]?.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          {/* Crop */}
          <div>
            <label htmlFor="croptype" className="block mb-2 text-sm font-medium text-gray-700">
              Crop *
            </label>
            <select
              id="croptype"
              name="croptype"
              value={formData.croptype}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.croptype ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Crop</option>
              {crops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
            {errors.croptype && <p className="mt-1 text-sm text-red-600">{errors.croptype}</p>}
          </div>

          {/* Season */}
          <div>
            <label htmlFor="season" className="block mb-2 text-sm font-medium text-gray-700">
              Season *
            </label>
            <select
              id="season"
              name="season"
              value={formData.season}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.season ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Season</option>
              {seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
            {errors.season && <p className="mt-1 text-sm text-red-600">{errors.season}</p>}
          </div>

          {/* Temperature */}
          <div>
            <label htmlFor="temp" className="block mb-2 text-sm font-medium text-gray-700">
              Temperature (°C) *
            </label>
            <input
              type="number"
              id="temp"
              name="temp"
              value={formData.temp}
              onChange={handleChange}
              min="0"
              step="0.1"
              placeholder="Enter temperature"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.temp ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.temp && <p className="mt-1 text-sm text-red-600">{errors.temp}</p>}
          </div>

          {/* Rainfall */}
          <div>
            <label htmlFor="rainfall" className="block mb-2 text-sm font-medium text-gray-700">
              Rainfall (mm) *
            </label>
            <input
              type="number"
              id="rainfall"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleChange}
              min="0"
              step="0.1"
              placeholder="Enter rainfall"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.rainfall ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.rainfall && <p className="mt-1 text-sm text-red-600">{errors.rainfall}</p>}
          </div>

          {/* Supply */}
          <div>
            <label htmlFor="supply" className="block mb-2 text-sm font-medium text-gray-700">
              Supply (quintals) *
            </label>
            <input
              type="number"
              id="supply"
              name="supply"
              value={formData.supply}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter supply"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.supply ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.supply && <p className="mt-1 text-sm text-red-600">{errors.supply}</p>}
          </div>

          {/* Demand */}
          <div>
            <label htmlFor="demand" className="block mb-2 text-sm font-medium text-gray-700">
              Demand (quintals) *
            </label>
            <input
              type="number"
              id="demand"
              name="demand"
              value={formData.demand}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter demand"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.demand ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.demand && <p className="mt-1 text-sm text-red-600">{errors.demand}</p>}
          </div>

          {/* Fertilizer Used */}
          <div>
            <label htmlFor="fertilizerused" className="block mb-2 text-sm font-medium text-gray-700">
              Fertilizer Used (kg) *
            </label>
            <input
              type="number"
              id="fertilizerused"
              name="fertilizerused"
              value={formData.fertilizerused}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter fertilizer used"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fertilizerused ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fertilizerused && <p className="mt-1 text-sm text-red-600">{errors.fertilizerused}</p>}
          </div>

          {/* Forecast Period */}
          <div>
            <label htmlFor="n_periods" className="block mb-2 text-sm font-medium text-gray-700">
              Forecast Period (Days) *
            </label>
            <select
              id="n_periods"
              name="n_periods"
              value={formData.n_periods}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>7 days (1 week)</option>
              <option value={14}>14 days (2 weeks)</option>
              <option value={21}>21 days (3 weeks)</option>
              <option value={30}>30 days (1 month)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">How far into the future to predict prices</p>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <button 
            type="submit" 
            className="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Predict Price
          </button>
        </motion.div>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState(null);

  const handlePredictionResult = (result, formData) => {
    setPredictionResult(result);
    setInputData(formData);
  };

  const handleLoadingChange = (loading) => {
    setIsLoading(loading);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Crop Price Prediction Dashboard</h1>
        <p className="mt-2 text-gray-600">Get accurate price predictions for your crops</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prediction Form */}
        <div>
          <PredictPriceForm 
            onPredictionResult={handlePredictionResult}
            onLoadingChange={handleLoadingChange}
          />
        </div>

        {/* Results Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Prediction Results</h2>
          
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Getting prediction...</span>
            </div>
          )}

          {!isLoading && !predictionResult && (
            <div className="text-center py-8 text-gray-500">
              <p>Fill out the form to get price predictions</p>
            </div>
          )}

          {!isLoading && predictionResult && (
            <div className="space-y-4">
              {predictionResult.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{predictionResult.error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="font-semibold text-green-800 mb-2">Future Price Prediction</h3>
                    {predictionResult.data?.predictedPrice && (
                      <div className="space-y-2">
                        <p className="text-green-700">
                          <span className="font-medium">Predicted Price:</span> ₹{predictionResult.data.predictedPrice} per quintal
                        </p>
                        {predictionResult.data.currentPrice && (
                          <p className="text-green-700">
                            <span className="font-medium">Current Price:</span> ₹{predictionResult.data.currentPrice} per quintal
                          </p>
                        )}
                        {predictionResult.data.changePercentage && (
                          <p className={`font-medium ${
                            predictionResult.data.changePercentage > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Expected Change: {predictionResult.data.changePercentage > 0 ? '+' : ''}{predictionResult.data.changePercentage}%
                          </p>
                        )}
                        {inputData?.n_periods && (
                          <p className="text-sm text-gray-600">
                            Forecast for {inputData.n_periods} days from {inputData.date}
                          </p>
                        )}
                      </div>
                    )}
                    {predictionResult.predicted_price && (
                      <p className="text-green-700">
                        <span className="font-medium">Predicted Price:</span> ₹{predictionResult.predicted_price}
                      </p>
                    )}
                    {predictionResult.message && (
                      <p className="text-green-700 mt-2">{predictionResult.message}</p>
                    )}
                  </div>
                  
                  {inputData && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <h3 className="font-semibold text-blue-800 mb-2">Input Parameters</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                        <p><span className="font-medium">Crop:</span> {inputData.croptype}</p>
                        <p><span className="font-medium">State:</span> {inputData.state}</p>
                        <p><span className="font-medium">City:</span> {inputData.city}</p>
                        <p><span className="font-medium">Season:</span> {inputData.season}</p>
                        <p><span className="font-medium">Temperature:</span> {inputData.temp}°C</p>
                        <p><span className="font-medium">Rainfall:</span> {inputData.rainfall}mm</p>
                        <p><span className="font-medium">Forecast Period:</span> {inputData.n_periods} days</p>
                        <p><span className="font-medium">Target Date:</span> {new Date(new Date(inputData.date).getTime() + inputData.n_periods * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;