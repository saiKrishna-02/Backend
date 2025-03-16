const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer(); // Initialize multer for handling multipart/form-data
require('dotenv').config();

let otpStore = {}; // Temporary OTP storage

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


// User Registration
const registerUser = async (req, res) => {
  try {
    const {
      email, password, first_name, middle_name, last_name, dob, phone_number, address, country, state, city,
      aadhaar_no, reg_number, year_of_joining, graduation_year, branch, cgpa, max_cgpa, placed_in_campus,
      company_name, package, job_role, current_job_title, current_company_name, current_salary,
      linkedin_profile_url, technology_expertise, domain_knowledge, contribution_towards_college,
      suggestions, other_information, alumniId
    } = req.body;

    // Check if user already exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle photo upload
    let photo = null;
    if (req.file) {
      photo = req.file.buffer; // Get the binary data from the uploaded file
    }

    // Ensure contribution_towards_college is an array
    const contributionsArray = Array.isArray(contribution_towards_college)
      ? contribution_towards_college
      : contribution_towards_college.split(',').map(item => item.trim());

    // Create user
    const newUser = await User.createUser({
      email, password: hashedPassword, first_name, middle_name, last_name, dob, phone_number, address,
      country, state, city, aadhaar_no, reg_number, year_of_joining, graduation_year, branch, cgpa,
      max_cgpa, placed_in_campus, company_name, package, job_role, current_job_title, current_company_name,
      current_salary, linkedin_profile_url, technology_expertise, domain_knowledge,
      contribution_towards_college: contributionsArray, // Pass as array
      suggestions, other_information, alumniId, photo
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
};

// Send OTP to Email
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const otp = generateOTP();
    console.log(otp);
    otpStore[email] = { otp, createdAt: new Date() };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ error: 'Failed to send OTP', details: error.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otpStore[email]) {
      return res.status(400).json({ error: 'No OTP generated for this email' });
    }

    const { otp: storedOTP, createdAt } = otpStore[email];
    const otpExpiration = new Date(createdAt);
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    if (otp !== storedOTP) {
      return res.status(400).json({ error: 'Invalid OTP' });
    } else if (new Date() > otpExpiration) {
      delete otpStore[email];
      return res.status(400).json({ error: 'OTP expired' });
    }

    delete otpStore[email];
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ error: 'Error verifying OTP', details: error.message });
  }
};

const loginUser  = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token,email });
  } catch (error) {
    console.error('Error in loginUser :', error);
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
};
// Check if email exists
const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.getUserByEmail(email);
    res.status(200).json({ exists: !!user }); // Return true if user exists, false otherwise
  } catch (error) {
    console.error('Error in checkEmailExists:', error);
    res.status(500).json({ error: 'Error checking email', details: error.message });
  }
};


const getDetails  = async (req, res) => {
  try {
    const { email} = req.body;
    console.log(req.body);
    // Check if user exists
    const user = await User.getUserDetails(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Details Received',email });
  } catch (error) {
    console.error('Error in loginUser :', error);
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
};
module.exports = { registerUser, sendOtp, verifyOtp,loginUser,checkEmailExists,getDetails };