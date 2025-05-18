const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const GardenSuppliesControllers = require('../../controllers/agriculture/garden-supplies-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all Garden supplies 
router.get('/', GardenSuppliesControllers.getGardenSupplies)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Garden supplie
router.post('/', fileUpload.single('image'), GardenSuppliesControllers.createGardenSupplies)

// Update a Garden supplie
// router.patch('/:mtid', GardenSuppliesControllers.updateIdea)

// Delete a Garden supplie
// router.delete('/:mtid', GardenSuppliesControllers.deleteIdea)

module.exports = router