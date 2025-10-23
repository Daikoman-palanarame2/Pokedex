const User = require('../models/User');

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('favorites');
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addToFavorites = async (req, res) => {
  try {
    const { pokemonId, pokemonName, pokemonImage } = req.body;

    if (!pokemonId || !pokemonName || !pokemonImage) {
      return res.status(400).json({ message: 'Pokemon ID, name, and image are required' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if already in favorites
    const existingFavorite = user.favorites.find(fav => fav.pokemonId === pokemonId);
    if (existingFavorite) {
      return res.status(400).json({ message: 'Pokemon already in favorites' });
    }

    // Add to favorites
    user.favorites.push({
      pokemonId,
      pokemonName,
      pokemonImage,
      addedAt: new Date()
    });

    await user.save();

    res.json({
      message: 'Pokemon added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const { pokemonId } = req.params;

    const user = await User.findById(req.user.id);
    
    // Find and remove from favorites
    const favoriteIndex = user.favorites.findIndex(fav => fav.pokemonId === parseInt(pokemonId));
    if (favoriteIndex === -1) {
      return res.status(404).json({ message: 'Pokemon not found in favorites' });
    }

    user.favorites.splice(favoriteIndex, 1);
    await user.save();

    res.json({
      message: 'Pokemon removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addToTeam = async (req, res) => {
  try {
    const { pokemonId, pokemonName, pokemonImage } = req.body;

    if (!pokemonId || !pokemonName || !pokemonImage) {
      return res.status(400).json({ message: 'Pokemon ID, name, and image are required' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if team is full (max 6 Pokemon)
    if (user.team.length >= 6) {
      return res.status(400).json({ message: 'Team is full (maximum 6 Pokemon)' });
    }

    // Check if already in team
    const existingTeamMember = user.team.find(member => member.pokemonId === pokemonId);
    if (existingTeamMember) {
      return res.status(400).json({ message: 'Pokemon already in team' });
    }

    // Add to team
    user.team.push({
      pokemonId,
      pokemonName,
      pokemonImage,
      addedAt: new Date()
    });

    await user.save();

    res.json({
      message: 'Pokemon added to team',
      team: user.team
    });
  } catch (error) {
    console.error('Add to team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromTeam = async (req, res) => {
  try {
    const { pokemonId } = req.params;

    const user = await User.findById(req.user.id);
    
    // Find and remove from team
    const teamIndex = user.team.findIndex(member => member.pokemonId === parseInt(pokemonId));
    if (teamIndex === -1) {
      return res.status(404).json({ message: 'Pokemon not found in team' });
    }

    user.team.splice(teamIndex, 1);
    await user.save();

    res.json({
      message: 'Pokemon removed from team',
      team: user.team
    });
  } catch (error) {
    console.error('Remove from team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTeam = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('team');
    res.json({ team: user.team });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  addToTeam,
  removeFromTeam,
  getTeam
};
