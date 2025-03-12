// Import necessary modules and the User model
const express = require('express');
const router = express.Router();
const User = require("../model/UserSchema");

// Route to fetch all users from the database
router.get("/userOnPage", async (req, res) => {
    try {
        // Retrieve all users from the database
        const users = await User.find();
        res.json(users); // Send the list of users as a JSON response
    } catch (error) {
        // Handle any server errors and send a 500 status code
        res.status(500).send('Server Error');
    }
});

// Route to delete a user by their ID
router.delete("/deleteUser/:id", async (req, res) => {
    // Extract the user ID from the request parameters
    const userId = req.params.id;
    console.log("Received userId for deletion:", userId); // Log the user ID for debugging

    try {
        // Find and delete the user in the database
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            // If the user is not found, return a 404 error
            return res.status(404).json({ message: 'User not found' });
        }
        // Respond with a success message if deletion is successful
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        // Handle any server errors and send a 500 status code
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to update a user's details by their ID
router.put("/updateUser/:id", async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const userId = req.params.id;
        console.log("Received userId for update:", userId); // Log the user ID for debugging

        // Extract the updated user data from the request body
        const updatedData = req.body;

        // Find the user by ID and update their details, returning the updated document
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!user) {
            // If the user is not found, return a 404 error
            return res.status(404).json({ message: 'User not found' });
        }
        // Respond with the updated user data as JSON
        res.status(200).json(user);
    } catch (error) {
        // Handle any server errors and send a 500 status code
        res.status(500).json({ message: 'Server Error' });
    }
});

// Export the router to be used in the application
module.exports = router;
