const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const applianceRepairControllers = require('../../controllers/electronics/appliance-repair-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all Appliance repairs 
router.get('/', applianceRepairControllers.getApplianceRepair)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Appliance repair
router.post('/', fileUpload.single('image'), applianceRepairControllers.createApplianceRepair)

// Update a Appliance Repair
// router.patch('/:mtid', applianceRepairControllers.updateIdea)

// Delete a Appliance repair
// router.delete('/:mtid', applianceRepairControllers.deleteIdea)

module.exports = router