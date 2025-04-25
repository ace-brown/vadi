const express = require('express')
const { check } = require('express-validator')

const costControllers = require('../controllers/costs-controllers')
const checkAuth = require('../middleware/check-auth');

const router = express.Router()

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Get a spesific cost by a specific cost id 
router.get('/:cid', costControllers.getCostById)

// Get all costs for a specific user with a userId
router.get('/user/:uid', costControllers.getCostsByUserId)

// Create a new cost
router.post('/', costControllers.createCost)

// Update an cost
router.patch('/:cid', costControllers.updateCost)

// Delete an cost
// router.delete('/:cid', costControllers.deletecost)

module.exports = router