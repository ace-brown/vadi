import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';

import HttpError from '../models/http-error';

const MIME_TYPE_MAP: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
};

const fileUpload = multer({
    limits: { fileSize: 500000 }, // limit to ~0.5MB
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, path.join(__dirname, '..', '..', 'uploads', 'images'));
        },
        filename: (_req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid() + '.' + ext);
        },
    }),
    fileFilter: (_req, file, cb) => {
        if (MIME_TYPE_MAP[file.mimetype]) {
            cb(null, true);
        } else {
            cb(new HttpError('Only PNG, JPEG and WebP images are allowed', 422));
        }
    },
});

export default fileUpload;
