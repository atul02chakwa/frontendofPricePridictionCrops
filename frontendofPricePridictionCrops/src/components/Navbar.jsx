import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Alerts', path: '/alerts' },
    { name: 'My Crops', path: '/my-crops' },
    { name: 'About', path: '/about' }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg 
                className="h-8 w-8 text-secondary" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">CropPrice AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'bg-primary-light text-white'
                    : 'text-white hover:bg-primary-light/20 hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Authentication Buttons */}
            <div className="ml-4 flex items-center">
              {isAuthenticated ? (
                <>
                  <Link to="/profile">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mr-2"
                    >
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="text-white border-white hover:bg-white/10"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mr-2"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-white border-white hover:bg-white/10"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-secondary hover:bg-primary-dark focus:outline-none"
            >
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-primary border-t border-primary-dark"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === link.path
                        ? 'bg-primary-light text-white'
                        : 'text-white hover:bg-primary-light/20 hover:text-accent'
                    }`}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              {/* Auth buttons for mobile */}
              <div className="mt-4 space-y-2 p-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="block w-full"
                      onClick={toggleMenu}
                    >
                      <Button 
                        variant="secondary" 
                        className="w-full justify-center"
                      >
                        Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                      className="w-full justify-center text-white border-white hover:bg-white/10"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full"
                      onClick={toggleMenu}
                    >
                      <Button 
                        variant="secondary" 
                        className="w-full justify-center"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full"
                      onClick={toggleMenu}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full justify-center text-white border-white hover:bg-white/10"
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 