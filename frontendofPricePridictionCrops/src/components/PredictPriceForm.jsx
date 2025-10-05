// src/components/PredictPriceForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Button from './ui/button'; // Assuming this path is correct
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axios'; // Assuming this path is correct

// --- Mock Data for Dropdowns (Consider fetching these from an API in a real app) ---
const MOCK_CROPS = ['Rice', 'Wheat', 'Maize', 'Soybean', 'Cotton', 'Potato', 'Onion', 'Tomato', 'Sugarcane', 'Pulses'];
const MOCK_STATES = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Bihar', 'West Bengal', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala'];
const MOCK_CITIES = {
  Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  Haryana: ['Karnal', 'Hisar', 'Rohtak', 'Ambala', 'Panipat'],
  'Uttar Pradesh': ['Lucknow', 'Meerut', 'Kanpur', 'Varanasi', 'Agra'],
  Maharashtra: ['Nashik', 'Pune', 'Nagpur', 'Aurangabad', 'Mumbai'], // Added Mumbai as per curl
  Karnataka: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
  // Add other states and their cities as needed
};
const MOCK_SEASONS = ['Kharif', 'Rabi', 'Summer', 'Whole Year', 'Zaid']; // Added Zaid as per curl

// --- Zod Schema for Frontend Form Validation ---
const predictionFormSchema = z.object({
  date: z.string()
    .min(1, "Date is required")
    .refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)), {
      message: "Please select a valid date."
    }),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  croptype: z.string().min(1, "Crop type is required"),
  season: z.string().min(1, "Season is required"),
  temp: z.coerce.number({invalid_type_error: "Temperature must be a number."}).min(-50, "Temperature seems too low").max(60, "Temperature seems too high"),
  rainfall: z.coerce.number({invalid_type_error: "Rainfall must be a number."}).min(0, "Rainfall cannot be negative"),
  supply: z.coerce.number({invalid_type_error: "Supply must be a number."}).min(0, "Supply cannot be negative"),
  demand: z.coerce.number({invalid_type_error: "Demand must be a number."}).min(0, "Demand cannot be negative"),
  fertilizerused: z.coerce.number({invalid_type_error: "Fertilizer amount must be a number."}).min(0, "Fertilizer used cannot be negative"),
  n_periods: z.coerce.number({invalid_type_error: "Forecast days must be a number."})
                 .int({ message: "Forecast days must be a whole number." })
                 .positive({ message: "Forecast days must be positive." })
                 .min(1, "Minimum 1 day forecast.")
                 .max(30, "Maximum 30 days forecast."), // This field is for UI, backend might ignore it for the specific python model
});

