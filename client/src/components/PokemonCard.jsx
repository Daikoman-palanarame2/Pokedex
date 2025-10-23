import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users } from 'lucide-react';
import { getPokemonImage, formatPokemonName, formatPokemonId, getTypeColor } from '../utils/api';

const PokemonCard = ({ pokemon, onAddToFavorites, onAddToTeam, isFavorite, isInTeam }) => {
  const { id, name, types } = pokemon;
  const pokemonImage = getPokemonImage(id);
  const pokemonName = formatPokemonName(name);
  const pokemonId = formatPokemonId(id);

  const handleAddToFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToFavorites(pokemon);
  };

  const handleAddToTeam = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToTeam(pokemon);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="pokemon-card p-6 cursor-pointer group"
    >
      <Link to={`/pokemon/${id}`} className="block">
        {/* Pokemon Image */}
        <div className="relative mb-4">
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={pokemonImage}
              alt={pokemonName}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={handleAddToFavorites}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'bg-pokemon-red text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-500 hover:text-pokemon-red'
              } shadow-lg`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <motion.span
                initial={{ scale: 1 }}
                animate={isFavorite ? { scale: 1.15 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="inline-flex"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.span>
            </button>
            
            <button
              onClick={handleAddToTeam}
              className={`p-2 rounded-full transition-colors ${
                isInTeam
                  ? 'bg-pokemon-blue text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-500 hover:text-pokemon-blue'
              } shadow-lg`}
              title={isInTeam ? 'Remove from team' : 'Add to team'}
            >
              <motion.span
                initial={{ scale: 1 }}
                animate={isInTeam ? { scale: 1.15 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="inline-flex"
              >
                <Users className={`w-4 h-4 ${isInTeam ? 'fill-current' : ''}`} />
              </motion.span>
            </button>
          </div>
        </div>

        {/* Pokemon Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
            {pokemonName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {pokemonId}
          </p>
          
          {/* Types */}
          <div className="flex justify-center space-x-2">
            {types.map((type, index) => (
              <span
                key={index}
                className="pokemon-type text-xs"
                style={{ backgroundColor: getTypeColor(type.type.name) }}
              >
                {formatPokemonName(type.type.name)}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PokemonCard;
