const express = require('express')
const { check } = require('express-validator')

const ideasControllers = require('../controllers/ideas-controllers')
const checkAuth = require('../middleware/check-auth');

const router = express.Router()

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Get a spesific idea by a specific idea id 
router.get('/:eid', ideasControllers.getIdeaById)

// Get all ideas for a specific user with a userId
router.get('/user/:uid', ideasControllers.getIdeasByUserId)

// Create a new idea
router.post(
    '/',
    [
        check('ownerId').notEmpty(),
        check('fatherName').notEmpty(),
        check('city').notEmpty(),
        check('career').notEmpty(),
        check('gender').notEmpty(),
        check('mobileNumber').notEmpty(),
        check('age').notEmpty(),
        check('branchOfStudy').notEmpty(),
        check('ideaTitle').notEmpty(),
        check('ideaDescription').notEmpty(),
    ],
    ideasControllers.createIdea
)

// Update an idea
router.patch('/:eid', ideasControllers.updateIdea)

// Delete an idea
router.delete('/:eid', ideasControllers.deleteIdea)

module.exports = router