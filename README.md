# Vadi - Multi-Category Marketplace

Vadi is a mock full-stack classified ads and services marketplace platform that connects buyers and sellers across multiple categories including vehicles, real estate, beauty services, electronics, agriculture, education, healthcare, and internet services.

# You can visit the website online

https://vadi-gamma.vercel.app/

## Tech Stack

### Frontend

- **React** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### Backend

- **Node.js** with Express.js
- **MongoDB** - NoSQL database
- **JWT** - Authentication

### Deployment

- Hosted on **Vercel**
- Connected to MongoDB for data persistence

## Project Structure

```
vadi/
├── client/          # React frontend application
│   └── src/
│       ├── components/   # Reusable React components
│       ├── pages/        # Page components (organized by category)
│       ├── routes/       # Route configurations
│       └── hooks/        # Custom React hooks
└── server/          # Node.js backend application
    └── src/
        ├── controllers/  # Route handlers
        ├── models/       # Data models and schemas
        ├── routes/       # API routes
        └── middleware/   # Custom middleware
```

## Categories

The platform supports the following service categories:

- **Vehicles** - Buy/sell vehicles
- **Real Estate** - PM (Property Management)
- **Beauty & Aesthetics** - Salons and beauty services
- **Electronics** - Buy/sell electronics
- **Agriculture** - Agricultural products and services
- **Education** - Educational courses and services
- **Healthcare** - Health and medical services
- **Internet** - Internet services and providers

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vadi
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

### Environment Setup

Create `.env` files for both client and server with necessary configuration:

**Server `.env`:**

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Client `.env`:**

```
VITE_API_URL=http://localhost:5000
```

### Running Locally

1. **Start the backend server** (from `server/` directory)

   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   Server runs on `http://localhost:5000`

2. **Start the frontend development server** (from `client/` directory)

   ```bash
   npm run dev
   ```

   Client runs on `http://localhost:5173` (or as shown in terminal)

3. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## Available Scripts

### Client

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Server

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## Database

The project uses **MongoDB** to store all data including users, listings, and service information. Make sure you have:

- A MongoDB instance running (locally or via MongoDB Atlas)
- Connection string configured in `.env`

## Deployment

The application is configured to deploy on **Vercel**:

- Frontend automatically deploys from the `client/` directory
- Backend can be deployed separately or via serverless functions
- Check `vercel.json` configurations in both directories for deployment settings
