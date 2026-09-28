const { body } = require('express-validator');

exports.registerValidator = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Must be a valid email address'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
        .matches(/\d/).withMessage('Password must contain at least one number'),
    body('currency').optional().isString().isLength({ max: 10 }),
    body('monthly_income').optional().isNumeric()
];

exports.loginValidator = [
    body('email').trim().notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required')
];
