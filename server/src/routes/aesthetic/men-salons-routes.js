const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const MenSalonPlanControllers = require('../../controllers/aesthetic/men-salon-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all MenSalonPlan 
router.get('/', MenSalonPlanControllers.getMenSalonPlans)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new MenSalonPlan 
router.post('/', fileUpload.single('image'), // 👈 handle one image file 
    MenSalonPlanControllers.createMenSalonPlans)

// Update a MenSalonPlan
// router.patch('/:mtid', MenSalonPlanControllers.updateIdea)

// Delete a MenSalonPlan
// router.delete('/:mtid', MenSalonPlanControllers.deleteIdea)

module.exports = router