import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import HttpError from '../models/http-error';
import type { TokenPayload } from '../controllers/users-controllers';

const checkAuth: RequestHandler = (req, _res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error('Authentication failed');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
        req.userData = { userId: decodedToken.userId };
        next();
    } catch {
        const error = new HttpError('Authentication failed', 401);
        return next(error);
    }
};

export default checkAuth;
