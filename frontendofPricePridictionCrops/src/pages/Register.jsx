import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { registerSchema } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import FormField from '../components/ui/form-field';
import Button from '../components/ui/button';

const Register = () => {
  const [apiError, setApiError] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  // Initialize react-hook-form with zod validation
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setApiError('');
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setApiError(error.message || 'Failed to register. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-card"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Create Account</h2>
          <p className="mt-2 text-gray-600">Join our platform for crop price predictions</p>
        </div>
        
        {apiError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-100 text-red-700 rounded-md"
          >
            {apiError}
          </motion.div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Full Name"
            name="name"
            type="text"
            register={register('name')}
            error={errors.name}
            placeholder="John Doe"
            autoComplete="name"
          />
          
          <FormField
            label="Email Address"
            name="email"
            type="email"
            register={register('email')}
            error={errors.email}
            placeholder="your@email.com"
            autoComplete="email"
          />
          
          <FormField
            label="Password"
            name="password"
            type="password"
            register={register('password')}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register('confirmPassword')}
            error={errors.confirmPassword}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          
          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register; 