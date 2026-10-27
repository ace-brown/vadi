const express = require('express')
const { check } = require('express-validator')

const usersControllers = require('../controllers/users-controllers')
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = express.Router()

// Create a new user
router.post('/signup', [
    check('username')
        .trim()
        .isLength({ min: 3, max: 40 }),
    check('fullName')
        .trim()
        .isLength({ min: 1, max: 100 }),
    check('email')
        .normalizeEmail()
        .isEmail(),
    check('password')
        .isLength({ min: 6, max: 128 }),
], usersControllers.signup)

// Log in a user
router.post('/login', [
    check('email')
        .normalizeEmail()
        .isEmail(),
    check('password')
        .isString()
        .notEmpty(),
], usersControllers.login)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Get the list of users
router.get('/', checkAdmin, usersControllers.getUsers)

// Get a user (yourself, or anyone if you are an admin)
router.get('/:uid', usersControllers.getUserById)

// Update a user
router.patch('/:uid', [
    check('username').optional().trim().isLength({ min: 3, max: 40 }),
    check('fullName').optional().trim().isLength({ min: 1, max: 100 }),
    check('email').optional().normalizeEmail().isEmail(),
    check('password').optional({ values: 'falsy' }).isLength({ min: 6, max: 128 }),
    check('bio').optional().isString().isLength({ max: 1000 }),
    check('avatar').optional().isString().isLength({ max: 300 }),
    check('language').optional().isIn(['en', 'fa']),
    check('notifications').optional().isBoolean(),
], usersControllers.updateUser)

// Route to update the role of a user
router.patch('/:uid/role', checkAdmin, usersControllers.updateRole)

// Delete a user
router.delete('/:uid', usersControllers.deleteUser)


module.exports = router
