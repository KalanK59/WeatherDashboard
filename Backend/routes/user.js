const express = require('express');
const router = express.Router();
const User = require('../model/UserSchema.js'); // Assuming you have a User model for database interactions
// Handle deletion of user account
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Make sure to include bcrypt for hashing passwords

// Renders the user profile confirmation page
router.get('/confirm', async (req, res) => {
    const id = req.user.id;
    const username = req.user.username;
    if (!id) {
        return res.status(400).send('No username found in cookies');
    }
    res.render('userprofile', { id, username });
});

// Renders the page for updating user credentials
router.get("/userCredentials", async (req, res) => {
    const id = req.user.id;
    const username = req.user.username;
    const password  = req.user.password;
    if (!id) {
        return res.status(400).send('No username found in cookies');
    }

    res.render('updateCredentials', { id, username, password });
})

// Handles the username and password updating
router.put('/update-username/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the user ID from the request parameters
        const { newUsername, newPassword } = req.body;
        console.log('Received request:', req.body);

        // Validation for username and password
        if (!newUsername || !newPassword) {
            return res.status(400).json({ message: 'Both username and password are required' });
        }

        // Validates the user ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user using their id
        const user = await User.findByIdAndUpdate(
            id, // Use the ID directly
            { username: newUsername, password: hashedPassword },
            { new: true } // Return the updated user document
        );

        // Handles non existent users
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Sends success response
        res.status(200).json({ message: `User '${user.username}' updated successfully` });
    } catch (err) {
        // Handles server errors
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});



// Route to handle the deletion of a user account based on their ID
router.delete('/delete-username/:id', async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const { id } = req.params;
        console.log("Received: " + id);

        // Validate the ID to ensure it is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' }); // Respond with an error if the ID format is invalid
        }

        // Attempt to find and delete the user from the database using the ID
        const user = await User.findByIdAndDelete(id);

        // If the user is not found in the database, return a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with a success message if the user is successfully deleted
        res.status(200).json({ message: `User with ID '${id}' deleted successfully` });
        res.render("login"); // Render the login page after deletion (optional)
    } catch (err) {
        // Handle any server or database errors and respond with a 500 status code
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;