const express = require('express');
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  addToTeam,
  removeFromTeam,
  getTeam
} = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Favorites routes
router.get('/', getFavorites);
router.post('/', addToFavorites);
router.delete('/:pokemonId', removeFromFavorites);

// Team routes
router.get('/team', getTeam);
router.post('/team', addToTeam);
router.delete('/team/:pokemonId', removeFromTeam);

module.exports = router;
