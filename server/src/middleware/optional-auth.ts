import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import type { TokenPayload } from '../controllers/users-controllers';

// Like check-auth, but never rejects: a valid token just adds req.userData (with the role)
const optionalAuth: RequestHandler = async (req, _res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
        const user = await User.findById(decodedToken.userId).select('role');
        if (user) {
            req.userData = { userId: decodedToken.userId, role: user.role };
        }
    } catch {
        // An invalid or expired token is treated like no token
    }
    next();
};

export default optionalAuth;