const PredictPriceForm = ({ onPredictionResult, onLoadingChange }) => {
  const [citiesForState, setCitiesForState] = useState([]);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Default to today
      state: '',
      city: '',
      croptype: '', // Example: 'Wheat'
      season: '',   // Example: 'Zaid'
      temp: 25,     // Example: 37
      rainfall: 100,  // Example: 200
      supply: 100,   // Example: 30
      demand: 50,    // Example: 10
      fertilizerused: 50, // Example: 100
      n_periods: 7, // Default forecast period (may not be used by current python model)
    },
  });

  const selectedState = watch('state');

  useEffect(() => {
    if (selectedState && MOCK_CITIES[selectedState]) {
      setCitiesForState(MOCK_CITIES[selectedState]);
      // Only reset city if the currently selected city is not in the new list
      const currentCity = watch('city');
      if (currentCity && !MOCK_CITIES[selectedState].includes(currentCity)) {
        setValue('city', '');
      }
    } else {
      setCitiesForState([]);
      setValue('city', '');
    }
  }, [selectedState, setValue, watch]);

  const onSubmit = async (formDataFromHook) => {
    if (onLoadingChange) onLoadingChange(true);
    try {
      // This is the payload structure the Node.js backend's Zod schema expects
      const payloadToNodeBackend = {
        date: formDataFromHook.date, // YYYY-MM-DD
        state: formDataFromHook.state,
        city: formDataFromHook.city,
        croptype: formDataFromHook.croptype,
        season: formDataFromHook.season,
        temp: formDataFromHook.temp, // Will be coerced to number by Zod
        rainfall: formDataFromHook.rainfall,
        supply: formDataFromHook.supply,
        demand: formDataFromHook.demand,
        fertilizerused: formDataFromHook.fertilizerused,
        n_periods: formDataFromHook.n_periods, // Sent to backend, controller decides if Python model uses it
      };
  
      console.log("Sending prediction payload to Node.js backend:", payloadToNodeBackend);
  
      const response = await axiosInstance.post('/api/predictions', payloadToNodeBackend);
  
      console.log("Prediction API response from Node.js:", response.data);
  
      if (response.data.success) {
        // Pass the API result and the original form data (for display context)
        onPredictionResult(response.data.data, formDataFromHook); 
        toast.success("Prediction successful!");
      } else {
        toast.error(response.data.error || "Prediction failed. Please check details.");
      }
    } catch (error) {
      console.error("Prediction form submission error:", error);
      const errorMsg = error.response?.data?.error || 
                       (error.response?.data?.errors ? "Validation error. Check fields." : error.message) || 
                       "An unexpected prediction error occurred.";
      toast.error(errorMsg);
      if (error.response?.data?.errors) {
          console.log("Validation errors from backend:", error.response.data.errors);
          // Optionally display field-specific errors if backend provides them in a structured way
      }
    } finally {
      if (onLoadingChange) onLoadingChange(false);
    }
  };
  

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 space-y-6 bg-white border border-gray-200 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-center text-primary">Get Crop Price Prediction</h2>
      
      {/* Row 1: Date & Forecast Period */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date *</label>
          <input
            type="date"
            id="date"
            {...register('date')}
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
        </div>

        <div>
          <label htmlFor="n_periods" className="block text-sm font-medium text-gray-700">Forecast Days (1-30) *</label>
          <input
            type="number"
            id="n_periods"
            {...register('n_periods')}
            min="1"
            max="30"
            placeholder="e.g., 7"
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.n_periods ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          />
          {errors.n_periods && <p className="mt-1 text-xs text-red-600">{errors.n_periods.message}</p>}
        </div>
      </div>

      {/* Row 2: Location & Crop */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
          <select
            id="state"
            {...register('state')}
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.state ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select State</option>
            {MOCK_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
          <select
            id="city"
            {...register('city')}
            disabled={!selectedState || citiesForState.length === 0}
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary disabled:bg-gray-100 sm:text-sm ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select City</option>
            {citiesForState.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
        </div>

        <div>
          <label htmlFor="croptype" className="block text-sm font-medium text-gray-700">Crop Type *</label>
          <select
            id="croptype"
            {...register('croptype')}
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.croptype ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Crop</option>
            {MOCK_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.croptype && <p className="mt-1 text-xs text-red-600">{errors.croptype.message}</p>}
        </div>
      </div>

      {/* Row 3: Agricultural Parameters */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-4">
        <div>
          <label htmlFor="season" className="block text-sm font-medium text-gray-700">Season *</label>
          <select
            id="season"
            {...register('season')}
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.season ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Season</option>
            {MOCK_SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.season && <p className="mt-1 text-xs text-red-600">{errors.season.message}</p>}
        </div>

        <div>
          <label htmlFor="temp" className="block text-sm font-medium text-gray-700">Temperature (°C) *</label>
          <input
            type="number"
            id="temp"
            {...register('temp')}
            step="0.1"
            placeholder="e.g., 25"
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.temp ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          />
          {errors.temp && <p className="mt-1 text-xs text-red-600">{errors.temp.message}</p>}
        </div>

        <div>
          <label htmlFor="rainfall" className="block text-sm font-medium text-gray-700">Rainfall (mm) *</label>
          <input
            type="number"
            id="rainfall"
            {...register('rainfall')}
            step="0.1"
            min="0"
            placeholder="e.g., 100"
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.rainfall ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          />
          {errors.rainfall && <p className="mt-1 text-xs text-red-600">{errors.rainfall.message}</p>}
        </div>

        <div>
          <label htmlFor="fertilizerused" className="block text-sm font-medium text-gray-700">Fertilizer Used (kg/ha) *</label>
          <input
            type="number"
            id="fertilizerused"
            {...register('fertilizerused')}
            min="0"
            placeholder="e.g., 50"
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.fertilizerused ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          />
          {errors.fertilizerused && <p className="mt-1 text-xs text-red-600">{errors.fertilizerused.message}</p>}
        </div>
      </div>

      {/* Row 4: Supply & Demand */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <div>
          <label htmlFor="supply" className="block text-sm font-medium text-gray-700">Supply (tons) *</label>
          <input
            type="number"
            id="supply"
            {...register('supply')}
            min="0"
            placeholder="e.g., 1000"
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.supply ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          />
          {errors.supply && <p className="mt-1 text-xs text-red-600">{errors.supply.message}</p>}
        </div>

        <div>
          <label htmlFor="demand" className="block text-sm font-medium text-gray-700">Demand (tons) *</label>
          <input
            type="number"
            id="demand"
            {...register('demand')}
            min="0"
            placeholder="e.g., 800"
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.demand ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          />
          {errors.demand && <p className="mt-1 text-xs text-red-600">{errors.demand.message}</p>}
        </div>
      </div>

      <div className="pt-4">
        <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3 md:w-auto md:px-6" 
            isLoading={isSubmitting} 
            disabled={isSubmitting}
        >
          {isSubmitting ? 'Predicting...' : 'Predict Price'}
        </Button>
      </div>
    </motion.form>
  );
};

export default PredictPriceForm;