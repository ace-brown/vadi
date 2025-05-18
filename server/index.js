const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const usersRoutes = require('./src/routes/users-routes')
const mobileTariffRoutes = require('./src/routes/internet/mobile-tariffs-routes')
const homeTariffRoutes = require('./src/routes/internet/home-tariffs-routes')
const menSalonPlanRoutes = require('./src/routes/aesthetic/men-salons-routes')
const womenSalonPlanRoutes = require('./src/routes/aesthetic/women-salons-routes')
const autoRepairRoutes = require('./src/routes/vehicle/auto-repair-routes')
const motorcycleRepairRoutes = require('./src/routes/vehicle/motorcycle-repair-routes')
const applianceRepairRoutes = require('./src/routes/electronics/appliance-repair-routes')
const mobileRepairRoutes = require('./src/routes/PM/mobile-repair-routes')
const computerRepairRoutes = require('./src/routes/PM/computer-repair-routes')
const gardenSuppliesRoutes = require('./src/routes/agriculture/garden-supplies-routes')
const animalBasedProdRoutes = require('./src/routes/agriculture/animal-based-products-routes')
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

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));

// Download Routes
app.use('/api/download', downloadRoutes);

// Moible Tariff routes
app.use('/api/internet/mobile-tariffs', mobileTariffRoutes);

// Home Tariff routes
app.use('/api/internet/home-tariffs', homeTariffRoutes);

// Men Salon Plan routes
app.use('/api/aesthetic/men-salon', menSalonPlanRoutes);

// Women Salon Plan routes
app.use('/api/aesthetic/women-salon', womenSalonPlanRoutes);

// Auto Repair routes
app.use('/api/vehicle/auto-repair', autoRepairRoutes);

// Motorcycle Repair routes
app.use('/api/vehicle/motorcycle-repair', motorcycleRepairRoutes);

// Appliance Repair routes
app.use('/api/electronics/appliance-repair', applianceRepairRoutes);

// Mobile Repair routes
app.use('/api/pc-mobile/mobile-repair', mobileRepairRoutes);

// Computer Repair routes
app.use('/api/pc-mobile/computer-repair', computerRepairRoutes);

// Garden Supplies routes
app.use('/api/agriculture/garden-supplies', gardenSuppliesRoutes);

// Animal-based products routes
app.use('/api/agriculture/animal-based-products', animalBasedProdRoutes);

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

