const multer = require('multer');
const path = require('path');
const uuid = require('uuid').v4;

const HttpError = require('../models/http-error');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
};

const fileUpload = multer({
    limits: { fileSize: 500000 }, // limit to ~0.5MB
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '..', '..', 'uploads', 'images'));
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid() + '.' + ext);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (MIME_TYPE_MAP[file.mimetype]) {
            cb(null, true);
        } else {
            cb(new HttpError('Only PNG, JPEG and WebP images are allowed', 422));
        }
    },
});

module.exports = fileUpload;
