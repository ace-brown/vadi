import express from 'express';

import { createResourceControllers, type AnyModel, type ResourceOptions } from '../controllers/resource-controllers';
import fileUpload from '../middleware/file-upload';
import checkAuth from '../middleware/check-auth';
import checkAdmin from '../middleware/check-admin';
import optionalAuth from '../middleware/optional-auth';

// Reading is public; creating, updating and deleting require an admin
export default function createResourceRouter(Model: AnyModel, options: ResourceOptions) {
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
