import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Users, Zap } from 'lucide-react';
import { pokemonApi, getPokemonImage, formatPokemonName, formatPokemonId, favoritesApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';

const Home = () => {
  const [featuredPokemon, setFeaturedPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    loadFeaturedPokemon();
  }, []);

  const loadFeaturedPokemon = async () => {
    try {
      setLoading(true);
      // Get random Pokemon IDs
      const randomIds = Array.from({ length: 6 }, () => Math.floor(Math.random() * 151) + 1);
      const pokemonPromises = randomIds.map(id => pokemonApi.getPokemon(id));
      const pokemonData = await Promise.all(pokemonPromises);
      setFeaturedPokemon(pokemonData);
    } catch (error) {
      console.error('Error loading featured Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setSearchLoading(true);
      const pokemon = await pokemonApi.getPokemon(searchTerm.toLowerCase());
      setSearchResults([pokemon]);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddToFavorites = async (pokemon) => {
    try {
      await favoritesApi.addToFavorites({
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
        pokemonImage: getPokemonImage(pokemon.id)
      });

      // Update local user context if available
      if (user) {
        const updatedUser = { ...user };
        updatedUser.favorites = updatedUser.favorites || [];
        updatedUser.favorites.push({
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonImage: getPokemonImage(pokemon.id),
          addedAt: new Date()
        });
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Add to favorites failed:', error);
    }
  };

  const handleAddToTeam = async (pokemon) => {
    try {
      await favoritesApi.addToTeam({
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
        pokemonImage: getPokemonImage(pokemon.id)
      });

      if (user) {
        const updatedUser = { ...user };
        updatedUser.team = updatedUser.team || [];
        updatedUser.team.push({
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonImage: getPokemonImage(pokemon.id),
          addedAt: new Date()
        });
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Add to team failed:', error);
    }
  };

  const isPokemonFavorite = (pokemon) => {
    if (!user || !user.favorites) return false;
    return user.favorites.some(f => String(f.pokemonId) === String(pokemon.id));
  };

  const isPokemonInTeam = (pokemon) => {
    if (!user || !user.team) return false;
    return user.team.some(t => String(t.pokemonId) === String(pokemon.id));
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-pokemon-red via-pokemon-blue to-pokemon-yellow rounded-2xl text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Pokedex
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover, collect, and build your dream Pokemon team
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Pokemon by name or ID..."
                className="w-full px-4 py-3 pr-12 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Search Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onAddToFavorites={handleAddToFavorites}
                onAddToTeam={handleAddToTeam}
                isFavorite={isPokemonFavorite(pokemon)}
                isInTeam={isPokemonInTeam(pokemon)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <Star className="w-12 h-12 text-pokemon-yellow mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Discover Pokemon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Explore hundreds of Pokemon with detailed information, stats, and abilities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <Users className="w-12 h-12 text-pokemon-blue mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Build Your Team
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage your dream Pokemon team with up to 6 Pokemon.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <Zap className="w-12 h-12 text-pokemon-red mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Save Favorites
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Keep track of your favorite Pokemon and access them anytime.
          </p>
        </motion.div>
      </section>

      {/* Featured Pokemon Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Featured Pokemon
          </h2>
          <button
            onClick={loadFeaturedPokemon}
            className="btn-secondary"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="large" text="Loading featured Pokemon..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {featuredPokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onAddToFavorites={handleAddToFavorites}
                onAddToTeam={handleAddToTeam}
                isFavorite={isPokemonFavorite(pokemon)}
                isInTeam={isPokemonInTeam(pokemon)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
