# Vadi - Local Services Comparison

Vadi is a full-stack comparison site for Germany. The launch version compares **home internet and mobile plans**: offers are ranked by their effective monthly price over 24 months (promo prices, setup and hardware fees and bonuses included), can be filtered and compared side by side, and link to the provider through a tracked "go to offer" redirect. The site is in German with an English switch.

Other categories (salons, repairs, dentists, education, agriculture) still exist in the code and API but are not linked from the site until they have real data.

The bundled data (`npm run seed`) is fictional sample data: business and provider names are made up, addresses use real German street names, and prices are in euros.

![Vadi home page: questionnaire for home internet and mobile plans, "How it works" and "Why Vadi" sections](docs/screenshots/home.png)

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
        ├── resources.js  # Which listing endpoints exist and how they can be filtered
        └── import-offers.js  # Feed import used by npm run import / seed
    ├── seed/             # German sample data and an example import feed
    ├── scripts/          # seed.js, import-offers.js
    └── tests/            # API tests (npm test)
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
CLIENT_URL=https://www.vadi.click          # links in emails; redirect target for offers without a partner link
SMTP_URL=smtps://user:pass@smtp.example.com:465  # for price alert emails (logged to the console if unset)
MAIL_FROM="Vadi <no-reply@vadi.click>"
CRON_SECRET=a_long_random_string           # lets a scheduler call /api/jobs/price-alerts
AVAILABILITY_SAMPLE=true                   # simulate address checks for the sample data; false = postcode estimate
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

Users are never deleted by the seed script. With `NODE_ENV=production`, `--reset` also requires `--force`.

### Importing offers

```bash
npm run import -- path/to/feed.json            # create/update providers and offers
npm run import -- path/to/feed.json --dry-run  # validate only
```

See `server/seed/example-feed.json` for the format. Offers are matched by `externalId`; offers of a provider that are missing from its feed are switched off.

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
- `npm run import` - Import offers from a feed file (see above)
- `npm run alerts` - Email users whose price alert target was reached (run on a schedule)
- `npm test` - API tests (uses an in-memory MongoDB, no setup needed)

## API

Interactive documentation: **`/api/docs`** (OpenAPI description at `/api/openapi.json`). Public reads are cacheable for 60 seconds, send ETags and are gzip-compressed.

Every listing endpoint supports the same operations:

| Method | Path | Access |
| --- | --- | --- |
| `GET` | `/api/<category>` | Public: list with filters, sorting and pagination |
| `GET` | `/api/<category>/:id` | Public |
| `POST` | `/api/<category>` | Admin: JSON body, or multipart with an `image` file |
| `PATCH` | `/api/<category>/:id` | Admin |
| `DELETE` | `/api/<category>/:id` | Admin |

Categories: `internet/mobile-tariffs`, `internet/home-tariffs`, `providers`, `aesthetic/men-salon`, `aesthetic/women-salon`, `vehicle/auto-repair`, `vehicle/motorcycle-repair`, `electronics/appliance-repair`, `pc-mobile/mobile-repair`, `pc-mobile/computer-repair`, `agriculture/garden-supplies`, `agriculture/animal-based-products`, `healthcare/dental`, `education/bookstores`, `education/centers`.

List query parameters (what each category allows is defined in `server/src/resources.js`):

- `q` - text search, e.g. `?q=brakes`
- exact matches, comma-separated for several values, e.g. `?city=Berlin,Hamburg`, `?connectionType=Fiber,Cable`, `?termMonths=1,12`
- ranges as `<field>Min` / `<field>Max`, e.g. `?monthlyPriceMax=30&dataGBMin=20` (a `null` data or minutes value means unlimited and always passes a minimum)
- `sort=<field>` or `sort=-<field>` for descending, e.g. `?sort=-rating`
- `page` and `limit` (default 50, max 100)

Offers (home and mobile) also accept `?postcode=10115` (home internet coverage), are sorted by `effectiveMonthlyPrice` by default, include their provider, and only show active, currently valid offers; admins can add `?includeInactive=true`.

The response is `{ items, total, page, pages, ranges, facets }`: `ranges` holds the min/max of each range field across all visible items (the client sizes its sliders with it), and `facets` counts the results per filter option, each ignoring its own filter.

Offers carry an `effectiveMonthlyPrice` (average over 24 months including fees and bonuses) and a `score` ("Vadi score", 1.0 best to 5.0) with `scoreDetails`; both can be used for sorting. Home internet also accepts `?street=&houseNumber=` (with `postcode`) to show only offers bookable at that address.

Comparison tools:

- `POST /api/advisor/mobile`, `POST /api/advisor/home` - needs-based recommendations with reasons
- `POST /api/availability` - connections per provider at an address (cached 7 days)
- `GET /api/price-history/:kind/:id` - effective price over time
- `GET|POST /api/jobs/price-alerts` - send due price alert emails (admin or `Authorization: Bearer $CRON_SECRET`)

"Go to offer": `GET /api/go/home/:id` and `GET /api/go/mobile/:id` log the click (without IP or user) and redirect to the offer's `affiliateUrl`; `GET /api/go/stats?days=30` (admin) returns click counts.

Reviews: `GET /api/reviews?provider=<id>` (approved reviews with average), `POST /api/reviews` (logged in, published after moderation), `GET /api/reviews/moderation?status=pending`, `PATCH /api/reviews/:id` with `{ status }`, `DELETE /api/reviews/:id` (admin).

My account (logged in): `GET /api/me/price-alerts`, `PUT|DELETE /api/me/price-alerts/:kind/:id` with `{ targetPrice }`, `GET /api/me/saved-offers`, `PUT|DELETE /api/me/saved-offers/:kind/:id` (watchlist with saved vs. current price), `GET|POST /api/me/comparisons`, `DELETE /api/me/comparisons/:id` (saved comparisons), `GET /api/me/reviews` (own reviews with status).

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
