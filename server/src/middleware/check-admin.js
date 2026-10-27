const User = require('../models/user');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    const userId = req.userData?.userId;

    // If there's no userId, that means the user is not authenticated
    if (!userId) {
        const error = new HttpError('Authentication failed', 401);
        return next(error);
    }

    // Find the user by their ID and check their role
    User.findById(userId)
        .then((user) => {
            if (!user) {
                throw new Error('User not found');
            }
            if (user.role !== 'admin') {
                throw new Error('Permission denied: admins only');
            }
            next(); // User is authenticated and has the 'admin' role
        })
        .catch((err) => {
            const error = new HttpError('Permission denied: admins only', 403);
            return next(error); // Admin check failed
        });
};
