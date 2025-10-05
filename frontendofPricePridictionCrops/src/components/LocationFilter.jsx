import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock data for states and districts
const STATES = [
  'Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal',
  'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala'
];

const DISTRICTS = {
  'Punjab': ['Amritsar', 'Ludhiana', 'Patiala', 'Jalandhar', 'Bathinda'],
  'Haryana': ['Ambala', 'Karnal', 'Panipat', 'Rohtak', 'Hisar'],
  'Maharashtra': ['Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy']
  // Add more districts for other states as needed
};

const LocationFilter = ({ onChange, className = '' }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);

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

  // Notify parent component when selection changes
  useEffect(() => {
    if (onChange) {
      onChange({
        state: selectedState,
        district: selectedDistrict
      });
    }
  }, [selectedState, selectedDistrict, onChange]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col sm:flex-row gap-4 ${className}`}
    >
      <div className="w-full sm:w-1/2">
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
          Select State
        </label>
        <select
          id="state"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          <option value="">All States</option>
          {STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      
      <div className="w-full sm:w-1/2">
        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
          Select District
        </label>
        <select
          id="district"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          disabled={!selectedState || districts.length === 0}
        >
          <option value="">All Districts</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};

export default LocationFilter; 