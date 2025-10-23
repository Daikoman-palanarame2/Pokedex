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

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pokemon-portfolio
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   **Server (.env)**

   ```bash
   cd ../server
   cp env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/pokedex
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:5173
   ```

   **Client (.env)**

   ```bash
   cd ../client
   cp env.example .env
   ```

5. **Start the development servers**

   **Start the backend server**

   ```bash
   cd server
   npm run dev
   ```

   **Start the frontend server** (in a new terminal)

   ```bash
   cd client
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Endpoints

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

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### Backend (Render/Railway)

1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables (MongoDB URI, JWT secret, etc.)

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update MONGODB_URI in your environment variables

---

## 🛠️ Deploying to free cloud (step-by-step)

This guide uses the following free-tier services:

- Frontend: Vercel (static site from `client/dist`)
- Backend: Render (Free web service) — alternatively Railway
- Database: MongoDB Atlas (M0 free cluster)

### Summary of required environment variables

- MONGODB_URI — MongoDB connection string from Atlas
- JWT_SECRET — secret string for signing JWTs
- CLIENT_URL — your frontend origin (e.g. https://your-site.vercel.app)
- NODE_ENV — production

### 1) Create a MongoDB Atlas free cluster

1. Sign up at https://www.mongodb.com/cloud/atlas and create a free shared cluster (M0).
2. Create a database user (username and password).
3. In "Network Access" allow your app IPs or 0.0.0.0/0 for testing (less secure).
4. Get the connection string and replace <username>, <password>, and <dbname>.
   Example:

   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pokedex?retryWrites=true&w=majority

### 2) Deploy the backend to Render (recommended)

1. Create a free Render account and connect your GitHub repo.
2. Create a new "Web Service".
   - Select the `server` subfolder as the Root Directory.
   - Branch: main (or whatever branch you use).
   - Build Command: leave empty (Render will run `npm install` automatically) or put `npm install`.
   - Start Command: `npm start` (your `server/package.json` has `start: node src/index.js`).
   - Environment: Node 18+ (select the latest available)
3. Add Environment Variables in Render's dashboard:
   - MONGODB_URI = <your atlas connection string>
   - JWT_SECRET = <a long random string>
   - CLIENT_URL = https://your-frontend-url

### Single-deploy option (serve frontend from backend)

If you prefer to deploy a single service that hosts both the API and the static frontend, the server is prepared to serve the built client when `NODE_ENV=production`.

How it works:

- The `server` includes a `postinstall` script that (during deployment) will `cd ../client && npm install && npm run build` and produce `client/dist`.
- When `NODE_ENV=production`, Express will serve files from `client/dist` and fall back to `index.html` for client-side routing.

Render / deployment notes:

- On Render, set the Root Directory to `server` and keep the Start Command as `npm start`. Render runs `npm install` automatically and will trigger the `postinstall` script which builds the client.
- If your deploy environment doesn't respect `postinstall`, you can manually build the client and include `client/dist` in the repo or run the build step in Render's Build Command.

Commands for single-deploy testing locally (not required for standard dev):

```powershell
# Build client
cd client
npm install
npm run build

# Start the server in production mode
cd ../server
$env:NODE_ENV='production'; node src/index.js
```

The server should then be available on `http://localhost:5000` and the frontend will be served from the same origin. API routes remain under `/api/*`.

- CLIENT_URL = https://your-frontend-url
- NODE_ENV = production

4. Deploy. Render will provide a URL like `https://your-app.onrender.com`.

Notes: If you prefer Railway, the steps are similar: create a new project, link the repo, set the server root to `server`, set start command to `npm start`, and add the same env vars.

### 3) Deploy the frontend to Vercel

1. Create a Vercel account and connect your GitHub repository.
2. In Vercel, create a new project and select the repository.
3. Configure the project:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add the following Environment Variables (for client builds that need the API URL):
   - VITE_API_URL = https://your-backend-url (optional — if your client uses a runtime env variable)
5. Deploy. Vercel will build and host your static site. You'll get a URL like `https://your-site.vercel.app`.

If your frontend makes API calls to absolute URLs, update the client config to use `VITE_API_URL`. Otherwise, if your fetches use relative `/api` paths, you can set `CLIENT_URL` on the backend and configure CORS accordingly.

### 4) Verify everything

1. Visit your frontend URL and try to register/login. If you get 503 from API, check Render logs and the `/api/health` endpoint.
2. Test backend health directly:

```bash
# Replace with your backend URL
curl https://your-backend.onrender.com/api/health
```

Expected response (JSON):

```json
{ "status": "OK", "message": "Pokedex API is running!", "dbConnected": true }
```

If `dbConnected` is false, check your `MONGODB_URI` and Atlas access settings.

### 5) Environment variable checklist

Set these at the place you deploy the backend (Render/Railway):

- MONGODB_URI
- JWT_SECRET
- CLIENT_URL (your frontend URL)
- NODE_ENV=production

Optional client env vars (on Vercel):

- VITE*API_URL (if you use it in the client code) — Vite requires env vars to be prefixed with `VITE*`

### 6) Optional: Serve frontend from the backend (single deploy)

If you prefer a single deploy (backend serves the built frontend), you can build the client locally and configure the Express server to serve static files from `client/dist`. This requires adding a build step in the backend deploy and some Express static config. I avoided changing this by default to keep deployments simple and use proper static hosts.

---

If you'd like, I can also:

- Add a small script to the `server` to serve `client/dist` for single-host deployments.
- Add a `.vercelignore` or Render-specific files.

Next steps I took in this repo:

- Minor edit to `server/src/index.js` to use the centralized `connectDB` from `server/src/config/db.js` and improve startup logging.

---

If you want me to continue, I can either:

1. Add an Express static-serving option so the backend can serve the frontend build (single deploy path), or
2. Generate exact Render and Vercel settings in a new `DEPLOYMENT.md` file with screenshots and exact env var values to paste.

Tell me which next step you prefer and I'll implement it.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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

## 🔧 Troubleshooting

### Common Issues

**1. Port 5500 Error**

- ❌ Wrong: http://localhost:5500
- ✅ Correct: http://localhost:5173

**2. MongoDB Connection Error**

- App works without MongoDB
- User features require MongoDB connection
- Use MongoDB Atlas for cloud database

**3. Build Errors**

- Make sure you're using Node.js v16+
- Clear node_modules and reinstall: `npm install`
- Check TailwindCSS version compatibility

**4. CORS Errors**

- Backend runs on port 5000
- Frontend runs on port 5173
- Make sure both servers are running

### Status Check Scripts

**Windows:**

```bash
# Check server status
status-check.bat

# Start both servers
start.bat
```

**Manual Check:**

```bash
# Test backend
curl http://localhost:5000/api/health

# Test frontend
# Open http://localhost:5173 in browser
```

### Expected Behavior

✅ **Working Features:**

- Homepage loads with Pokemon cards
- Navigation works (Home, Gallery, Login, Register)
- Dark/Light mode toggle
- Search functionality
- Pokemon detail pages
- Responsive design

⚠️ **Requires MongoDB:**

- User registration/login
- Favorites system
- Team builder

---

**Happy Pokemon hunting! 🎮**
