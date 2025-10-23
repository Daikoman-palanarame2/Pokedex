import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { favoritesApi, getPokemonImage } from '../utils/api';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';

const Favorites = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    loadFavorites();
    loadTeam();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesApi.getFavorites();
      const favs = response.favorites || [];

      // Fetch full Pokemon details for each favorite to show types/images
      const detailedPromises = favs.map(async (fav) => {
        try {
          const data = await pokemonApi.getPokemon(fav.pokemonId);
          return { ...fav, details: data };
        } catch (err) {
          // If PokéAPI fails, return minimal structure
          return { ...fav, details: null };
        }
      });

      const detailedFavorites = await Promise.all(detailedPromises);
      setFavorites(detailedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeam = async () => {
    try {
      const response = await favoritesApi.getTeam();
      const teamMembers = response.team || [];

      const detailedPromises = teamMembers.map(async (member) => {
        try {
          const data = await pokemonApi.getPokemon(member.pokemonId);
          return { ...member, details: data };
        } catch (err) {
          return { ...member, details: null };
        }
      });

      const detailedTeam = await Promise.all(detailedPromises);
      setTeam(detailedTeam);
    } catch (error) {
      console.error('Error loading team:', error);
    }
  };

  const handleRemoveFromFavorites = async (pokemonId) => {
    try {
      await favoritesApi.removeFromFavorites(pokemonId);
      setFavorites(favorites.filter(fav => fav.pokemonId !== pokemonId));
      
      // Update user context
      const updatedUser = { ...user };
      updatedUser.favorites = updatedUser.favorites.filter(fav => fav.pokemonId !== pokemonId);
      updateUser(updatedUser);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleRemoveFromTeam = async (pokemonId) => {
    try {
      await favoritesApi.removeFromTeam(pokemonId);
      setTeam(team.filter(member => member.pokemonId !== pokemonId));
      
      // Update user context
      const updatedUser = { ...user };
      updatedUser.team = updatedUser.team.filter(member => member.pokemonId !== pokemonId);
      updateUser(updatedUser);
    } catch (error) {
      console.error('Error removing from team:', error);
    }
  };

  const handleAddToFavorites = async (pokemon) => {
    if (!isAuthenticated) {
      showToast('Please login to save favorites', { duration: 1200 });
      setTimeout(() => navigate('/login'), 800);
      return;
    }
    try {
      await favoritesApi.addToFavorites({
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
        pokemonImage: getPokemonImage(pokemon.id)
      });
      // reload favorites
      await loadFavorites();
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
    if (!isAuthenticated) {
      showToast('Please login to add team members', { duration: 1200 });
      setTimeout(() => navigate('/login'), 800);
      return;
    }
    try {
      await favoritesApi.addToTeam({
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
        pokemonImage: getPokemonImage(pokemon.id)
      });
      await loadTeam();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader size="large" text="Loading your favorites..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          My Pokemon Collection
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage your favorite Pokemon and build your dream team
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'favorites'
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Heart className="w-4 h-4 inline mr-2" />
            Favorites ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'team'
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Team ({team.length}/6)
          </button>
        </div>
      </div>

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Start exploring Pokemon and add them to your favorites!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => (
                <div key={favorite.pokemonId} className="relative">
                  <PokemonCard
                    pokemon={
                      favorite.details
                        ? favorite.details
                        : { id: favorite.pokemonId, name: favorite.pokemonName, types: [{ type: { name: 'normal' } }] }
                    }
                    onAddToFavorites={handleAddToFavorites}
                    onAddToTeam={handleAddToTeam}
                    isFavorite={true}
                    isInTeam={false}
                  />
                  <button
                    onClick={() => handleRemoveFromFavorites(favorite.pokemonId)}
                    className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {team.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No team members yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Build your dream team by adding Pokemon from the gallery!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {team.map((member) => (
                <div key={member.pokemonId} className="relative">
                  <PokemonCard
                    pokemon={
                      member.details
                        ? member.details
                        : { id: member.pokemonId, name: member.pokemonName, types: [{ type: { name: 'normal' } }] }
                    }
                    onAddToFavorites={handleAddToFavorites}
                    onAddToTeam={handleAddToTeam}
                    isFavorite={false}
                    isInTeam={true}
                  />
                  <button
                    onClick={() => handleRemoveFromTeam(member.pokemonId)}
                    className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove from team"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Favorites;
