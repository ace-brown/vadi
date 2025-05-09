const express = require('express');
const mongoose = require('mongoose');

const usersRoutes = require('./src/routes/users-routes')
const mobileTariffRoutes = require('./src/routes/mobile-tariffs-routes')
const downloadRoutes = require('./src/routes/download-routes')
const HttpError = require('./src/models/http-error')

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to handle CORS (Cross-Origin Resource Sharing)
const allowedOrigins = ['https://www.khayamsana.sbs', 'http://localhost:3000', 'http://localhost:5173'];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
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


// Download Routes
app.use('/api/download', downloadRoutes);

// Reports routes
app.use('/api/mobile-tariffs', mobileTariffRoutes);

// Users routes
app.use('/api/users', usersRoutes);

// Middleware to handle wrong routes 
app.use(function (req, res, next) {
    throw new HttpError('Could not find this route.', 404)
})

// Middleware to handle errors after they have been sent
app.use(function (error, req, res, next) {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred!' });
});

// Connect to MongoDB
mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.SUFFIX}.${process.env.AFTER_SUFFIX}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`)
    .then(function () {
        app.listen(port, () => console.log(`Server is running at port ${port}`))
    })
    .catch((err) => { console.log(err) })

