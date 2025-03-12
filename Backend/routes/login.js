const express = require('express');
const router = express.Router();
const passport = require('passport'); // Import passport
const User = require('../model/UserSchema.js'); // Ensure this path is correct
const bcrypt = require('bcrypt');
const localStrategy = require('../strategies/local.js');
const jwt = require('jsonwebtoken');

// Render the login page with pre-filled cookies if available
router.get('/', (req, res) => {
    // Extract cookies for pre-filling login page
    const username = req.cookies.username || '';
    const password = req.cookies.password || '';

    // Render the login page with pre-filled values
    res.render('login', { username, password });
});

// Function to sign a token
const signToken = (username, accessLevel) => {
    return jwt.sign({ username, accessLevel }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust the secret as necessary
};

// Handle the login form submission
router.post('/', (req, res, next) => {
    //Retrieve these const variables from the req body
    const username = req.body.username;
    const accessLevel = req.body.accessLevel;
    const remember = req.body.remember;
    const password  = req.body.password;


    passport.authenticate('local', (err, user, info) => {
        // Invokes the 'local' authentication strategy to validate the user credentials.

        if (err) {
            // If an error occurs during the authentication process, log it and send a 500 response
            // indicating an internal server error.
            console.error('Authentication error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
            // If no user is found (invalid username or password), respond with an error
            // and include the error message from the `info` object (provided by Passport)
            return res.status(401).json({ error: info.message }); // Invalid username/password
        }



        if (remember) {
            // If the 'Remember Me' option is selected, set HTTP-only cookies to store the username
            // and password for 60 days. These cookies are inaccessible to client-side scripts for security.
            res.cookie('username', username, { httpOnly: true, maxAge: 60 * 24 * 60 * 60 * 1000 }); // 60 days
            res.cookie('password', password, { httpOnly: true, maxAge: 60 * 24 * 60 * 60 * 1000 }); // 60 days
        }
        else {
            //Clears these cookies if the remember is not clicked
            res.clearCookie('password');
            res.clearCookie('username');
            res.clearCookie('token');
        }

        // Logs the authenticated user into the session using Passport's `req.logIn` method
        req.logIn(user, async (err) => {
            if (err) {
                console.error('Failed to log in user after registration:', err);
                return res.status(500).json({ error: info.message });
            }

            // Generates a token
            const token = signToken(user.username, user.accessLevel);

            // Stores the token in the user's database record (update the token field)
            user.token = token;
            await user.save();  // Saves the updated user document

            // Sets the token as a cookie
            res.cookie('token', token, {httpOnly: true, maxAge: 86400000});


            // Send the token and accessLevel to the frontend
            return res.json({
                success: true,
                token: token,
                accessLevel: user.accessLevel,
                user: user,
            });
        });
    })(req, res, next);
});

module.exports = router;