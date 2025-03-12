// Import required modules, which is express, node-fetch, and path.
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const connectDB = require('./MongoDB.js');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Requires dotenv for the .env config file
require('dotenv').config();
//Requires Mongoose
const mongoose = require('mongoose');
// Creates an instance of Express
const app = express();

const methodOverride = require('method-override');


app.use(cors());

app.use(methodOverride('_method'));
// Connects to MongoDB
connectDB();

// Starts the server
mongoose.connection.once('open', function(){
   console.log('MongoDB Connected');
   app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
   })
})

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser()); // Use cookie parser middleware

// Import comment model
const Comment = require('./model/CommentSchema');

// Imports router modules for different routes which is used throughout this program.
const weatherRouter = require('./routes/weather.js');
const uploadRouter = require('./routes/uploads.js');
const loginRouter = require('./routes/login.js');
// Imports the registration router
const registerRouter = require('./routes/register.js');
const userProfile = require('./routes/user.js');
// Imports the comment router
const commentRouter = require('./routes/comments.js');
const userInDBRouter = require('./routes/userInDB.js');


// Server static files, to make the routing easier.
app.use('/image', express.static(__dirname + '/public/img'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/html', express.static(__dirname + '/public/html'));
app.use('/js', express.static(__dirname + '/public/javascript'));


// Configure express-session with the secret from .env
app.use(session({
   secret: process.env.SESSION_SECRET, // Use the secret from .env
   resave: false,
   saveUninitialized: false,
}));

// Tracks user actions (recent activity)
app.use((req, res, next) => {
   if (!req.session.activities) {
      req.session.activities = [];
   }

   // Creates an object to store the activity
   const activity = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      method: req.method,
      url: req.originalUrl,
   };

   // Add the activity to the session array
   req.session.activities.push(activity);

   // Limit to the last 4 activities
   if (req.session.activities.length > 4) {
      // Remove the oldest activity from the list
      req.session.activities.shift();
   }

   // Make activities available in the response locals
   res.locals.activities = req.session.activities;

   // Displays the user's recent activity in the console through everything they interact with.
   // console.log(`Activity tracked: ${req.method} - ${req.originalUrl} at ${activity.time} on ${activity.date}`);

   next();
});

// Function to fetch comments from the database
async function fetchComments() {
   try {
       // Replace with your query logic if necessary
      return await Comment.find();
   }
   // Returns an empty array in case of an error
   catch (error) {
      console.error('Error fetching comments:', error);
      return [];
   }
}

// Initialize passport and sessions
app.use(passport.initialize());
app.use(passport.session());


//Used to check if the user is authenticated or not.
function isAuthenticated(req, res, next) {
   //Shows the status in "true or false" in the console
   console.log('User authenticated:', req.isAuthenticated());
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect('/login');
}


// Use the comment router
app.use('/weather/comments', isAuthenticated, commentRouter);

// Protect routes with authentication middleware
app.use('/weather', isAuthenticated, weatherRouter);
app.use('/uploads', isAuthenticated, uploadRouter);
app.use('/user', isAuthenticated, userProfile);

app.use('/userInDB', userInDBRouter )

// No changes needed for the registration and login routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);

app.get('/weather/comments', async (req, res) => {
   // Fetches comments from your data source
   // Call the function to fetch comments
   const comments = await fetchComments();
   res.render('form', { comments: comments });
});

// Goes to the contact form, page.
app.get("/contact", (req, res) => {
   res.render('contact');
})

// Route to serve the footer template
app.get('/footer', (req, res) => {
   // Renders the footer.pug file
   res.render('footer');
});


//Set template type as pug
app.set('view engine', 'pug');
// Creates views folder
// sets folder where pug should find the templates
app.set('views', `${__dirname}/views`);






