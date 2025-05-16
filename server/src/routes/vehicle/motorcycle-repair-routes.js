const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const motorcycleRepairControllers = require('../../controllers/vehicle/motorcycle-repair-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all Motorcycle repairs 
router.get('/', motorcycleRepairControllers.getMotorcycleRepair)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Motorcycle repair
router.post('/', fileUpload.single('image'), motorcycleRepairControllers.createMotorcycleRepair)

// Update a Motorcycle Repair
// router.patch('/:mtid', motorcycleRepairControllers.updateIdea)

// Delete a Motorcycle repair
// router.delete('/:mtid', motorcycleRepairControllers.deleteIdea)

module.exports = router