const express = require('express')
const { check } = require('express-validator')

const usersControllers = require('../controllers/users-controllers')
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = express.Router()

// Create a new user
router.post('/signup', [
    check('username')
        .notEmpty(),
    check('email')
        .normalizeEmail()
        .isEmail(),
    check('password')
        .isLength({ min: 6 }),
    check('fullName')
        .notEmpty()
], usersControllers.signup)

// Log in a user
router.post('/login', usersControllers.login)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Get current user 
router.get('/:uid', usersControllers.getUserById)

// Get the list of users 
router.get('/', checkAdmin, usersControllers.getUsers)

// Update a user
router.patch('/:uid', usersControllers.updateUser)

// Route to update the role of a user
router.patch('/:uid/role', checkAdmin, usersControllers.updateRole)

// Delete a user
router.delete('/:uid', usersControllers.deleteUser)


module.exports = router