// src/components/PredictPriceForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Button from './ui/button';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axios';

const MOCK_CROPS = ['Apple', 'Banana', 'Bhindi', 'Bitter Gourd', 'Brinjal', 'Cabbage', 'Capsicum',
  'Carrot', 'Cauliflower', 'Cluster Beans', 'Colacasia', 'Cucumbar', 'Dry Fodder',
  'French Beans', 'Grapes', 'Green Chilli', 'Green Fodder', 'Guava', 'Leafy Vegetable',
  'Lemon', 'Maize', 'Mango', 'Methi(Leaves)', 'Mousambi', 'Onion', 'Pear',
  'Pomegranate', 'Potato', 'Pumpkin', 'Raddish', 'rice', 'Sponge Gourd', 'Sweet Potato',
  'Tinda', 'Tomato', 'Wheat', 'blackgram', 'chickpea', 'coconut', 'coffee',
  'cotton', 'jute', 'kidneybeans', 'lentil', 'mothbeans', 'mungbean',
  'muskmelon', 'orange', 'papaya', 'pigeonbeans', 'watermelon'];

const MOCK_STATES = ['Andaman and Nicobar Island', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

const predictionFormSchema = z.object({
  date: z.string().min(1, "Date is required").refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)), {
    message: "Please select a valid date."
  }),
  state: z.string().min(1, "Select a state"),
  district: z.string().min(1, "Select a district"),
  crop: z.string().min(1, "Select a crop"),
  production: z.coerce.number({ invalid_type_error: "Enter a number" }).positive("Production must be positive"),
});

const PredictPriceForm = ({ onPredictionResult, onLoadingChange }) => {
  const [districtsForState, setDistrictsForState] = useState([]);
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      state: '', district: '', crop: '', production: 100,
    },
  });

  const selectedState = watch('state');

  useEffect(() => {
    setDistrictsForState([]);
    setValue('district', '');
    if (selectedState) {
      axiosInstance.get('/api/locations/districts', { params: { state: selectedState } })
        .then(res => { if (res.data?.data) setDistrictsForState(res.data.data); })
        .catch(() => {});
    }
  }, [selectedState, setValue]);

  const onSubmit = async (formData) => {
    if (onLoadingChange) onLoadingChange(true);
    try {
      const payload = {
        date: formData.date,
        state: formData.state,
        district: formData.district,
        crop: formData.crop,
        production: formData.production,
      };
      const response = await axiosInstance.post('/api/predictions', payload);
      if (response.data.success) {
        onPredictionResult(response.data.data, formData);
        toast.success("Prediction successful!");
      } else {
        toast.error(response.data.error || "Prediction failed.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || "Prediction error";
      toast.error(errorMsg);
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
      <h2 className="text-2xl font-semibold text-center text-primary">Crop Price Prediction</h2>
      <p className="text-sm text-center text-gray-500">Enter the details below to get a predicted market price</p>

      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
          <select id="state" {...register('state')}
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.state ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Select State</option>
            {MOCK_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
        </div>
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">District *</label>
          <select id="district" {...register('district')} disabled={!selectedState}
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary disabled:bg-gray-100 sm:text-sm ${errors.district ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Select District</option>
            {districtsForState.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date *</label>
          <input type="date" id="date" {...register('date')}
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.date ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
        </div>
        <div>
          <label htmlFor="crop" className="block text-sm font-medium text-gray-700">Crop *</label>
          <select id="crop" {...register('crop')}
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.crop ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Select Crop</option>
            {MOCK_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.crop && <p className="mt-1 text-xs text-red-600">{errors.crop.message}</p>}
        </div>
        <div>
          <label htmlFor="production" className="block text-sm font-medium text-gray-700">Production (quintals) *</label>
          <input type="number" id="production" {...register('production')} min="1" placeholder="e.g., 100"
            className={`mt-1 block w-full p-2.5 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.production ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.production && <p className="mt-1 text-xs text-red-600">{errors.production.message}</p>}
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" variant="primary" className="w-full py-3 md:w-auto md:px-6" isLoading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? 'Predicting...' : 'Predict Price'}
        </Button>
      </div>
    </motion.form>
  );
};

export default PredictPriceForm;