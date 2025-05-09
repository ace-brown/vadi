const { validationResult } = require("express-validator")
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");
const User = require("../models/user");


// Get the current user data
async function getUserById(req, res, next) {
    try {
        const { uid } = req.params;

        // const user = await User.findById(uid).select('-password');
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ message: 'کاربر پیدا نشد' });
        }

        res.status(200).json({ user: user.toObject({ getters: true }) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'دریافت اطلاعات کاربر با شکست مواجه شد. لطفاً بعداً دوباره تلاش کنید.' });
    }
}

// Get all users
async function getUsers(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Parse and validate `page` and `limit`
        const currentPage = Math.max(1, parseInt(page, 10));
        const perPage = Math.max(1, parseInt(limit, 10));

        // Exclude the password field for security
        const users = await User.find({}, '-password')
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
            'دریافت اطلاعات کاربر با شکست مواجه شد. لطفاً بعداً دوباره تلاش کنید.',
            500
        ));
    }
}

// Create a new user
// async function signup(req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return next(new HttpError("Invalid input passed, please check your data", 422));
//     }

//     const { username, email, password, fullName } = req.body;

//     let existingUser;
//     try {
//         existingUser = await User.findOne({ email: email });
//     } catch (err) {
//         const error = new HttpError(
//             'Signing up failed, please try again later.',
//             500
//         );
//         return next(error);
//     }

//     if (existingUser) {
//         const error = new HttpError('User exists already, please login instead.', 422);
//         return next(error);
//     }

//     let hashedPassword;
//     try {
//         hashedPassword = await bcrypt.hash(password, 12)

//     } catch (err) {
//         const error = new HttpError("Could not create user, please try again later.", 500);
//         return next(error);
//     }

//     const createdUser = new User({
//         username,
//         email,
//         password: hashedPassword,
//         profile: { fullName }
//     });


//     try {
//         await createdUser.save();
//     } catch (err) {
//         const error = new HttpError('Signing up failed, please try again later.', 500);
//         return next(error);
//     }

//     let token;
//     try {
//         token = jwt.sign(
//             { userId: createdUser.id, email: createdUser.email },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );
//     } catch (err) {
//         const error = new HttpError('Signing up failed, please try again later.', 500);
//         return next(error);
//     }

//     res.status(201).json({
//         userId: createdUser.id,
//         email: createdUser.email,
//         fullName: createdUser.profile.fullName,
//         username: createdUser.username,
//         role: createdUser.role,
//         token: token

//     })
// }
async function signup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر است، لطفاً داده‌های خود را بررسی کنید.", 422));
    }

    const { username, email, password, fullName } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'ثبت‌نام با شکست مواجه شد، لطفاً بعداً دوباره تلاش کنید.',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('کاربر از قبل وجود دارد، لطفاً به جای آن وارد شوید.', 422);
        return next(error);
    }

    // Directly use plaintext password without hashing
    const createdUser = new User({
        username,
        email,
        password, // Store plaintext password
        profile: { fullName }
    });

    try {
        await createdUser.save();
    } catch (err) {
        console.error('Error saving user:', err);
        const error = new HttpError('دریافت اطلاعات کاربر با شکست مواجه شد. لطفاً بعداً دوباره تلاش کنید.', 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError('دریافت اطلاعات کاربر با شکست مواجه شد. لطفاً بعداً دوباره تلاش کنید.', 500);
        return next(error);
    }

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        fullName: createdUser.profile.fullName,
        username: createdUser.username,
        role: createdUser.role,
        token: token
    });
}


// Login an existing user
// async function login(req, res, next) {
//     const { email, password } = req.body;

//     let existingUser;

//     try {
//         existingUser = await User.findOne({ email: email });
//     } catch (err) {
//         const error = new HttpError('Loggin in failed, please try again later.', 500);
//         return next(error);
//     }

//     if (!existingUser) {
//         const error = new HttpError('Invalid credentials, could not log you in.', 401);
//         return next(error);
//     }

