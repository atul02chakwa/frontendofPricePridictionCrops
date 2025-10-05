import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

const FeatureCard = ({ title, description, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        ease: "easeOut" 
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Additional content can go here */}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard; 