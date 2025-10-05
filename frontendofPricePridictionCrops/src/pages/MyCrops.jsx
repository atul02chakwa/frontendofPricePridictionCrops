// src/pages/MyCrops.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth'; // Make sure this path is correct
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card'; // Adjust path if needed
import Button from '../components/ui/button'; // Adjust path if needed
import { Leaf, PlusCircle, Edit3, Trash2, CalendarDays, BarChartBig, MapPin, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as myCropsService from '../services/myCropsService'; // Adjust path if needed

// Mock data for dropdowns - Ideally, fetch these from dedicated API endpoints
// e.g., GET /api/locations/states, GET /api/locations/districts?state=... , GET /api/crops/available
const MOCK_AVAILABLE_CROPS = ['Rice', 'Wheat', 'Maize', 'Potato', 'Onion', 'Tomato', 'Cotton', 'Sugarcane', 'Soybean', 'Pulses'];
const MOCK_STATES = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Bihar', 'West Bengal', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala'];
const MOCK_DISTRICTS = {
  Punjab: ['Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar'],
  Haryana: ['Karnal', 'Hisar', 'Rohtak', 'Ambala'],
  'Uttar Pradesh': ['Lucknow', 'Meerut', 'Kanpur', 'Varanasi'],
  Maharashtra: ['Nashik', 'Pune', 'Nagpur', 'Aurangabad'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'],
  // Add more for other states if needed
};
const MOCK_QUANTITY_UNITS = ['kg', 'quintal', 'ton', 'acres', 'hectares', 'plants', 'other'];
const MOCK_YIELD_UNITS = ['kg', 'quintal', 'ton'];

const MyCrops = () => {
  const { user, loading: authLoading, updateUserInContext } = useAuth(); // Using updateUserInContext from Option B
  const [myManagedCrops, setMyManagedCrops] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCropId, setCurrentCropId] = useState(null); // Stores the _id of the crop being edited
  const [districtsForSelectedState, setDistrictsForSelectedState] = useState([]);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const initialFormData = {
    cropName: '',
    state: '',
    district: '',
    quantity: '',
    unit: 'quintal',
    plantingDate: '',
    expectedHarvestDate: '',
    actualHarvestDate: '',
    yieldAmount: '',
    yieldUnit: 'quintal',
    notes: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!authLoading) {
      if (user && user.myManagedCrops) {
        setMyManagedCrops(user.myManagedCrops);
      } else {
        setMyManagedCrops([]); // Handle case where user is loaded but has no managed crops or user is null
      }
      setIsLoadingPage(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (formData.state && MOCK_DISTRICTS[formData.state]) {
      setDistrictsForSelectedState(MOCK_DISTRICTS[formData.state]);
    } else {
      setDistrictsForSelectedState([]);
    }
    // Reset district if state changes AND the current district is not in the new list
    // Only do this if we are NOT in edit mode OR if the state being set is different from the original state of the item being edited
    if (formData.state) {
        const originalDistrictForEdit = isEditing && currentCropId ? myManagedCrops.find(c => c._id === currentCropId)?.district : null;
        if (!MOCK_DISTRICTS[formData.state]?.includes(formData.district) && formData.district !== originalDistrictForEdit) {
             setFormData(prev => ({ ...prev, district: '' }));
        }
    }

  }, [formData.state, isEditing, currentCropId, myManagedCrops, formData.district]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModalForCreate = () => {
    setIsEditing(false);
    setCurrentCropId(null);
    setFormData(initialFormData);
    setDistrictsForSelectedState([]);
    setIsModalOpen(true);
  };

  const openModalForEdit = (crop) => {
    setIsEditing(true);
    setCurrentCropId(crop._id); // MongoDB assigned _id for subdocuments
    
    const safeToISODateString = (dateStr) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toISOString().split('T')[0];
        } catch (e) {
            console.warn("Invalid date string for conversion:", dateStr);
            return '';
        }
    };

    setFormData({
        cropName: crop.cropName || '',
        state: crop.state || '',
        district: crop.district || '',
        quantity: crop.quantity == null ? '' : String(crop.quantity),
        unit: crop.unit || 'quintal',
        plantingDate: safeToISODateString(crop.plantingDate),
        expectedHarvestDate: safeToISODateString(crop.expectedHarvestDate),
        actualHarvestDate: safeToISODateString(crop.actualHarvestDate),
        yieldAmount: crop.yieldAmount == null ? '' : String(crop.yieldAmount),
        yieldUnit: crop.yieldUnit || 'quintal',
        notes: crop.notes || '',
    });

    if (crop.state && MOCK_DISTRICTS[crop.state]) {
      setDistrictsForSelectedState(MOCK_DISTRICTS[crop.state]);
    } else {
      setDistrictsForSelectedState([]);
    }
    setIsModalOpen(true);
  };

  const handleSubmitCrop = async (e) => {
    e.preventDefault();
    if (!formData.cropName || !formData.state || !formData.district) {
      toast.error("Crop Name, State, and District are required.");
      return;
    }

    setIsSubmittingForm(true);
    try {
      const payload = {
        ...formData,
        quantity: formData.quantity !== '' ? parseFloat(formData.quantity) : null,
        plantingDate: formData.plantingDate || null,
        expectedHarvestDate: formData.expectedHarvestDate || null,
        actualHarvestDate: formData.actualHarvestDate || null,
        yieldAmount: formData.yieldAmount !== '' ? parseFloat(formData.yieldAmount) : null,
      };
      // Remove empty string notes, otherwise backend Zod might complain if it has a minLength
      if (payload.notes === '') delete payload.notes;


      let response;
      if (isEditing && currentCropId) {
        response = await myCropsService.updateMyManagedCrop(currentCropId, payload);
        toast.success("Crop updated successfully!");
      } else {
        response = await myCropsService.addMyManagedCrop(payload);
        toast.success("Crop added successfully!");
      }

      if (response.success && response.data) {
        // response.data is the full updated user profile from the backend
        updateUserInContext(response.data);
      }
      setIsModalOpen(false);
    } catch (error) {
      const errorMsg = error?.error || error?.message || `Failed to ${isEditing ? 'update' : 'add'} crop.`;
      toast.error(errorMsg);
      console.error(`Error ${isEditing ? 'updating' : 'adding'} crop:`, error.response?.data || error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleDeleteCrop = async (cropMongoId) => {
    if (!window.confirm("Are you sure you want to remove this crop?")) return;
    setIsSubmittingForm(true);
    try {
      const response = await myCropsService.deleteMyManagedCrop(cropMongoId);
      toast.success("Crop removed successfully!");

      if (response.success && response.data) {
        // response.data is the full updated user profile
        updateUserInContext(response.data);
      }
    } catch (error) {
      const errorMsg = error?.error || error?.message || "Failed to remove crop.";
      toast.error(errorMsg);
      console.error("Error deleting crop:", error.response?.data || error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (authLoading || isLoadingPage) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="py-10 text-center">
            <p className="text-xl text-gray-600">Please log in to manage your crops.</p>
        </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-3xl font-bold md:text-4xl text-primary">
          My Managed Crops
        </h1>
        <Button onClick={openModalForCreate} variant="primary" icon={<PlusCircle size={20} />}>
          Add New Crop
        </Button>
      </div>

      {myManagedCrops.length === 0 ? (
        <Card className="py-10 text-center">
          <CardContent>
            <Leaf className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-600">You haven't added any crops yet.</p>
            <p className="text-sm text-gray-500">Click "Add New Crop" to get started tracking your farm produce.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myManagedCrops.map((crop) => (
            <motion.div
              key={crop._id} // Crucial: MongoDB subdocuments have an _id
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{crop.cropName}</CardTitle>
                    <Leaf className="w-6 h-6 text-secondary" />
                  </div>
                  <CardDescription className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" /> {crop.district || 'N/A'}, {crop.state || 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                    {crop.quantity != null && <p><strong>Quantity:</strong> {crop.quantity} {crop.unit}</p>}
                    {crop.plantingDate && <p className="flex items-center"><CalendarDays size={14} className="mr-1 text-primary"/> <strong>Planted:</strong> {new Date(crop.plantingDate).toLocaleDateString()}</p>}
                    {crop.expectedHarvestDate && <p className="flex items-center"><CalendarDays size={14} className="mr-1 text-accent"/> <strong>Est. Harvest:</strong> {new Date(crop.expectedHarvestDate).toLocaleDateString()}</p>}
                    {crop.actualHarvestDate && <p className="flex items-center"><CalendarDays size={14} className="mr-1 text-green-500"/> <strong>Harvested:</strong> {new Date(crop.actualHarvestDate).toLocaleDateString()}</p>}
                    {crop.yieldAmount != null && <p className="flex items-center"><BarChartBig size={14} className="mr-1 text-indigo-500"/> <strong>Yield:</strong> {crop.yieldAmount} {crop.yieldUnit}</p>}
                    {crop.notes && <p className="mt-2 text-xs italic text-gray-500"><strong>Notes:</strong> {crop.notes}</p>}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => openModalForEdit(crop)} icon={<Edit3 size={16}/>} disabled={isSubmittingForm}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteCrop(crop._id)} icon={<Trash2 size={16}/>} disabled={isSubmittingForm}>
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit Crop */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => !isSubmittingForm && setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary">
                {isEditing ? 'Edit Managed Crop' : 'Add New Managed Crop'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => !isSubmittingForm && setIsModalOpen(false)} className="p-1" disabled={isSubmittingForm}>
                <X size={20} />
              </Button>
            </div>
            <form onSubmit={handleSubmitCrop} className="space-y-4">
              <div>
                <label htmlFor="modalCropName" className="block text-sm font-medium text-gray-700">Crop Name *</label>
                <select id="modalCropName" name="cropName" value={formData.cropName} onChange={handleInputChange} required className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                  <option value="">Select Crop</option>
                  {MOCK_AVAILABLE_CROPS.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="modalState" className="block text-sm font-medium text-gray-700">State *</label>
                    <select id="modalState" name="state" value={formData.state} onChange={handleInputChange} required className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    <option value="">Select State</option>
                    {MOCK_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="modalDistrict" className="block text-sm font-medium text-gray-700">District *</label>
                    <select id="modalDistrict" name="district" value={formData.district} onChange={handleInputChange} required disabled={!formData.state || districtsForSelectedState.length === 0} className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary disabled:bg-gray-100">
                    <option value="">Select District</option>
                    {districtsForSelectedState.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                    </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="modalQuantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input type="number" id="modalQuantity" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="e.g., 100" className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" min="0" step="any" />
                </div>
                <div>
                    <label htmlFor="modalUnit" className="block text-sm font-medium text-gray-700">Unit</label>
                    <select id="modalUnit" name="unit" value={formData.unit} onChange={handleInputChange} className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    {MOCK_QUANTITY_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
              </div>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="modalPlantingDate" className="block text-sm font-medium text-gray-700">Planting Date</label>
                    <input type="date" id="modalPlantingDate" name="plantingDate" value={formData.plantingDate} onChange={handleInputChange} className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="modalExpectedHarvestDate" className="block text-sm font-medium text-gray-700">Expected Harvest Date</label>
                    <input type="date" id="modalExpectedHarvestDate" name="expectedHarvestDate" value={formData.expectedHarvestDate} onChange={handleInputChange} className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                </div>
              </div>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="modalActualHarvestDate" className="block text-sm font-medium text-gray-700">Actual Harvest Date</label>
                    <input type="date" id="modalActualHarvestDate" name="actualHarvestDate" value={formData.actualHarvestDate} onChange={handleInputChange} className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="modalYieldAmount" className="block text-sm font-medium text-gray-700">Yield Amount</label>
                    <input type="number" id="modalYieldAmount" name="yieldAmount" value={formData.yieldAmount} onChange={handleInputChange} placeholder="e.g., 120" className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" min="0" step="any"/>
                </div>
              </div>
               <div>
                    <label htmlFor="modalYieldUnit" className="block text-sm font-medium text-gray-700">Yield Unit</label>
                    <select id="modalYieldUnit" name="yieldUnit" value={formData.yieldUnit} onChange={handleInputChange} className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                      {MOCK_YIELD_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
              <div>
                <label htmlFor="modalNotes" className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea id="modalNotes" name="notes" value={formData.notes} onChange={handleInputChange} rows="3" placeholder="e.g., Variety, special conditions..." className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => !isSubmittingForm && setIsModalOpen(false)} disabled={isSubmittingForm}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmittingForm} disabled={isSubmittingForm}>
                  {isSubmittingForm ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Crop')}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyCrops;