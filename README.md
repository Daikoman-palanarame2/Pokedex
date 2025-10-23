# Pokedex

A modern, full-stack Pokedex website built with React, Express, MongoDB, and the PokeAPI. Users can discover Pokemon, build their dream team, and save their favorites.

## 🚀 Features

- **Pokemon Discovery**: Browse hundreds of Pokemon with detailed information
- **Interactive Gallery**: Search and filter Pokemon by type with pagination
- **Detailed Pokemon Pages**: View stats, abilities, and physical characteristics
- **User Authentication**: Secure registration and login with JWT
- **Favorites System**: Save your favorite Pokemon
- **Team Builder**: Create and manage a team of up to 6 Pokemon
- **Dark/Light Mode**: Toggle between themes with persistent preferences
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Beautiful animations and smooth transitions

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### External APIs

- **PokeAPI** - Pokemon data and images

## 📁 Project Structure

```
pokemon-portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   ├── public/            # Public assets
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── middleware/     # Custom middleware
│   │   └── config/        # Configuration files
│   └── package.json
└── README.md
```

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Favorites & Team

- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add Pokemon to favorites
- `DELETE /api/favorites/:id` - Remove Pokemon from favorites
- `GET /api/favorites/team` - Get user team
- `POST /api/favorites/team` - Add Pokemon to team
- `DELETE /api/favorites/team/:id` - Remove Pokemon from team

## 🎨 Design Features

- **Pokemon-themed Color Palette**: Red, blue, yellow, and type-specific colors
- **Smooth Animations**: Framer Motion for page transitions and hover effects
- **Responsive Grid Layouts**: Adaptive Pokemon card grids
- **Interactive Elements**: Hover effects, loading states, and micro-interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: Protection against brute force attacks
- **Helmet**: Security headers for Express

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [PokeAPI](https://pokeapi.co/) for providing Pokemon data
- [Pokemon Company](https://www.pokemon.com/) for the Pokemon franchise
- [TailwindCSS](https://tailwindcss.com/) for the CSS framework
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
