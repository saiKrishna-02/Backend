const express = require('express');
const multer = require('multer'); // Import multer
const { registerUser , sendOtp, verifyOtp, loginUser , checkEmailExists,getDetails} = require('../controllers/userController');
const jobController = require('../controllers/jobController');
const eventController = require('../controllers/eventController');
const feedbackController = require('../controllers/feedbackController');


const router = express.Router();
const upload = multer(); // Initialize multer for handling multipart/form-data

router.post('/register', upload.single('photo'), registerUser ); // Use multer to handle file uploads
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser );
router.post('/check-email', checkEmailExists); // New route for checking email existence

// Add a new job posting
router.post('/jobs', upload.single('logo'), jobController.addJob);

// Fetch all jobs
router.get('/jobs', jobController.getAllJobs);

// Search jobs
router.get('/jobs/search', jobController.searchJobs);

// Add a new event
router.post('/events', upload.single('logo'), eventController.addEvent);

// Fetch all events
router.get('/events', eventController.getAllEvents);

// Search events
router.get('/events/search', eventController.searchEvents);

// Feedback Routes
router.post('/feedback/add', feedbackController.addFeedback);
router.get('/feedback/all', feedbackController.getAllFeedbacks);

router.post('/feedback',getDetails );

module.exports = router;