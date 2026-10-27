const express = require('express');

const { createResourceControllers } = require('../controllers/resource-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const optionalAuth = require('../middleware/optional-auth');

// Reading is public; creating, updating and deleting require an admin
function createResourceRouter(Model, options) {
    const controllers = createResourceControllers(Model, options);
    const router = express.Router();

    // optionalAuth lets admins see inactive items with ?includeInactive=true
    router.get('/', optionalAuth, controllers.list);
    router.get('/:id', optionalAuth, controllers.getOne);
    router.post('/', checkAuth, checkAdmin, fileUpload.single('image'), controllers.create);
    router.patch('/:id', checkAuth, checkAdmin, fileUpload.single('image'), controllers.update);
    router.delete('/:id', checkAuth, checkAdmin, controllers.remove);

    return router;
}

module.exports = createResourceRouter;
