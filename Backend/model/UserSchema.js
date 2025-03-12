// models/User.js
const mongoose = require('mongoose');

// Define the schema for a user
const UserSchema = new mongoose.Schema({
    username: {
        type: String, // The user's username
        required: true, // This field is mandatory
        unique: true // Ensure the username is unique in the database
    },
    password: {
        type: String, // The user's password (hashed)
        required: true // This field is mandatory
    },
    accessLevel: {
        type: String, // The user's access level
        enum: ['read', 'write', 'admin'], // Allowed values for access levels
    },
    token: {
        type: String, // Field to store a JWT token if needed
        required: false // Optional field
    }
}, {
    timestamps: true
});

// Export the User model
module.exports = mongoose.model('User', UserSchema);
