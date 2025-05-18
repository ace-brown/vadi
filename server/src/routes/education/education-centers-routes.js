const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const EduCenterControllers = require('../../controllers/education/education-centers-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all Education Centers 
router.get('/', EduCenterControllers.getEduCenters)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Education Center
router.post('/', fileUpload.single('image'), EduCenterControllers.createEduCenter)

// Update a Education Center
// router.patch('/:mtid', EduCenterControllers.updateIdea)

// Delete a Education Center
// router.delete('/:mtid', EduCenterControllers.deleteIdea)

module.exports = router