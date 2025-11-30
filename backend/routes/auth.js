const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '6h';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
}

const buildTokenResponse = (user) => {
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
    };
};

const handleValidation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Register
router.post(
    '/register',
    [
        body('username').trim().isLength({ min: 2 }).withMessage('Username must be at least 2 characters long'),
        body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
        const validationResultResponse = handleValidation(req, res);
        if (validationResultResponse) return;

        const { username, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({ username, email });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            return res.status(201).json(buildTokenResponse(user));
        } catch (err) {
            console.error('Register error:', err);
            return res.status(500).send('Server error');
        }
    }
);

// Login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const validationResultResponse = handleValidation(req, res);
        if (validationResultResponse) return;

        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            return res.json(buildTokenResponse(user));
        } catch (err) {
            console.error('Login error:', err);
            return res.status(500).send('Server error');
        }
    }
);

// Current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.json(user);
    } catch (err) {
        console.error('Fetch user error:', err);
        return res.status(500).send('Server error');
    }
});

module.exports = router;
