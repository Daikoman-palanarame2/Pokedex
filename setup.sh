#!/bin/bash

# Pokedex Setup Script
echo "🎮 Setting up Pokedex..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. You can use MongoDB Atlas instead."
fi

echo "✅ Node.js found: $(node --version)"

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install

# Create environment files
echo "⚙️  Setting up environment files..."

# Server .env
if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "📝 Created server/.env - Please update with your MongoDB URI and JWT secret"
fi

# Client .env
if [ ! -f "client/.env" ]; then
    cp client/env.example client/.env
    echo "📝 Created client/.env - Ready to use"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start MongoDB (if using local): mongod"
echo "2. Start the backend: cd server && npm run dev"
echo "3. Start the frontend: cd client && npm run dev"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "📚 Don't forget to:"
echo "- Update server/.env with your MongoDB URI"
echo "- Change the JWT_SECRET in server/.env"
echo "- Create a MongoDB Atlas account if using cloud database"
echo ""
echo "Happy Pokemon hunting! 🎮"
