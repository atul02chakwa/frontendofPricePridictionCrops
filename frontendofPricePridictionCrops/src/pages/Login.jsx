import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { loginSchema } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import FormField from '../components/ui/form-field';
import Button from '../components/ui/button';
import { toast } from "react-hot-toast";

const Login = () => {
  const [apiError, setApiError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return URL from location state or default to profile
  const from = location.state?.from || '/profile';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      console.log('Attempting login with:', { email: data.email }); // Debug log
      await login(data.email, data.password); // Use login from AuthContext
      console.log('Login successful, navigating to:', from); // Debug log
      toast.success("Login successful!");
      navigate(from, { replace: true }); // Navigate to the intended page
    } catch (error) {
      console.error('Login error:', error); // Debug log
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
      setApiError(errorMessage);
      toast.error(errorMessage);
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
          <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-100 text-red-700 rounded-md text-sm"
          >
            {apiError}
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
            autoComplete="current-password"
          />

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-light font-medium">
                Register
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
