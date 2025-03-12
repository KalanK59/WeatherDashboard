// authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.user.token; // Use cookies instead of Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
         // Assuming you use a secret key
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Attach the decoded user data to the request
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Middleware to check for write or admin access levels
const hasWriteAccess = (req, res, next) => {
    console.log('User Access Level:', req.user ? req.user.accessLevel : 'No user data'); // Debugging line

    if (req.user.accessLevel === 'write' || req.user.accessLevel === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
};

module.exports = { verifyToken, hasWriteAccess };