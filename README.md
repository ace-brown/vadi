# Vadi - Local Services Comparison

Vadi is a full-stack site for comparing local services and prices in Germany: internet and mobile plans, salons, car and motorcycle repair, appliance and phone/computer repair, garden supplies and farm shops, dentists, bookstores and education centers. Visitors filter and sort listings by location, price, rating and features.

The bundled data (`npm run seed`) is fictional sample data: business and provider names are made up, addresses use real German street names, and prices are in euros.

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
        ├── controllers/  # Route handlers (resource-controllers.js serves every listing type)
        ├── models/       # Mongoose schemas with validation
        ├── routes/       # API routes
        ├── middleware/   # Auth, admin check, uploads
        └── resources.js  # Which listing endpoints exist and how they can be filtered
    ├── seed/data.js      # German sample data
    └── scripts/seed.js   # npm run seed
```

## Categories

The platform supports the following service categories:

- **Internet** - Home internet (DSL, VDSL, cable, fiber, LTE) and mobile plans
- **Beauty & Aesthetics** - Men's and women's salons, with per-service prices
- **Vehicles** - Car and motorcycle repair
- **Electronics** - Home appliance repair
- **Mobile & Computer** - Phone and computer/laptop repair
- **Agriculture** - Garden supplies and animal products (farm shops)
- **Healthcare** - Dentists
- **Education** - Bookstores and education centers

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
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

**Server `.env`** (loaded automatically). Either give a full connection string:

```
MONGODB_URI=mongodb+srv://user:password@cluster0.abc12.mongodb.net/vadi_de
JWT_SECRET=a_long_random_string
PORT=5000
```

or the MongoDB Atlas parts separately (used when `MONGODB_URI` is not set):

```
DB_USER=your_atlas_username
DB_PASSWORD=your_atlas_password
SUFFIX=cluster0          # from ...@cluster0.abc12.mongodb.net
AFTER_SUFFIX=abc12
DB_NAME=vadi_de
APP_NAME=Cluster0
JWT_SECRET=a_long_random_string
PORT=5000
```

Optional:

```
CORS_ORIGINS=https://my-frontend.example   # extra allowed origins, comma-separated
ADMIN_EMAIL=you@example.com                # used by npm run seed to create an admin
ADMIN_PASSWORD=change_me
```

In MongoDB Atlas, add your IP address under **Security → Network Access**, or the server can't connect.

**Client `.env`:**

```
VITE_API_URL=http://localhost:5000
```

### Sample Data

From `server/`:

```bash
npm run seed                 # fill empty collections with the German sample data
npm run seed -- --reset      # replace existing listings with the sample data
npm run seed -- --admin-only # only create/promote the ADMIN_EMAIL user to admin
```

Users are never deleted by the seed script.

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
- `npm run seed` - Load the sample data (see above)

## API

Every listing endpoint supports the same operations:

| Method | Path | Access |
| --- | --- | --- |
| `GET` | `/api/<category>` | Public: list with filters, sorting and pagination |
| `GET` | `/api/<category>/:id` | Public |
| `POST` | `/api/<category>` | Admin: JSON body, or multipart with an `image` file |
| `PATCH` | `/api/<category>/:id` | Admin |
| `DELETE` | `/api/<category>/:id` | Admin |

Categories: `internet/mobile-tariffs`, `internet/home-tariffs`, `aesthetic/men-salon`, `aesthetic/women-salon`, `vehicle/auto-repair`, `vehicle/motorcycle-repair`, `electronics/appliance-repair`, `pc-mobile/mobile-repair`, `pc-mobile/computer-repair`, `agriculture/garden-supplies`, `agriculture/animal-based-products`, `healthcare/dental`, `education/bookstores`, `education/centers`.

List query parameters (what each category allows is defined in `server/src/resources.js`):

- `q` - text search, e.g. `?q=brakes`
- exact matches, comma-separated for several values, e.g. `?city=Berlin,Hamburg`, `?connectionType=Fiber,Cable`, `?termMonths=1,12`
- ranges as `<field>Min` / `<field>Max`, e.g. `?monthlyPriceMax=30&dataGBMin=20` (a `null` data or minutes value means unlimited and always passes a minimum)
- `sort=<field>` or `sort=-<field>` for descending, e.g. `?sort=-rating`
- `page` and `limit` (default 50, max 100)

The response is `{ items, total, page, pages, ranges }`, where `ranges` holds the min/max of each range field across the whole collection (the client uses it to size its sliders).

Other endpoints: `POST /api/users/signup`, `POST /api/users/login`, `GET|PATCH|DELETE /api/users/:uid` (your own account, or any account for admins), `GET /api/users` and `PATCH /api/users/:uid/role` (admin), `GET /api/health`.

Passwords are hashed with bcrypt. Accounts created before hashing was added are upgraded on their next successful login.

## Database

The project uses **MongoDB** to store all data including users, listings, and service information. Make sure you have:

- A MongoDB instance running (locally or via MongoDB Atlas)
- Connection string configured in `.env`

## Deployment

The application is configured to deploy on **Vercel**:

- Frontend automatically deploys from the `client/` directory
- Backend can be deployed separately or via serverless functions
- Uploaded images are stored on the server's disk (`server/uploads/images`), which is not persistent on Vercel; use a persistent host or object storage if admins will upload images in production
- Check `vercel.json` configurations in both directories for deployment settings
