// src/pages/Alerts.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import Button from '../components/ui/button';
import FormField from '../components/ui/form-field';
import { BellRing, PlusCircle, Edit, Trash2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
// import * as cropPriceService from '../services/cropPriceService'; // Uncomment when API is ready
// import * as locationService from '../services/locationService'; // Uncomment when API is ready

// Mock data for now
const MOCK_CROPS = ['Rice', 'Wheat', 'Maize', 'Potato', 'Onion', 'Tomato'];
const MOCK_LOCATIONS = ['Punjab - Ludhiana', 'Haryana - Karnal', 'UP - Lucknow', 'Maharashtra - Nashik'];

const Alerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);

  const [formData, setFormData] = useState({
    cropName: '',
    location: '',
    thresholdPercentage: 10, // Default 10%
    alertType: 'both', // 'rise', 'fall', 'both'
  });

  // Fetch alerts (mocked for now)
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call:
        // const userAlerts = await cropPriceService.getPriceAlerts();
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API
        const mockUserAlerts = [
          { id: '1', cropName: 'Wheat', location: 'Punjab - Ludhiana', thresholdPercentage: 5, alertType: 'rise' },
          { id: '2', cropName: 'Potato', location: 'UP - Lucknow', thresholdPercentage: 15, alertType: 'fall' },
          { id: '3', cropName: 'Onion', location: 'Maharashtra - Nashik', thresholdPercentage: 10, alertType: 'both' },
        ];
        setAlerts(mockUserAlerts);
      } catch (error) {
        toast.error("Failed to load alerts.");
        console.error("Error fetching alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModalForCreate = () => {
    setIsEditing(false);
    setCurrentAlert(null);
    setFormData({ cropName: '', location: '', thresholdPercentage: 10, alertType: 'both' });
    setIsModalOpen(true);
  };

  const openModalForEdit = (alert) => {
    setIsEditing(true);
    setCurrentAlert(alert);
    setFormData({ ...alert });
    setIsModalOpen(true);
  };

  const handleSubmitAlert = async (e) => {
    e.preventDefault();
    if (!formData.cropName || !formData.location) {
      toast.error("Please select crop and location.");
      return;
    }
    
    setIsLoading(true);
    try {
      if (isEditing && currentAlert) {
        // Replace with actual API call:
        // await cropPriceService.updatePriceAlert(currentAlert.id, formData);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
        setAlerts(alerts.map(a => a.id === currentAlert.id ? { ...formData, id: currentAlert.id } : a));
        toast.success("Alert updated successfully!");
      } else {
        // Replace with actual API call:
        // const newAlert = await cropPriceService.createPriceAlert(formData);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
        const newAlert = { ...formData, id: Date.now().toString() }; // Mock ID
        setAlerts([...alerts, newAlert]);
        toast.success("Alert created successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} alert.`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} alert:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    setIsLoading(true);
    try {
      // Replace with actual API call:
      // await cropPriceService.deletePriceAlert(alertId);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
      setAlerts(alerts.filter(a => a.id !== alertId));
      toast.success("Alert deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete alert.");
      console.error("Error deleting alert:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && alerts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
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
          Price Alerts Management
        </h1>
        <Button onClick={openModalForCreate} variant="primary" icon={<PlusCircle size={20} />}>
          Create New Alert
        </Button>
      </div>

      {alerts.length === 0 && !isLoading ? (
        <Card className="py-10 text-center">
          <CardContent>
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-600">You have no active alerts.</p>
            <p className="text-sm text-gray-500">Click "Create New Alert" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{alert.cropName}</CardTitle>
                    <BellRing className={`h-6 w-6 ${alert.alertType === 'rise' ? 'text-green-500' : alert.alertType === 'fall' ? 'text-red-500' : 'text-yellow-500'}`} />
                  </div>
                  <CardDescription>{alert.location}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600">
                    Alert if price {alert.alertType === 'rise' ? 'rises' : alert.alertType === 'fall' ? 'falls' : 'changes'} by 
                    <span className="font-semibold text-primary"> {alert.thresholdPercentage}%</span>.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => openModalForEdit(alert)} icon={<Edit size={16}/>}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteAlert(alert.id)} icon={<Trash2 size={16}/>}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Alert Creation/Editing Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)} // Close on backdrop click
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary">
                {isEditing ? 'Edit Alert' : 'Create New Alert'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="p-1">
                <X size={20} />
              </Button>
            </div>
            <form onSubmit={handleSubmitAlert} className="space-y-4">
              <div>
                <label htmlFor="cropName" className="block text-sm font-medium text-gray-700">Crop</label>
                <select id="cropName" name="cropName" value={formData.cropName} onChange={handleInputChange} required className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                  <option value="">Select Crop</option>
                  {MOCK_CROPS.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <select id="location" name="location" value={formData.location} onChange={handleInputChange} required className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                  <option value="">Select Location</option>
                  {MOCK_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              <FormField
                label="Threshold Percentage (%)"
                name="thresholdPercentage"
                type="number"
                value={formData.thresholdPercentage}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                min="1"
                max="100"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
               <div>
                <label htmlFor="alertType" className="block text-sm font-medium text-gray-700">Alert Type</label>
                <select id="alertType" name="alertType" value={formData.alertType} onChange={handleInputChange} className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                  <option value="both">Price Rise or Fall</option>
                  <option value="rise">Price Rise Only</option>
                  <option value="fall">Price Fall Only</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  {isEditing ? 'Save Changes' : 'Create Alert'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Alerts;