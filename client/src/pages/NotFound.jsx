import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* 404 Animation */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-32 h-32 mx-auto bg-gradient-to-r from-pokemon-red to-pokemon-blue rounded-full flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-pokemon-red">404</span>
              </div>
            </motion.div>
            
            {/* Floating Pokemon Balls */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -left-4 w-8 h-8 bg-pokemon-yellow rounded-full"
            />
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-pokemon-green rounded-full"
            />
            <motion.div
              animate={{ 
                y: [0, -5, 5, 0],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-4 -left-8 w-6 h-6 bg-pokemon-purple rounded-full"
            />
            <motion.div
              animate={{ 
                y: [0, 5, -5, 0],
                rotate: [0, -3, 3, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
              className="absolute -bottom-4 -right-8 w-6 h-6 bg-pokemon-orange rounded-full"
            />
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The Pokemon you're looking for has escaped! This page doesn't exist.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 btn-primary py-3 px-6"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 btn-secondary py-3 px-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Maybe you were looking for:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/gallery"
                className="text-pokemon-red hover:text-red-700 transition-colors"
              >
                Pokemon Gallery
              </Link>
              <Link
                to="/favorites"
                className="text-pokemon-red hover:text-red-700 transition-colors"
              >
                My Favorites
              </Link>
              <Link
                to="/login"
                className="text-pokemon-red hover:text-red-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
