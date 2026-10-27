require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const usersRoutes = require('./src/routes/users-routes')
const downloadRoutes = require('./src/routes/download-routes')
const createResourceRouter = require('./src/routes/resource-routes')
const resources = require('./src/resources')
const HttpError = require('./src/models/http-error')
const { getMongoUri } = require('./src/db')

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json({ limit: '100kb' }));

// Middleware to handle CORS (Cross-Origin Resource Sharing)
// Extra origins can be added as a comma-separated CORS_ORIGINS variable
const allowedOrigins = [
    'https://www.vadi.click',
    'https://vadi-gamma.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    ...(process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean),
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // Preflight response
    }
    next();
});

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));

// Health check
app.get('/api/health', (req, res) => {
    const dbConnected = mongoose.connection.readyState === 1;
    res.status(dbConnected ? 200 : 503).json({ status: dbConnected ? 'ok' : 'degraded', db: dbConnected });
});

// Download routes
app.use('/api/download', downloadRoutes);

// Listing routes (mobile/home tariffs, salons, repairs, ...), see src/resources.js
resources.forEach(({ path: routePath, model, options }) => {
    app.use(routePath, createResourceRouter(model, options));
});

// Users routes
app.use('/api/users', usersRoutes);

// Middleware to handle wrong routes
app.use(function (req, res, next) {
    throw new HttpError('Could not find this route.', 404)
})

// Middleware to handle errors after they have been sent
app.use(function (error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err) => ({ field: err.path, message: err.message }));
        return res.status(422).json({ message: 'Invalid input, please check your data.', errors });
    }
    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: `Invalid value for "${error.path}"` });
    }
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: error.message });
    }
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Malformed JSON body' });
    }

    const status = error.code >= 400 && error.code < 600 ? error.code : 500;
    if (status === 500) {
        console.error(error);
    }
    res.status(status).json({ message: status === 500 ? 'An unknown error occurred!' : error.message });
});

// Connect to MongoDB
mongoose
    .connect(getMongoUri())
    .then(function () {
        app.listen(port, () => console.log(`Server is running at port ${port}`))
    })
    .catch((err) => { console.log(err) })
