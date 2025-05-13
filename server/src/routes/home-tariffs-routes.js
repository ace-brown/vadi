const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../middleware/file-upload');

const homeTariffControllers = require('../controllers/home-tariffs-controllers')
const checkAuth = require('../middleware/check-auth');

const router = express.Router()


// Get all Home tariffs
router.get('/', homeTariffControllers.getHomeTariffs)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Home tariff
router.post('/', fileUpload.single('image'), // 👈 handle one image file 
    homeTariffControllers.createHomeTariff)

// Update a Home tariff
// router.patch('/:mtid', homeTariffControllers.updateIdea)

// Delete a Home tariff
// router.delete('/:mtid', homeTariffControllers.deleteIdea)

module.exports = router