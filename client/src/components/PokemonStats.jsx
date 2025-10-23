import React from 'react';
import { motion } from 'framer-motion';

const PokemonStats = ({ stats }) => {
  const statNames = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    speed: 'Speed'
  };

  const getStatColor = (statName) => {
    const colors = {
      hp: 'bg-red-500',
      attack: 'bg-orange-500',
      defense: 'bg-blue-500',
      'special-attack': 'bg-purple-500',
      'special-defense': 'bg-green-500',
      speed: 'bg-yellow-500'
    };
    return colors[statName] || 'bg-gray-500';
  };

  const getStatPercentage = (baseStat) => {
    return Math.min((baseStat / 255) * 100, 100);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Base Stats
      </h3>
      
      {stats.map((stat, index) => {
        const statName = stat.stat.name;
        const baseStat = stat.base_stat;
        const percentage = getStatPercentage(baseStat);
        
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {statNames[statName] || statName}
              </span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {baseStat}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-2 rounded-full ${getStatColor(statName)}`}
              />
            </div>
          </div>
        );
      })}
      
      {/* Total Stats */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Total
          </span>
          <span className="text-lg font-bold text-pokemon-red">
            {stats.reduce((total, stat) => total + stat.base_stat, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PokemonStats;
