// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card'; // Removed CardFooter for this simpler display
// import Button from '../components/ui/button'; // Not used for quick actions in this simplified version
import { Wheat, BellRing, LineChart as LineChartIcon } from 'lucide-react'; // Removed unused icons
import PredictPriceForm from '../components/PredictPriceForm';
// Import necessary Recharts components if you decide to plot a single point or a simplified chart later
// For now, we'll just display the single value.
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    trackedCrops: 0,
    activeAlerts: 0,
    recentPredictionsMade: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const [predictionResult, setPredictionResult] = useState(null); // Stores the { predicted_price: ... } object
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [lastPredictionInput, setLastPredictionInput] = useState(null); // To store input for display

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingStats(true);
      await new Promise(resolve => setTimeout(resolve, 700));
      
      setDashboardStats({
        trackedCrops: user?.myManagedCrops?.length || 0,
        activeAlerts: user?.alertPreferences?.alerts?.length || 0,
        recentPredictionsMade: 5, // Mock
      });
      setIsLoadingStats(false);
    };

    if (user) {
      fetchDashboardData();
    } else {
      setIsLoadingStats(false);
    }
  }, [user]);

  const handlePredictionResult = (result, formData) => { // Accept formData
    console.log("Dashboard received prediction result:", result);
    setPredictionResult(result); // result is expected to be like { predicted_price: 17.13 }
    setLastPredictionInput(formData); // Store the input used for this prediction
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // const quickActionVariants = { // Keep if you re-add quick actions
  //   hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" },
  //   tap: { scale: 0.95 }
  // };

  if (isLoadingStats && !user) {
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold md:text-4xl text-primary">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Here's your crop price intelligence dashboard.
        </p>
      </motion.div>

      {isLoadingStats ? (
         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-32 bg-gray-200 animate-pulse"></Card>
            ))}
         </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div variants={cardVariants}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Managed Crops</CardTitle>
                <Wheat className="w-5 h-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.trackedCrops}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <BellRing className="w-5 h-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.activeAlerts}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Recent Predictions</CardTitle>
                <LineChartIcon className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.recentPredictionsMade}</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <PredictPriceForm 
            // Pass the formData from the form along with the result
            onPredictionResult={(result, formData) => handlePredictionResult(result, formData)}
            onLoadingChange={setIsPredictionLoading}
        />
      </motion.div>

      {isPredictionLoading && (
        <motion.div 
            className="flex items-center justify-center p-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="ml-3 text-primary">Fetching prediction...</p>
        </motion.div>
      )}

      {predictionResult && lastPredictionInput && !isPredictionLoading && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-xl text-primary">
                    Prediction Result
                </CardTitle>
                <CardDescription>
                    For {lastPredictionInput.crop} in {lastPredictionInput.district}, {lastPredictionInput.state} on {new Date(lastPredictionInput.date).toLocaleDateString()} ({lastPredictionInput.production} quintals)
                </CardDescription>
            </CardHeader>
            <CardContent>
                {(predictionResult.predictedPrice !== undefined) ? (
                <div>
                    <p className="text-lg text-gray-700">
                        Predicted Price: 
                        <span className="ml-2 text-2xl font-bold text-primary">
                            ₹{Number(predictionResult.predictedPrice).toFixed(2)}
                        </span>
                    </p>
                    {/* 
                      If your Python model for this endpoint *can* return a time series
                      for `n_periods` (even if it's not doing so now), you could add
                      the chart back here, adjusting its data source.
                      For a single point, a chart isn't very useful.
                    */}
                    {/* 
                    <div className="mt-4 text-sm text-gray-600">
                        <p>Input Parameters:</p>
                        <ul className="pl-5 list-disc">
                            <li>Season: {lastPredictionInput.season}</li>
                            <li>Temperature: {lastPredictionInput.temp}°C</li>
                            <li>Rainfall: {lastPredictionInput.rainfall} mm</li>
                            <li>Supply: {lastPredictionInput.supply} tons</li>
                            <li>Demand: {lastPredictionInput.demand} tons</li>
                            <li>Fertilizer: {lastPredictionInput.fertilizerused} kg/ha</li>
                        </ul>
                    </div> 
                    */}
                </div>
                ) : (
                <p className="py-4 text-center text-gray-500">
                    Prediction data received, but the 'predicted_price' field is missing or invalid.
                </p>
                )}
                {/* Optional: Display raw data for debugging */}
                {/* <pre className="p-4 mt-4 overflow-x-auto text-xs bg-gray-100 rounded">
                {JSON.stringify({ input: lastPredictionInput, output: predictionResult }, null, 2)}
                </pre> */}
            </CardContent>
            </Card>
        </motion.div>
      )}

      {/* Quick Actions - Can be kept or removed if form is primary focus */}
      {/* ... your existing quick actions or remove if not needed ... */}
    </motion.div>
  );
};

export default Dashboard;