const { body } = require('express-validator');

exports.transactionValidator = [
    body('amount').isNumeric().withMessage('Amount must be a number').custom(value => value > 0).withMessage('Amount must be greater than 0'),
    body('description').optional().isString().isLength({ max: 255 }),
    body('category_id').isUUID().withMessage('Valid Category ID is required'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('transaction_date').isISO8601().withMessage('Valid date is required'),
    body('payment_method').optional().isString()
];
