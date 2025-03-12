const express = require('express');
const router = express.Router();
const User = require('../model/UserSchema');
const bcrypt = require('bcrypt');
const passport = require("passport");
const jwt = require('jsonwebtoken');


// Render the registration page
router.get('/', (req, res) => {
    res.render('register'); // Ensure you have a register.pug file
});

// Function to sign a token
const signToken = (username, accessLevel) => {
    return jwt.sign({ username, accessLevel }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjusts the secret as necessary
};

// Handle registration logic
router.post('/', async (req, res) => {
    const { username, password, accessLevel } = req.body;

    // Input Validation
    if (!username && !password) {
        return res.status(400).json({ error: 'Please fill out both Username and Password.' });
    }

    if (!username) {
        return res.status(400).json({ error: 'Please fill out the Username field.' });
    }

    if (!password) {
        return res.status(400).json({ error: 'Please fill out the Password field.' });
    }
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create a new user with hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, accessLevel });
        await newUser.save();


        // Log in the user after successful registration
        req.login(newUser, async (err) => {
            if (err) {
                console.error('Failed to log in user after registration:', err);
                return res.status(500).json({error: 'Failed to log in user after registration'});
            }

            // Generate a token
            const token = signToken(username, accessLevel);

            // Store the token in the user's database record (update the token field)
            newUser.token = token;  // Assuming you added a 'token' field to your User schema
            await newUser.save();  // Save the updated user document

            // Set the token as a cookie
            res.cookie('token', token, {httpOnly: true, maxAge: 86400000});

            //Console.log the page for the Registration being successful and then return success as true.
            console.log("Registration successful");

            return res.json({success: true});
        });
    }
    catch (error) {
        // Send a 500 status code response with a JSON object indicating a server error
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Export the router
module.exports = router;