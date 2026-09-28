const authService = require('../services/authService');
const { validationResult } = require('express-validator');

exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password, currency, monthly_income } = req.body;
        const result = await authService.register(name, email, password, currency, monthly_income);
        
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;
        const result = await authService.login(email, password);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await authService.getUserById(userId);
        
        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        // Since we are using stateless JWT, we just send a success message.
        // Frontend will delete the token.
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};
