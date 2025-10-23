import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pokemon-red to-pokemon-blue rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-bold">Pokedex</span>
            </div>
            <p className="text-gray-300 mb-4">
              Discover and collect your favorite Pokemon. Build your dream team and explore the world of Pokemon with our interactive portfolio.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/Daikoman-palanarame2/Pokedex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/PerSyMonn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {/* Inline Facebook SVG (simple, no extra dependency) */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.84 3.44 8.85 8 9.74v-6.89H7.9v-2.85h2.11V9.41c0-2.09 1.25-3.25 3.14-3.25.91 0 1.86.16 1.86.16v2.05h-1.05c-1.03 0-1.35.64-1.35 1.29v1.56h2.3l-.37 2.85h-1.93V21.8c4.56-.89 8-4.9 8-9.73z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-300 hover:text-white transition-colors">
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://pokeapi.co/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  PokeAPI
                </a>
              </li>
              <li>
                <a 
                  href="https://www.pokemon.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Official Pokemon
                </a>
              </li>
              <li>
                <a 
                  href="https://bulbapedia.bulbagarden.net/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Bulbapedia
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            Made with <Heart className="inline w-4 h-4 text-pokemon-red" /> using React, Express, and PokeAPI
          </p>
          <p className="text-gray-400 text-sm mt-2">
            © 2025 Pokedex. All Pokemon data is property of Nintendo/Game Freak.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
