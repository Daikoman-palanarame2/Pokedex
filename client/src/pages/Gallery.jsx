import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { pokemonApi, getPokemonImage, favoritesApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';

const Gallery = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [typePokemonList, setTypePokemonList] = useState([]); // when a type is selected, store full list
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const POKEMON_PER_PAGE = 20;

  useEffect(() => {
    loadPokemon();
    loadTypes();
  }, []);

  useEffect(() => {
    if (selectedType) {
      // Reset to first page when type filter changes
      setCurrentPage(0);
      loadPokemonByType(selectedType, 0);
    } else {
      loadPokemon();
    }
  }, [selectedType]);

  const loadPokemon = async (offset = 0) => {
    try {
      setLoading(true);
      const response = await pokemonApi.getPokemonList(offset, POKEMON_PER_PAGE);
      
      // Get detailed Pokemon data
      const pokemonPromises = response.results.map(async (pokemon) => {
        const pokemonData = await pokemonApi.getPokemon(pokemon.name);
        return pokemonData;
      });
      
      const pokemonData = await Promise.all(pokemonPromises);
      setPokemon(pokemonData);
      setFilteredPokemon(pokemonData);
      setTotalPages(Math.ceil(response.count / POKEMON_PER_PAGE));
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTypes = async () => {
    try {
      const response = await pokemonApi.getTypes();
      setTypes(response.results);
    } catch (error) {
      console.error('Error loading types:', error);
    }
  };

  const loadPokemonByType = async (typeName, offset = 0) => {
    try {
      setLoading(true);
      const response = await pokemonApi.getPokemonByType(typeName);

      // response.pokemon is an array of { pokemon: { name, url }, slot }
      const allPokemonOfType = response.pokemon.map(p => p.pokemon);
      setTypePokemonList(allPokemonOfType);

      // Compute pagination
      const start = offset;
      const slice = allPokemonOfType.slice(start, start + POKEMON_PER_PAGE);

      // Fetch detailed Pokemon data for the current page slice
      const pokemonPromises = slice.map(async (pokemonEntry) => {
        const pokemonData = await pokemonApi.getPokemon(pokemonEntry.name);
        return pokemonData;
      });

      const pokemonData = await Promise.all(pokemonPromises);
      setPokemon(pokemonData);
      setFilteredPokemon(pokemonData);
      setTotalPages(Math.ceil(allPokemonOfType.length / POKEMON_PER_PAGE));
    } catch (error) {
      console.error('Error loading Pokemon by type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      const offset = newPage * POKEMON_PER_PAGE;

      if (selectedType) {
        // When a type is selected, load the corresponding slice from the type list
        loadPokemonByType(selectedType, offset);
      } else {
        loadPokemon(offset);
      }
    }
  };

  const handleTypeFilter = (typeName) => {
    setSelectedType(typeName);
    setCurrentPage(0);
  };

  const handleAddToFavorites = async (pokemon) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      let rollback = null;
      if (user) {
        const updatedUser = { ...user };
        updatedUser.favorites = updatedUser.favorites || [];
        updatedUser.favorites.push({
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonImage: getPokemonImage(pokemon.id),
          addedAt: new Date()
        });
        const previousUser = { ...user };
        rollback = () => updateUser(previousUser);
        updateUser(updatedUser);
      }

      await favoritesApi.addToFavorites({
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
        pokemonImage: getPokemonImage(pokemon.id)
      });

      rollback = null;
    } catch (error) {
      console.error('Add to favorites failed:', error);
      if (typeof rollback === 'function') rollback();
    }
  };

  const handleAddToTeam = async (pokemon) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      let rollback = null;
      if (user) {
        const updatedUser = { ...user };
        updatedUser.team = updatedUser.team || [];
        updatedUser.team.push({
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonImage: getPokemonImage(pokemon.id),
          addedAt: new Date()
        });
        const previousUser = { ...user };
        rollback = () => updateUser(previousUser);
        updateUser(updatedUser);
      }

      await favoritesApi.addToTeam({
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
        pokemonImage: getPokemonImage(pokemon.id)
      });

      rollback = null;
    } catch (error) {
      console.error('Add to team failed:', error);
      if (typeof rollback === 'function') rollback();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Pokemon Gallery
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore the amazing world of Pokemon
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Filter by Type
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTypeFilter('')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === ''
                ? 'bg-pokemon-red text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Types
          </button>
          
          {types.map((type) => (
            <button
              key={type.name}
              onClick={() => handleTypeFilter(type.name)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === type.name
                  ? 'bg-pokemon-red text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Pokemon Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="large" text="Loading Pokemon..." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPokemon.map((pokemon) => {
              const isFavorite = user && user.favorites && user.favorites.some(f => String(f.pokemonId) === String(pokemon.id));
              const isInTeam = user && user.team && user.team.some(t => String(t.pokemonId) === String(pokemon.id));

              return (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onAddToFavorites={handleAddToFavorites}
                  onAddToTeam={handleAddToTeam}
                  isFavorite={isFavorite}
                  isInTeam={isInTeam}
                />
              );
            })}
          </div>

          {/* Pagination */}
          {!selectedType && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, currentPage - 2) + i;
                  if (pageNum >= totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-pokemon-red text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Gallery;
