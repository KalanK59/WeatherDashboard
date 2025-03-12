const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
    destination: 'uploads/', // Destination folder for uploads
    filename: (req, file, cb) => {
        // Create a unique filename using the timestamp
        cb(null, Date.now() + ' ' + file.originalname); //name coming from the client
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Set limit to 5MB per image
    },
    fileFilter: (req, file, cb) => {
        // Allowed file extensions
        if (file.mimetype.startsWith('image/')) {
            //callback returns true
            cb(null, true);
        } else {
            return cb(new Error('Only image file types allowed'));
        }
    }
});

// Handle file upload
router.post('/uploadMulti', upload.array("image", 5), function (req, res, next) {
    res.send('Images Uploaded Successful');
});

module.exports = router;