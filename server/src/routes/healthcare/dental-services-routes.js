const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const dentalServiceControllers = require('../../controllers/healthcare/dental-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all Dental Services
router.get('/', dentalServiceControllers.getDentalServices)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Dental Service
router.post('/', fileUpload.single('image'), dentalServiceControllers.createDentalService)

// Update a Dental Service
// router.patch('/:mtid', dentalServiceControllers.updateIdea)

// Delete a Dental Service
// router.delete('/:mtid', dentalServiceControllers.deleteIdea)

module.exports = router