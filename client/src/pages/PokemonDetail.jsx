import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Users, Zap, Shield, Swords } from 'lucide-react';
import { pokemonApi, getPokemonImage, formatPokemonName, formatPokemonId, getTypeColor, favoritesApi } from '../utils/api';
import PokemonStats from '../components/PokemonStats';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInTeam, setIsInTeam] = useState(false);

  useEffect(() => {
    loadPokemonData();
  }, [id]);

  const loadPokemonData = async () => {
    try {
      setLoading(true);
      const [pokemonData, speciesData] = await Promise.all([
        pokemonApi.getPokemon(id),
        pokemonApi.getPokemonSpecies(id)
      ]);
      
      setPokemon(pokemonData);
      setSpecies(speciesData);
    } catch (error) {
      console.error('Error loading Pokemon data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      showToast('Please login to save favorites', { duration: 1200 });
      setTimeout(() => navigate('/login'), 800);
      return;
    }
    try {
      if (isFavorite) {
        await favoritesApi.removeFromFavorites(pokemon.id);
        setIsFavorite(false);
      } else {
        await favoritesApi.addToFavorites({
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonImage: getPokemonImage(pokemon.id)
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Favorite toggle failed:', error);
    }
  };

  const handleAddToTeam = async () => {
    if (!isAuthenticated) {
      showToast('Please login to add team members', { duration: 1200 });
      setTimeout(() => navigate('/login'), 800);
      return;
    }
    try {
      if (isInTeam) {
        await favoritesApi.removeFromTeam(pokemon.id);
        setIsInTeam(false);
      } else {
        await favoritesApi.addToTeam({
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonImage: getPokemonImage(pokemon.id)
        });
        setIsInTeam(true);
      }
    } catch (error) {
      console.error('Team toggle failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader size="large" text="Loading Pokemon details..." />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Pokemon not found
        </h2>
        <button
          onClick={() => navigate('/gallery')}
          className="btn-primary"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  const pokemonImage = getPokemonImage(pokemon.id);
  const pokemonName = formatPokemonName(pokemon.name);
  const pokemonId = formatPokemonId(pokemon.id);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Pokemon Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pokemon Image */}
          <div className="text-center">
            <div className="w-full h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={pokemonImage}
                alt={pokemonName}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Pokemon Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {pokemonName}
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
                {pokemonId}
              </p>
              
              {/* Types */}
              <div className="flex space-x-2 mb-6">
                {pokemon.types.map((type, index) => (
                  <span
                    key={index}
                    className="pokemon-type text-lg px-4 py-2"
                    style={{ backgroundColor: getTypeColor(type.type.name) }}
                  >
                    {formatPokemonName(type.type.name)}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            {species && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {species.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text || 'No description available.'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToFavorites}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  isFavorite
                    ? 'bg-pokemon-red text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              </button>

              <button
                onClick={handleAddToTeam}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  isInTeam
                    ? 'bg-pokemon-blue text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Users className={`w-5 h-5 ${isInTeam ? 'fill-current' : ''}`} />
                <span>{isInTeam ? 'Remove from Team' : 'Add to Team'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pokemon Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <PokemonStats stats={pokemon.stats} />
      </motion.div>

      {/* Pokemon Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Abilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-pokemon-yellow" />
            Abilities
          </h3>
          <div className="space-y-2">
            {pokemon.abilities.map((ability, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-gray-800 dark:text-gray-200">
                  {formatPokemonName(ability.ability.name)}
                </span>
                {ability.is_hidden && (
                  <span className="text-xs bg-pokemon-purple text-white px-2 py-1 rounded-full">
                    Hidden
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Physical Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-pokemon-blue" />
            Physical Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Height</span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold">
                {(pokemon.height / 10).toFixed(1)} m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Weight</span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold">
                {(pokemon.weight / 10).toFixed(1)} kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Base Experience</span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold">
                {pokemon.base_experience}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PokemonDetail;
