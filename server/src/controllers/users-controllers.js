const { validationResult } = require("express-validator")
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Review = require("../models/review");
const PriceAlert = require("../models/price-alert");

const SALT_ROUNDS = 12;

function isBcryptHash(value) {
    return /^\$2[aby]\$\d{2}\$/.test(value);
}

function createToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

function authResponse(user, token) {
    return {
        userId: user.id,
        email: user.email,
        fullName: user.profile.fullName,
        username: user.username,
        role: user.role,
        token: token
    };
}

// Users may only read or change their own account, unless they are an admin
async function checkCanAccessUser(req, uid) {
    if (!mongoose.Types.ObjectId.isValid(uid)) {
        throw new HttpError("Invalid user ID", 400);
    }
    if (req.userData.userId === uid) {
        return;
    }
    const requester = await User.findById(req.userData.userId);
    if (!requester || requester.role !== 'admin') {
        throw new HttpError("You are not allowed to access this user", 403);
    }
}

// Get a user's data
async function getUserById(req, res, next) {
    try {
        const { uid } = req.params;
        await checkCanAccessUser(req, uid);

        const user = await User.findById(uid);
        if (!user) {
            return next(new HttpError('User not found', 404));
        }

        res.status(200).json({ user: user.toObject({ getters: true }) });
    } catch (err) {
        if (err instanceof HttpError) return next(err);
        console.error(err);
        return next(new HttpError('Fetching user data failed. Please try again later.', 500));
    }
}

// Get all users
async function getUsers(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Parse and validate `page` and `limit`
        const currentPage = Math.max(1, parseInt(page, 10) || 1);
        const perPage = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

        const users = await User.find({})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        // Count total users in the database for pagination metadata
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            users: users.map(user => user.toObject({ getters: true })),
            totalUsers,
            currentPage,
            totalPages: Math.ceil(totalUsers / perPage)
        });
    } catch (err) {
        return next(new HttpError(
            'Fetching user data failed. Please try again later.',
            500
        ));
    }
}

// Create a new user
async function signup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input, please check your data.", 422));
    }

    const { username, email, password, fullName } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return next(new HttpError('User already exists, please log in instead.', 422));
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const createdUser = await User.create({
            username,
            email,
            password: hashedPassword,
            profile: { fullName }
        });

        res.status(201).json(authResponse(createdUser, createToken(createdUser)));
    } catch (err) {
        console.error('Error signing up:', err);
        return next(new HttpError('Signing up failed, please try again later.', 500));
    }
}

// Log in an existing user
async function login(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid credentials, could not log you in.", 401));
    }

    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return next(new HttpError('Invalid credentials, could not log you in.', 401));
        }

        let isValidPassword;
        if (isBcryptHash(existingUser.password)) {
            isValidPassword = await bcrypt.compare(password, existingUser.password);
        } else {
            // Accounts created before passwords were hashed: check once, then upgrade
            isValidPassword = password === existingUser.password;
            if (isValidPassword) {
                existingUser.password = await bcrypt.hash(password, SALT_ROUNDS);
                await existingUser.save();
            }
        }

        if (!isValidPassword) {
            return next(new HttpError('Invalid credentials, could not log you in.', 401));
        }

        res.json(authResponse(existingUser, createToken(existingUser)));
    } catch (err) {
        console.error('Error logging in:', err);
        return next(new HttpError('Logging in failed, please try again later.', 500));
    }
}

// Update an existing user
async function updateUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input, please check your data.", 422));
    }

    const userId = req.params.uid;
    const updates = req.body;

    try {
        await checkCanAccessUser(req, userId);

        if (updates.role !== undefined) {
            return next(new HttpError("Use the role endpoint to change a role", 403));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError("Could not find a user for the provided ID", 404));
        }

        // Only these fields can be changed here
        for (const key of ['fullName', 'bio', 'avatar']) {
            if (updates[key] !== undefined) user.profile[key] = updates[key];
        }
        for (const key of ['language', 'notifications']) {
            if (updates[key] !== undefined) user.settings[key] = updates[key];
        }
        for (const key of ['username', 'email']) {
            if (updates[key] !== undefined) user[key] = updates[key];
        }
        if (updates.password) {
            user.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
        }

        await user.save();

        res.status(200).json({ user: user.toObject({ getters: true }) });
    } catch (err) {
        if (err instanceof HttpError) return next(err);
        if (err.code === 11000) {
            return next(new HttpError("That username or email is already taken", 422));
        }
        console.error(err);
        return next(new HttpError("Updating the user failed, please try again later", 500));
    }
}

// Update user role
async function updateRole(req, res, next) {
    const { uid } = req.params;
    const { role } = req.body; // The role you want to assign (e.g., 'admin')

    // Validate that the role is either 'admin' or 'user'
    if (role !== 'admin' && role !== 'user') {
        return next(new HttpError('Invalid role', 400));
    }
    if (!mongoose.Types.ObjectId.isValid(uid)) {
        return next(new HttpError("Invalid user ID", 400));
    }

    try {
        const user = await User.findById(uid);
        if (!user) {
            return next(new HttpError('User not found', 404));
        }

        user.role = role;
        await user.save();

        return res.status(200).json({ message: `User role updated to ${role}` });
    } catch (err) {
        return next(new HttpError('Updating the role failed', 500));
    }
};

// Delete user
async function deleteUser(req, res, next) {
    const userId = req.params.uid;

    try {
        await checkCanAccessUser(req, userId);

        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError("Could not find a user for the provided ID", 404));
        }

        await Review.deleteMany({ user: user._id });
        await PriceAlert.deleteMany({ user: user._id });
        await user.deleteOne();

        res.status(200).json({ message: "User and all related data deleted successfully" });
    } catch (err) {
        if (err instanceof HttpError) return next(err);
        return next(new HttpError("Deleting the user failed, please try again later", 500));
    }
}


exports.getUserById = getUserById
exports.getUsers = getUsers
exports.signup = signup
exports.login = login
exports.deleteUser = deleteUser
exports.updateUser = updateUser
exports.updateRole = updateRole
