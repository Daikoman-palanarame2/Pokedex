import React, { useEffect, useState } from 'react';
import { AlertTriangle, Database, Wifi } from 'lucide-react';
import { api } from '../utils/api';

const DatabaseStatusBanner = () => {
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkHealth = async () => {
      try {
        const res = await api.get('/health');
        if (mounted && res.data?.dbConnected) {
          setDbConnected(true);
        }
      } catch (error) {
        // ignore: keep banner visible when health check fails
        console.debug('Health check failed:', error.message || error);
      }
    };

    checkHealth();

    return () => {
      mounted = false;
    };
  }, []);

  if (dbConnected) return null;

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 mb-6">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Database Unavailable
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p className="mb-2">
              User features (registration, login, favorites, teams) are temporarily disabled.
            </p>
            <div className="space-y-1">
              <p className="flex items-center">
                <Database className="w-4 h-4 mr-2" />
                <span>Available features: Browse Pokemon, Search, View Details, Dark/Light Mode</span>
              </p>
              <p className="flex items-center">
                <Wifi className="w-4 h-4 mr-2" />
                <span>Setup MongoDB to enable user features - see MONGODB_SETUP.md</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatusBanner;
