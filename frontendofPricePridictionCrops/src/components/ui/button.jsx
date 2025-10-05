import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon,
  disabled = false,
  onClick,
  type = 'button',
  isLoading = false,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light',
    secondary: 'bg-secondary text-white hover:bg-secondary-light',
    accent: 'bg-accent text-white hover:bg-accent-light',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/5',
    ghost: 'bg-transparent text-primary hover:bg-primary/5',
  };

  const sizes = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <motion.button
      type={type}
      className={cn(
        'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 inline-flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button; 