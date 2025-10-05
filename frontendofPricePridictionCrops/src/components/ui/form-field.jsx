import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const FormField = ({
  label,
  name,
  type = 'text',
  register,
  error,
  placeholder,
  className,
  autoComplete,
  ...rest
}) => {
  return (
    <div className={cn('mb-4', className)}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          'w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
          error
            ? 'border-red-500 focus:ring-red-300'
            : 'border-gray-300 focus:ring-primary/30 focus:border-primary'
        )}
        {...register}
        {...rest}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
};

export default FormField; 