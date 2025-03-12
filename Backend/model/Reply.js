const mongoose = require('mongoose');

// Defines the schema for a reply
const ReplySchema = new mongoose.Schema({
    text: {
        type: String, // The content of the reply
    },
    username: {
        type: String, // The username of the person who made the reply
    },
    date: {
        type: Date, // The date the reply was created
        default: Date.now // Defaults to the current date and time
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId, // ObjectId referencing the related comment
        ref: 'Comment' // Refers to the Comment model
    }
});

// Export the Reply model
module.exports = mongoose.model('Reply', ReplySchema);
