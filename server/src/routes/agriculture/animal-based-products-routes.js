const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const AnimalBasedProdsControllers = require('../../controllers/agriculture/animal-based-products-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all Animal-based products 
router.get('/', AnimalBasedProdsControllers.getAnimalBasedProducts)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Animal-based product
router.post('/', fileUpload.single('image'), AnimalBasedProdsControllers.createAnimalBasedProducts)

// Update a Animal-based product
// router.patch('/:mtid', AnimalBasedProdsControllers.updateIdea)

// Delete a Animal-based product
// router.delete('/:mtid', AnimalBasedProdsControllers.deleteIdea)

module.exports = router