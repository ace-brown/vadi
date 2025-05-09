const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../middleware/file-upload');

const mobileTariffControllers = require('../controllers/mobile-tariffs-controllers')
const checkAuth = require('../middleware/check-auth');

const router = express.Router()


// Get all Mobile tariffs
router.get('/', mobileTariffControllers.getMobileTariffs)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Mobile tariff
router.post('/', fileUpload.single('image'), // 👈 handle one image file 
    mobileTariffControllers.createMobileTariff)

// Update a Mobile tariff
// router.patch('/:mtid', mobileTariffControllers.updateIdea)

// Delete a Mobile tariff
// router.delete('/:mtid', mobileTariffControllers.deleteIdea)

module.exports = router