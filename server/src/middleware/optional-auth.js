const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Like check-auth, but never rejects: a valid token just adds req.userData (with the role)
module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.userId).select('role');
        if (user) {
            req.userData = { userId: decodedToken.userId, role: user.role };
        }
    } catch (err) {
        // An invalid or expired token is treated like no token
    }
    next();
};
