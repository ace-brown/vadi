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
    // Only allow plain file names, so "../" can't reach files outside the docs folder
    const filename = path.basename(req.params.filename);
    const docsDir = path.join(__dirname, '..', 'public', 'docs');
    const filePath = path.join(docsDir, filename);
    if (filename !== req.params.filename || !filePath.startsWith(docsDir + path.sep)) {
        return next(new HttpError('File not found', 404));
    }

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return next(new HttpError('File not found', 404));
        }

        // Extract the file extension
        const ext = path.extname(filename).slice(1).toLowerCase();

        // Get the appropriate mime type for the file extension
        const mimeType = mimeTypes[ext];

        if (!mimeType) {
            return next(new HttpError('File type not supported', 415));
        }

        // Set appropriate headers for downloading the file
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        res.setHeader('Content-Type', mimeType);

        // Stream the file to the client
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    });
}

exports.downloadDocs = downloadDocs;
