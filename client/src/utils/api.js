import axios from 'axios';

// Base URLs (read from Vite env vars at build time)
const POKEAPI_BASE_URL = import.meta.env.VITE_POKEAPI_URL || 'https://pokeapi.co/api/v2';
// Default to relative `/api` so same-origin deployments work without extra config
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instances
export const pokeApi = axios.create({
  baseURL: POKEAPI_BASE_URL,
  timeout: 10000,
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Pokemon API functions
export const pokemonApi = {
  // Get Pokemon by ID or name
  getPokemon: async (id) => {
    const response = await pokeApi.get(`/pokemon/${id}`);
    return response.data;
  },

  // Get Pokemon list with pagination
  getPokemonList: async (offset = 0, limit = 20) => {
    const response = await pokeApi.get(`/pokemon?offset=${offset}&limit=${limit}`);
    return response.data;
  },

  // Get Pokemon species data
  getPokemonSpecies: async (id) => {
    const response = await pokeApi.get(`/pokemon-species/${id}`);
    return response.data;
  },

  // Get Pokemon types
  getTypes: async () => {
    const response = await pokeApi.get('/type');
    return response.data;
  },

  // Get Pokemon by type
  getPokemonByType: async (typeId) => {
    const response = await pokeApi.get(`/type/${typeId}`);
    return response.data;
  }
};

// Backend API functions
export const authApi = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const favoritesApi = {
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  addToFavorites: async (pokemonData) => {
    const response = await api.post('/favorites', pokemonData);
    return response.data;
  },

  removeFromFavorites: async (pokemonId) => {
    const response = await api.delete(`/favorites/${pokemonId}`);
    return response.data;
  },

  getTeam: async () => {
    const response = await api.get('/favorites/team');
    return response.data;
  },

  addToTeam: async (pokemonData) => {
    const response = await api.post('/favorites/team', pokemonData);
    return response.data;
  },

  removeFromTeam: async (pokemonId) => {
    const response = await api.delete(`/favorites/team/${pokemonId}`);
    return response.data;
  }
};

// Utility functions
export const getPokemonImage = (pokemonId) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
};

export const getPokemonSprite = (pokemonId) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
};

export const getTypeColor = (type) => {
  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return typeColors[type] || '#A8A878';
};

export const formatPokemonName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const formatPokemonId = (id) => {
  return `#${id.toString().padStart(3, '0')}`;
};
