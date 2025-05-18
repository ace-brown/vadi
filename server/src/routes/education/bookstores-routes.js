const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../../middleware/file-upload');

const Bookstores = require('../../controllers/education/bookstores-controllers')
const checkAuth = require('../../middleware/check-auth');

const router = express.Router()


// Get all Bookstores 
router.get('/', Bookstores.getBookstores)

// Middleware to block any requests that dosen't have jwt credentials
router.use(checkAuth);

// Create a new Bookstore
router.post('/', fileUpload.single('image'), Bookstores.createBookstore)

// Update a Bookstore
// router.patch('/:mtid', Bookstores.updateIdea)

// Delete a Bookstore
// router.delete('/:mtid', Bookstores.deleteIdea)

module.exports = router