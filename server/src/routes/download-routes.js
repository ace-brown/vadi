const express = require('express')

const router = express.Router()

const downloadControllers = require('../controllers/download-controllers')


router.get('/:filename', downloadControllers.downloadDocs)

module.exports = router