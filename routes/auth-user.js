const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authUser = require('../controler/user')


router.post('/signUp',
    [
        // Email validation
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email.')
            .normalizeEmail(),

        // Username validation
        body('username')
            .trim()
            .notEmpty()
            .withMessage('Username is required.')
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long.'),

        // Password validation
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long.')
            .matches(/\d/)
            .withMessage('Password must contain at least one number.'),

        // Address validation
        body('address')
            .trim()
            .notEmpty()
            .withMessage('Address is required.'),

        // Phone number validation
        body('phoneNo')
            .isMobilePhone()
            .withMessage('Please provide a valid phone number.')
            .notEmpty()
            .withMessage('Phone number is required.')
    ],authUser.signUp);



router.post('/login',authUser.Login);

module.exports = router;