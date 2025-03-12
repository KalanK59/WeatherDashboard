// passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../model/UserSchema'); // Ensure this path points to your User model

// Configure the local strategy for authentication
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect Credentials.' });
        }

        // Compare the hashed password with the provided password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        // Authentication succeeded
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize user ID into session
passport.serializeUser((user, done) => {
    console.log('Serializing user ID:', user.id);
    done(null, user.id, user.username); // Store the user ID in the session
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user ID:', id);
    try {
        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            console.error('User not found for ID:', id);
            return done(new Error('User not found'));
        }
        done(null, user); // Attach the user to the request object
    } catch (error) {
        console.error('Error deserializing user:', error);
        done(error);
    }
});

// Export the configured passport
module.exports = passport;
