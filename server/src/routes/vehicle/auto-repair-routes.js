const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const autoRepairControllers = require('../../controllers/vehicle/auto-repair-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all Auto repairs 
router.get('/', autoRepairControllers.getAutoRepair)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Auto repair
router.post('/', fileUpload.single('image'), autoRepairControllers.createAutoRepair)

// Update a Auto Repair
// router.patch('/:mtid', autoRepairControllers.updateIdea)

// Delete a Auto repair
// router.delete('/:mtid', autoRepairControllers.deleteIdea)

module.exports = router