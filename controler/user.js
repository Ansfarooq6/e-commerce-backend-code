const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')
const { validationResult } = require('express-validator');

exports.signUp = async (req, res, next) => {
    const errors = validationResult(req);
    let errorsss= errors.array()
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed.',
            errors: errorsss // Return array of validation errors
        });
    }

    try {
        const { email, password, username, address, phoneNo } = req.body;

        // Check if the user already exists
        const foundUser = await User.findOne({ email: email });
        if (foundUser) {
            return res.status(200).json({
                message: 'User already exists'
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const user = new User({
            email: email,
            username: username,
            password: hashPassword,
            address: address,
            phoneNo: phoneNo,
            role: 'user' // Default role is 'user'
        });

        // Save the user to the database
        await user.save();

        // Send success response
        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id,
            name: user.username
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500; // Internal Server Error
        }
        next(err);
    }
};


exports.Login = async (req, res, next) => {
    const authHeader = req.get('Authorization')
    const errors = validationResult(req); // Corrected variable name
    if (!errors.isEmpty()) {
        return res.status(422).json({
            data: errors.array(), // Corrected the array usage
        });
    }

    try {
        const { email, password } = req.body;
        console.log(email,password)

        // Find the user by email
        const FindUser = await User.findOne({ email: email });
        if (!FindUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the stored hashed password
        const decodePassword = await bcrypt.compare(password, FindUser.password);
        if (!decodePassword) {
            return res.status(401).json({ message: "Password mismatch" });
        }

        // Generate a JWT token if the password is correct
        const token = jwt.sign(
            {
                email: FindUser.email,
                id: FindUser._id.toString(),
                role: FindUser.role,
            },
            "someSupersecretxyz",
            { expiresIn: '1h' }
        );

        // Return the token and user data in the response
        return res.status(200).json({
            token: token,
            userID: FindUser._id.toString(),
            role: FindUser.role,
        });

    } catch (err) {
        // Pass the error to the error handling middleware
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err); // Pass the error to the next middleware
    }
};
