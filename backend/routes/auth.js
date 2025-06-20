const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register User
router.post('/register', [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('leetcodeProfile')
        .notEmpty()
        .withMessage('LeetCode Profile is required'),
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { username, email, password, leetcodeProfile } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            leetcodeProfile
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login User
router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not registered' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(400).json({ message: 'Account is deactivated' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
    try {
        res.json({
            user: req.user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout (client-side token removal)
router.post('/logout', auth, async (req, res) => {
    try {
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Google Login/Register
router.post('/google', async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = new User({
                username: payload.name.replace(/\s+/g, '_'),
                email: payload.email,
                googleId: payload.sub,
                leetcodeProfile: '', // Optional, can be filled later
                password: Math.random().toString(36).slice(-8) // Random password, not used
            });
            await user.save();
        }
        const token = generateToken(user._id);
        res.json({
            message: 'Google login successful',
            token,
            user: user.toJSON()
        });
    } catch (err) {
        console.error('Google login error:', err);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});

module.exports = router; 