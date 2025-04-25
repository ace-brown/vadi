const express = require('express')
const { check } = require('express-validator')

const reportsControllers = require('../controllers/reports-controllers')
const checkAuth = require('../middleware/check-auth');

const router = express.Router()

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Get a spesific report by a specific report id 
router.get('/:rid', reportsControllers.getReportById)

// Create a new report
router.post(
    '/',
    [
        check('ideaTitle').notEmpty(),
        check('ownerId').notEmpty()
    ],
    reportsControllers.createReport
)

// Update a report
router.patch('/:rid', reportsControllers.updateReport)

// Delete a report
// router.delete('/:rid', reportsControllers.deleteReport)

module.exports = router