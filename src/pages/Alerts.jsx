import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import Button from '../components/ui/button';
import FormField from '../components/ui/form-field';
import { BellRing, PlusCircle, Edit, Trash2, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as cropPriceService from '../services/cropPriceService';

const Alerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [cropOptions, setCropOptions] = useState([]);

  const [formData, setFormData] = useState({
    cropName: '',
    location: '',
    thresholdPercentage: 10,
    alertType: 'both',
  });

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const response = await cropPriceService.getPriceAlerts();
      setAlerts(response.data || []);
    } catch (error) {
      toast.error('Failed to load alerts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'thresholdPercentage' ? Number(value) : value }));
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
    setFormData({
      cropName: alert.cropName || '',
      location: alert.location || '',
      thresholdPercentage: alert.thresholdPercentage || 10,
      alertType: alert.alertType || 'both',
    });
    setIsModalOpen(true);
  };

  const handleSubmitAlert = async (e) => {
    e.preventDefault();
    if (!formData.cropName || !formData.location) {
      toast.error('Please select crop and location.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && currentAlert) {
        await cropPriceService.updatePriceAlert(currentAlert._id, formData);
        toast.success('Alert updated successfully!');
      } else {
        await cropPriceService.createPriceAlert(formData);
        toast.success('Alert created successfully!');
      }
      setIsModalOpen(false);
      await fetchAlerts();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} alert.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    try {
      await cropPriceService.deletePriceAlert(alertId);
      toast.success('Alert deleted successfully!');
      await fetchAlerts();
    } catch (error) {
      toast.error('Failed to delete alert.');
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAlerts} icon={<RefreshCw size={18}/>}>
            Refresh
          </Button>
          <Button onClick={openModalForCreate} variant="primary" icon={<PlusCircle size={20} />}>
            Create New Alert
          </Button>
        </div>
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
              key={alert._id}
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
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteAlert(alert._id)} icon={<Trash2 size={16}/>}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
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
                <input
                  id="cropName"
                  name="cropName"
                  type="text"
                  value={formData.cropName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Wheat, Rice, Potato"
                  className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Punjab - Ludhiana"
                  className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
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
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
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
