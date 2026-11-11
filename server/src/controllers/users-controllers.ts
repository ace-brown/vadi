import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose, { type HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import HttpError from '../models/http-error';
import User, { type IUser } from '../models/user';
import Review from '../models/review';
import PriceAlert from '../models/price-alert';

const SALT_ROUNDS = 12;

// What the login token contains
export interface TokenPayload {
    userId: string;
    email: string;
}

type UserDoc = HydratedDocument<IUser>;

function isBcryptHash(value: string): boolean {
    return /^\$2[aby]\$\d{2}\$/.test(value);
}

function createToken(user: UserDoc): string {
    const payload: TokenPayload = { userId: user.id, email: user.email };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
}

function authResponse(user: UserDoc, token: string) {
    return {
        userId: user.id,
        email: user.email,
        fullName: user.profile.fullName,
        username: user.username,
        role: user.role,
        token: token,
    };
}

// Users may only read or change their own account, unless they are an admin.
// Only used behind check-auth, so req.userData is set.
async function checkCanAccessUser(req: Request, uid: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(uid)) {
        throw new HttpError('Invalid user ID', 400);
    }
    const { userId } = req.userData!;
    if (userId === uid) {
        return;
    }
    const requester = await User.findById(userId);
    if (!requester || requester.role !== 'admin') {
        throw new HttpError('You are not allowed to access this user', 403);
    }
}

// Get a user's data
export async function getUserById(req: Request, res: Response, next: NextFunction) {
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
export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Parse and validate `page` and `limit`
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const perPage = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 10));

        const users = await User.find({})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        // Count total users in the database for pagination metadata
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            users: users.map((user) => user.toObject({ getters: true })),
            totalUsers,
            currentPage,
            totalPages: Math.ceil(totalUsers / perPage),
        });
    } catch {
        return next(new HttpError(
            'Fetching user data failed. Please try again later.',
            500
        ));
    }
}

// Create a new user
export async function signup(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input, please check your data.', 422));
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
            profile: { fullName },
        });

        res.status(201).json(authResponse(createdUser, createToken(createdUser)));
    } catch (err) {
        console.error('Error signing up:', err);
        return next(new HttpError('Signing up failed, please try again later.', 500));
    }
}

// Log in an existing user
export async function login(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid credentials, could not log you in.', 401));
    }

    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return next(new HttpError('Invalid credentials, could not log you in.', 401));
        }

        let isValidPassword: boolean;
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
export async function updateUser(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input, please check your data.', 422));
    }

    const userId = req.params.uid;
    const updates = req.body;

    try {
        await checkCanAccessUser(req, userId);

        if (updates.role !== undefined) {
            return next(new HttpError('Use the role endpoint to change a role', 403));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError('Could not find a user for the provided ID', 404));
        }

        // Only these fields can be changed here
        for (const key of ['fullName', 'bio', 'avatar'] as const) {
            if (updates[key] !== undefined) user.profile[key] = updates[key];
        }
        if (updates.language !== undefined) user.settings.language = updates.language;
        if (updates.notifications !== undefined) user.settings.notifications = updates.notifications;
        for (const key of ['username', 'email'] as const) {
            if (updates[key] !== undefined) user[key] = updates[key];
        }
        if (updates.password) {
            user.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
        }

        await user.save();

        res.status(200).json({ user: user.toObject({ getters: true }) });
    } catch (err) {
        if (err instanceof HttpError) return next(err);
        if ((err as { code?: number }).code === 11000) {
            return next(new HttpError('That username or email is already taken', 422));
        }
        console.error(err);
        return next(new HttpError('Updating the user failed, please try again later', 500));
    }
}

// Update user role
export async function updateRole(req: Request, res: Response, next: NextFunction) {
    const { uid } = req.params;
    const { role } = req.body; // The role you want to assign (e.g., 'admin')

    // Validate that the role is either 'admin' or 'user'
    if (role !== 'admin' && role !== 'user') {
        return next(new HttpError('Invalid role', 400));
    }
    if (!mongoose.Types.ObjectId.isValid(uid)) {
        return next(new HttpError('Invalid user ID', 400));
    }

    try {
        const user = await User.findById(uid);
        if (!user) {
            return next(new HttpError('User not found', 404));
        }

        user.role = role;
        await user.save();

        return res.status(200).json({ message: `User role updated to ${role}` });
    } catch {
        return next(new HttpError('Updating the role failed', 500));
    }
}

// Delete user
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.uid;

    try {
        await checkCanAccessUser(req, userId);

        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError('Could not find a user for the provided ID', 404));
        }

        await Review.deleteMany({ user: user._id });
        await PriceAlert.deleteMany({ user: user._id });
        await user.deleteOne();

        res.status(200).json({ message: 'User and all related data deleted successfully' });
    } catch (err) {
        if (err instanceof HttpError) return next(err);
        return next(new HttpError('Deleting the user failed, please try again later', 500));
    }
}
