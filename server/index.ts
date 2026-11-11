import "dotenv/config";

import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

import usersRoutes from "./src/routes/users-routes";
import goRoutes from "./src/routes/go-routes";
import reviewsRoutes from "./src/routes/reviews-routes";
import meRoutes from "./src/routes/me-routes";
import toolsRoutes from "./src/routes/tools-routes";
import jobsRoutes from "./src/routes/jobs-routes";
import openapi from "./src/openapi";
import createResourceRouter from "./src/routes/resource-routes";
import resources from "./src/resources";
import HttpError from "./src/models/http-error";
import { getMongoUri } from "./src/db";

const app = express();
const port = process.env.PORT || 5000;
const aiServiceURL = process.env.AI_SRV_URL;

// Behind Vercel's proxy: use the real client IP for rate limiting
app.set("trust proxy", 1);

// Security headers. Images are loaded by the frontend from another origin.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(compression());

// Middleware to parse JSON requests
app.use(express.json({ limit: "100kb" }));

// Middleware to handle CORS (Cross-Origin Resource Sharing)
// Extra origins can be added as a comma-separated CORS_ORIGINS variable
const allowedOrigins = [
  "https://vadi-gamma.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  ...(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Preflight response
  }
  next();
});

app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images")),
);

// HTTP caching: anonymous reads of public data may be cached briefly by browsers and
// CDNs (Express adds ETags, so unchanged responses come back as 304). Anything
// personal is never cached.
const PRIVATE_PATHS = /^\/(me|users|jobs|go|health|ai)(\/|$)/;
app.use("/api", (req, res, next) => {
  if (
    req.method === "GET" &&
    !req.headers.authorization &&
    !PRIVATE_PATHS.test(req.path)
  ) {
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  } else {
    res.set("Cache-Control", "private, no-store");
  }
  res.vary("Authorization");
  next();
});

// API documentation
app.get("/api/openapi.json", (req, res) => res.json(openapi));
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapi, { customSiteTitle: "Vadi API" }),
);

// Health check
app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res
    .status(dbConnected ? 200 : 503)
    .json({ status: dbConnected ? "ok" : "degraded", db: dbConnected });
});

// Slow down password guessing and spam sign-ups / reviews
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "test" ? 1000 : 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again in a few minutes." },
});
app.use(["/api/users/login", "/api/users/signup"], strictLimiter);
app.post("/api/reviews", strictLimiter);

// Address checks and the advisor are heavier than normal reads
const toolsLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: process.env.NODE_ENV === "test" ? 1000 : 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests, please slow down." },
});
app.use(["/api/availability", "/api/advisor"], toolsLimiter);

// Advisor, address availability, price history
app.use("/api", toolsRoutes);

// Scheduled jobs (price alerts)
app.use("/api/jobs", jobsRoutes);

// "Go to offer" redirects and click statistics
app.use("/api/go", goRoutes);

// Provider reviews
app.use("/api/reviews", reviewsRoutes);

// The logged-in user's watchlist, saved comparisons and reviews
app.use("/api/me", meRoutes);

// Listing routes (mobile/home tariffs, salons, repairs, ...), see src/resources.ts
resources.forEach(({ path: routePath, model, options }) => {
  app.use(routePath, createResourceRouter(model, options));
});

// Users routes
app.use("/api/users", usersRoutes);

// AI Routes
app.get("/api/ai", async (req, res) => {
  try {
    if (!aiServiceURL) {
      throw new Error("AI_SRV_URL is not set");
    }
    const aiRes = await fetch(`${aiServiceURL}/stream`);

    // fetch only throws when it can't connect; a 4xx/5xx from Python still
    // "succeeds", so check the status before streaming anything to the client
    if (!aiRes.ok) {
      throw new Error(`The AI service answered with status ${aiRes.status}`);
    }

    if (!aiRes.body) {
      throw new Error("The AI service sent an empty response");
    }

    const decoder = new TextDecoder();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    // Keep PRIVATE_PATHS' "private, no-store" and add no-transform, so the
    // compression middleware (and proxies) pass each chunk on immediately
    res.setHeader("Cache-Control", "private, no-store, no-transform");

    for await (const chunk of aiRes.body) {
      const decodedChunk = decoder.decode(chunk, { stream: true });
      console.log("got chunk:", decodedChunk);
      res.write(decodedChunk);
    }

    res.end();
  } catch (err) {
    console.error("AI stream failed:", err instanceof Error ? err.message : err);
    if (res.headersSent) {
      // The stream already started, so the status can't change any more;
      // just close the response so the client sees the stream end
      res.end();
      return;
    }
    res.status(503).json({ message: "Service isn't available right now" });
  }
});

// Middleware to handle wrong routes
app.use(() => {
  throw new HttpError("Could not find this route.", 404);
});

// Middleware to handle errors after they have been sent
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));
    return res
      .status(422)
      .json({ message: "Invalid input, please check your data.", errors });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res
      .status(400)
      .json({ message: `Invalid value for "${error.path}"` });
  }
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON body" });
  }

  const status = error.code >= 400 && error.code < 600 ? error.code : 500;
  if (status === 500) {
    console.error(error);
  }
  res.status(status).json({
    message: status === 500 ? "An unknown error occurred!" : error.message,
  });
};
app.use(errorHandler);

// Connect to MongoDB. Queries made before the connection is ready are queued.
const connection = mongoose.connect(getMongoUri());

// Run a server when started directly (npm start / npm run dev); on Vercel and in tests the
// exported app is used instead
if (require.main === module) {
  connection
    .then(function () {
      app.listen(port, () => console.log(`Server is running at port ${port}`));
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  connection.catch((err) => {
    console.error(err);
  });
}

export default app;
