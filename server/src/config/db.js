const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pokedex');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message || error);
    console.warn('Continuing without DB connection. User features will be limited.');
    // Do not exit the process — the app can continue and will return 503 for DB routes.
    return null;
  }
};

module.exports = connectDB;