//     let isValidPassword = false;
//     try {
//         isValidPassword = await bcrypt.compare(password, existingUser.password);
//     } catch (err) {
//         const error = new HttpError('Could not log you in, please check your credentials and try again.', 500);
//         return next(error);
//     }

//     if (!isValidPassword) {
//         const error = new HttpError('Invalid credentials, could not log you in.', 401);
//         return next(error);
//     }

//     let token;
//     try {
//         token = jwt.sign(
//             { userId: existingUser.id, email: existingUser.email },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );
//     } catch (err) {
//         const error = new HttpError('Logging in failed, please try again later.', 500);
//         return next(error);
//     }


//     res.json({
//         userId: existingUser.id,
//         email: existingUser.email,
//         fullName: existingUser.profile.fullName,
//         username: existingUser.username,
//         role: existingUser.role,
//         token: token
//     });
// }
async function login(req, res, next) {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('ورود با شکست مواجه شد، لطفاً بعداً دوباره تلاش کنید.', 500);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError('اطلاعات ورود نامعتبر است، امکان ورود وجود ندارد.', 401);
        return next(error);
    }

    // Directly compare passwords (plaintext comparison)
    if (password !== existingUser.password) {
        const error = new HttpError('اطلاعات ورود نامعتبر است، امکان ورود وجود ندارد.', 401);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError('ورود با شکست مواجه شد، لطفاً بعداً دوباره تلاش کنید.', 500);
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        fullName: existingUser.profile.fullName,
        username: existingUser.username,
        role: existingUser.role,
        token: token
    });
}

// Update an existing user
async function updateUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر است، لطفاً داده‌های خود را بررسی کنید.", 422));
    }

    const userId = req.params.uid;
    const updates = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(new HttpError("شناسه کاربری نامعتبر است", 400));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError("کاربری برای شناسه ارائه شده پیدا نشد", 404));
        }

        // Prevent changing the role field
        if (updates.role) {
            return next(new HttpError("شما اجازه تغییر نقش خود را ندارید", 403));
        }

        // Update user fields
        for (const key in updates) {
            if (key === 'fullName' || key === 'bio' || key === 'avatar') {
                // Update fields inside profile object
                user.profile[key] = updates[key];
            } else if (user[key] !== undefined) {
                // Update top-level fields
                user[key] = updates[key];
            }
        }

        const sess = await mongoose.startSession();
        sess.startTransaction();

        await user.save({ session: sess });

        await sess.commitTransaction();

        res.status(200).json({ user: user.toObject({ getters: true }) });
    } catch (error) {
        console.log(error);
        return next(new HttpError("بروزرسانی کاربر ناموفق بود، لطفاً بعداً دوباره تلاش کنید", 500));
    }
}

// Update user role
async function updateRole(req, res, next) {
    const { uid } = req.params;
    const { role } = req.body; // The role you want to assign (e.g., 'admin')

    // Validate that the role is either 'admin' or 'user'
    if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({ message: 'نقش نامعتبر است' });
    }

    try {
        // Find the user by their user ID
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ message: 'کاربر پیدا نشد' });
        }

        // Update the user's role
        user.role = role;
        await user.save(); // Save the changes to the database

        return res.status(200).json({ message: `User role updated to ${role}` });
    } catch (err) {
        return res.status(500).json({ message: 'بروزرسانی نقش ناموفق بود', error: err });
    }
};


// Delete user
async function deleteUser(req, res, next) {
    const userId = req.params.uid;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(new HttpError("شناسه کاربری نامعتبر است", 400));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError("کاربری برای شناسه ارائه شده پیدا نشد", 404));
        }

        await user.deleteOne();

        res.status(200).json({ message: "کاربر و تمام داده‌های مرتبط با آن با موفقیت حذف شدند" });
    } catch (error) {
        sess.abortTransaction();
        return next(new HttpError("حذف کاربر ناموفق بود، لطفاً بعداً دوباره تلاش کنید", 500));
    }
}


exports.getUserById = getUserById
exports.getUsers = getUsers
exports.signup = signup
exports.login = login
exports.deleteUser = deleteUser
exports.updateUser = updateUser
exports.updateRole = updateRole

