const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const computerRepairControllers = require('../../controllers/PM/computer-repair-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all Computer repairs 
router.get('/', computerRepairControllers.getComputerRepair)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Computer repair
router.post('/', fileUpload.single('image'), computerRepairControllers.createComputerRepair)

// Update a Computer Repair
// router.patch('/:mtid', computerRepairControllers.updateIdea)

// Delete a Computer repair
// router.delete('/:mtid', computerRepairControllers.deleteIdea)

module.exports = router