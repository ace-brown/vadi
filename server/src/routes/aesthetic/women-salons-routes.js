const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const womenSalonPlanControllers = require('../../controllers/aesthetic/women-salon-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all womenSalonPlan 
router.get('/', womenSalonPlanControllers.getWomenSalonPlans)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new womenSalonPlan 
router.post('/', fileUpload.single('image'), // 👈 handle one image file 
    womenSalonPlanControllers.createWomenSalonPlans)

// Update a womenSalonPlan
// router.patch('/:mtid', womenSalonPlanControllers.updateIdea)

// Delete a womenSalonPlan
// router.delete('/:mtid', womenSalonPlanControllers.deleteIdea)

module.exports = router