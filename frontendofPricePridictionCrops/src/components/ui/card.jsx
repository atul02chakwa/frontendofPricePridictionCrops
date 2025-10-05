import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-white',
    glass: 'bg-white/80 backdrop-blur-md border border-white/20',
    outline: 'bg-white border border-gray-200',
    colored: 'bg-primary/5',
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl shadow-card hover:shadow-cardHover p-6',
        variants[variant],
        className
      )}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 className={cn('text-xl font-semibold text-primary', className)} {...props}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className, ...props }) => {
  return (
    <p className={cn('text-sm text-gray-600', className)} {...props}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return <div className={cn('', className)} {...props}>{children}</div>;
};

const CardFooter = ({ children, className, ...props }) => {
  return (
    <div className={cn('flex items-center pt-4', className)} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }; 