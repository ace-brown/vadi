const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const mobileRepairControllers = require('../../controllers/PM/mobile-repair-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all Mobile repairs 
router.get('/', mobileRepairControllers.getMobileRepair)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Mobile repair
router.post('/', fileUpload.single('image'), mobileRepairControllers.createMobileRepair)

// Update a Mobile Repair
// router.patch('/:mtid', mobileRepairControllers.updateIdea)

// Delete a Mobile repair
// router.delete('/:mtid', mobileRepairControllers.deleteIdea)

module.exports = router