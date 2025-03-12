const express = require('express');
const router = express.Router();
const Comment = require('../model/CommentSchema.js');
const Reply = require('../model/Reply.js');
const { verifyToken, hasWriteAccess } = require('../authMiddleware.js');
const mongoose = require('mongoose');
const User = require("../model/UserSchema"); // Import the middleware

// Get all comments (no authentication needed)
router.get('/', async (req, res) => {
    try {
        // Get all comments
        const allComments = await Comment.find().populate('replies');
        console.log(allComments);  // Debugging line
        const username = req.user.username;
        const id = allComments.length > 0 ? allComments[0]._id : null; // Example: Use the first comment's ID

        // Render the form with comments and username
        res.render('form', { comments: allComments, username: username, id: id });

    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
});

// Post a new comment (authentication and authorization required)
router.post('/', verifyToken, hasWriteAccess, async (req, res) => {
    try {
        let username = req.user.username || 'Guest';

        // Use the Date object directly instead of toLocaleString()
        const newComment = new Comment({
            text: req.body.commentText,
            username: username,
            date: new Date()
        });

        await newComment.save();
        //Redirct to this page as the comment will then be visible to the page.
        res.redirect('/weather/comments');
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
});

//Gets the edit comment pagethat is then rendereded in the page
router.get('/edit/:id', verifyToken, hasWriteAccess, async (req, res) => {
    try {
        // Extract the comment ID from the URL
        const { id } = req.params;

        //Displays this if no ID is passed with the specific comment that you want to edit
        if (!id) {
            return res.status(400).send('No comment ID provided');
        }

        // Find the comment by ID
        const comment = await Comment.findById(id);

        //Display if the comment is not found
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        // Pass the comment and the ID to the view
        res.render('editComment', { comment, id });
    }
    catch (error) {
        res.status(500).send('Error fetching comment');
    }
});

// Update a comment
router.put('/edit/:id', verifyToken, hasWriteAccess, async (req, res) => {
    try {
        // Logs the comment ID
        console.log("Received ID:", req.params.id);
        // Logs the request body
        console.log("Received Body:", req.body);

        //The fields that are going to be getting updated, by the passing these fields from the editComment page that is then rendered.
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            { text: req.body.commentText, date: new Date() },
            { new: true }
        );

        //Nothing to be updated.
        if (!updatedComment) {
            console.log("Comment not found");
            return res.status(404).json({ message: 'Comment not found' }); // Logs if the comment doesn't exist
        }
        // Logs if the comment updated, with the updated comment.
        console.log("Updated Comment:", updatedComment);
        //Displays to the user the comment is updated successfully message
        res.status(200).json({ message: 'Comment updated successfully!' });
    }
    catch (error) {
        // Error if encountered
        res.status(500).json({ message: 'Error updating'});
    }
});


// Delete comment route
router.delete('/delete/:id', verifyToken, hasWriteAccess, async (req, res) => {
    try {
        //Used to store the parameters
        const { id } = req.params;
        //For displaying what is received
        console.log("Received: " + id);

        // Find the comment and ensure it exists
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // If the comment has replies, delete them
        await Reply.deleteMany({comment: comment._id});

        // Delete the comment
        await Comment.findByIdAndDelete(id);
        //Displays the comment and replies associated with it are deleted successfully
        res.json({ message: 'Comment and its replies deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting comment and replies' });
    }
});

//Used for posting the specific reply to the specific comment that you have selected
router.post('/reply/:id', verifyToken, hasWriteAccess, async (req, res) => {
    try {
        //If no username is found in the db then the default user is Guest
        let username = req.user.username || 'Guest';

        // Validate the comment ID
        const comment = await Comment.findById(req.params.id);
        //No comment is found
        if (!comment) {
            return res.status(404).send("Comment not found");
        }

        // Create the new reply, with the specific fields
        const newReply = new Reply({
            text: req.body.replyText,
            username: username,
            date: new Date(),
            comment: comment.id,
        });
        //Saves the newReply that was created
        await newReply.save();

        // Link the reply to the comment
        comment.replies.push(newReply._id);
        await comment.save();

        //Used to reload the page and display the comment updated
        res.redirect("/weather/comments")
    } catch (error) {
        res.status(500).json({message: "Error creating reply"});
    }
});

//Gets the page where you will edit the replies
router.get('/reply/edit/:id', verifyToken, hasWriteAccess, async (req, res) => {
    try {
        // Extract the reply ID from the URL
        const { id } = req.params;

        //No reply id is provided with the specific reply that you are trying to editing
        if (!id) {
            return res.status(400).send('No reply ID provided');
        }

        // Find the reply by ID
        const reply = await Reply.findById(id).populate('comment');  // Populate the comment for this reply

        //Reply is not found that you are trying to edit
        if (!reply) {
            return res.status(404).send('Reply not found');
        }

        // Passes both the reply and the comment to the view
        res.render('editReply', { comment: reply, id });
    } catch (error) {
        console.error("Error fetching reply for editing:", error);
        res.status(500).json({message: 'Error fetching reply'});
    }
});

// Update a reply
router.put('/reply/:id', verifyToken, hasWriteAccess, async (req, res) => {
    try {
        // Logs the reply ID
        console.log("Received ID:", req.params.id);
        // Logs the request body
        console.log("Received Body:", req.body);

        // Finds the reply through an ID and updates its text and date
        const updatedReply = await Reply.findByIdAndUpdate(
            req.params.id,
            { text: req.body.replyText, date: new Date() },
            { new: true }
        );
        // Logs if the reply doesn't exist
        if (!updatedReply) {
            console.log("Reply not found");
            return res.status(404).json({ message: 'Comment not found' });
        }
        // Logs the updated reply
        console.log("Updated Comment:", updatedReply);
        //Displays the reply updated sucessfully.
        res.status(200).json({ message: 'Reply updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating reply'});
    }
});

module.exports = router;
