import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/button';

// Icons
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const DataIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const About = () => {
  return (
    <div className="bg-background">
      {/* 1. Intro Banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Empowering Smarter Farming with AI
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              CropPrice AI uses artificial intelligence to predict and monitor essential food crop prices across India.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <Button variant="primary" size="lg" className="font-semibold">
                  Get Started
                </Button>
              </Link>
              <Link to="#mission">
                <Button variant="outline" size="lg" className="font-semibold">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Our Mission */}
      <section id="mission" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Farmers in field" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
                style={{ maxHeight: '400px' }}
              />
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-primary mb-6">
                Why We Built This Platform
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                The Department of Consumer Affairs tracks daily crop prices across 550 centers. Our goal is to empower farmers and traders with real-time insights, AI predictions, alerts, and comparisons to make informed market decisions.
              </p>
              <p className="text-lg text-gray-700">
                By providing accurate price forecasts, we help agricultural stakeholders maximize their profits, reduce market inefficiencies, and contribute to a more sustainable food system.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI models with comprehensive market data to deliver accurate price predictions.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-card text-center"
              variants={fadeInUp}
            >
              <div className="flex justify-center mb-6">
                <ChartIcon />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">AI-Powered Predictions</h3>
              <p className="text-gray-600">
                Forecast prices using machine learning models that analyze past trends, seasonal patterns, and market dynamics.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-card text-center"
              variants={fadeInUp}
            >
              <div className="flex justify-center mb-6">
                <DataIcon />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Real-time Data</h3>
              <p className="text-gray-600">
                Daily updates from Agmarknet & government reports ensure you have the most current information at your fingertips.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-card text-center"
              variants={fadeInUp}
            >
              <div className="flex justify-center mb-6">
                <AlertIcon />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Price Alerts</h3>
              <p className="text-gray-600">
                Receive instant notifications when prices spike or fall, allowing you to make timely decisions in a volatile market.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. Regional Focus */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="md:w-1/4 flex justify-center">
              <LocationIcon />
            </div>
            <div className="md:w-3/4">
              <h2 className="text-3xl font-bold text-primary mb-4">Regional Focus</h2>
              <p className="text-lg text-gray-700">
                We support location-based price filtering. Choose your state and district to see local predictions and alerts personalized for you. Our platform covers all major agricultural regions across India, ensuring relevant insights no matter where you operate.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Who We Serve */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">Who We Serve</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform is designed for everyone in the agricultural ecosystem.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-card border-l-4 border-primary"
              variants={fadeInUp}
            >
              <h3 className="text-xl font-semibold text-primary mb-2">Farmers</h3>
              <p className="text-gray-600">
                Make informed decisions about when to sell your crops to maximize profits.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl shadow-card border-l-4 border-primary"
              variants={fadeInUp}
            >
              <h3 className="text-xl font-semibold text-primary mb-2">Traders</h3>
              <p className="text-gray-600">
                Stay ahead of market trends with predictive analytics and real-time alerts.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl shadow-card border-l-4 border-primary"
              variants={fadeInUp}
            >
              <h3 className="text-xl font-semibold text-primary mb-2">Researchers</h3>
              <p className="text-gray-600">
                Access comprehensive data for agricultural economic research and analysis.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl shadow-card border-l-4 border-primary"
              variants={fadeInUp}
            >
              <h3 className="text-xl font-semibold text-primary mb-2">Government</h3>
              <p className="text-gray-600">
                Monitor market trends to inform agricultural policy and market interventions.
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-16 bg-gradient-to-r from-blue-100 to-indigo-100 p-8 rounded-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <blockquote className="italic text-lg text-gray-700">
              "CropPrice AI has transformed how I plan my harvests. The price predictions have helped me increase my profits by knowing exactly when to sell."
              <footer className="mt-2 font-semibold">— Rajesh Kumar, Wheat Farmer from Punjab</footer>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Join thousands using CropPrice AI to gain the edge in agri-business</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Start making data-driven decisions today and stay ahead of market fluctuations.
            </p>
            <Link to="/register">
              <Button 
                variant="accent" 
                size="lg" 
                className="font-semibold px-8 py-3 text-lg"
              >
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About; 