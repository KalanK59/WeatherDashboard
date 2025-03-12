const mongoose = require('mongoose');

// Defines the schema for a comment
const CommentSchema = new mongoose.Schema({
    text: {
        type: String, // The content of the comment
        required: true // This field is mandatory
    },
    username: {
        type: String, // The username of the person who made the comment
        required: true // This field is mandatory
    },
    date: {
        type: Date, // The date the comment was created
        default: Date.now // The current date and time
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId, // Array of ObjectIds referencing replies
        ref: 'Reply'
    }]
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

// Exports the Comment model
module.exports = mongoose.model('Comment', CommentSchema);
