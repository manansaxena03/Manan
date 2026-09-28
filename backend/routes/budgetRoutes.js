const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

const budgetValidator = [
    body('category_id').isUUID().withMessage('Valid Category ID is required'),
    body('amount').isNumeric().withMessage('Amount must be a number').custom(value => value > 0),
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
    body('year').isInt({ min: 2000 }).withMessage('Valid year is required')
];

router.use(authMiddleware);

router.post('/', budgetValidator, budgetController.createBudget);
router.get('/', budgetController.getBudgets);
router.put('/:id', [body('amount').isNumeric().custom(value => value > 0)], budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
