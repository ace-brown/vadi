const express = require('express');

const { createResourceControllers } = require('../controllers/resource-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

// Reading is public; creating, updating and deleting require an admin
function createResourceRouter(Model, options) {
    const controllers = createResourceControllers(Model, options);
    const router = express.Router();

    router.get('/', controllers.list);
    router.get('/:id', controllers.getOne);
    router.post('/', checkAuth, checkAdmin, fileUpload.single('image'), controllers.create);
    router.patch('/:id', checkAuth, checkAdmin, fileUpload.single('image'), controllers.update);
    router.delete('/:id', checkAuth, checkAdmin, controllers.remove);

    return router;
}

module.exports = createResourceRouter;
