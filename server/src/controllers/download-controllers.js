const path = require('path');
const fs = require('fs');
const HttpError = require('../models/http-error');

const mimeTypes = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    mkv: 'video/x-matroska',
};

async function downloadDocs(req, res, next) {
    const { filename } = req.params;

    // Define the path where your files are stored
    const filePath = path.join(__dirname, '..', 'public', 'docs', filename);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return next(new HttpError('فایل پیدا نشد', 404));
        }

        // Extract the file extension
        const ext = path.extname(filename).slice(1).toLowerCase();

        // Get the appropriate mime type for the file extension
        const mimeType = mimeTypes[ext];

        if (!mimeType) {
            return next(new HttpError('نوع فایل پشتیبانی نمی‌شود', 415));
        }

        // Set appropriate headers for downloading the file
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', mimeType);

        // Stream the file to the client
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    });
}

exports.downloadDocs = downloadDocs;
