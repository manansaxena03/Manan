const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

const goalValidator = [
    body('name').trim().notEmpty().withMessage('Goal name is required'),
    body('target_amount').isNumeric().custom(value => value > 0),
    body('current_amount').optional().isNumeric(),
    body('target_date').optional().isISO8601()
];

router.use(authMiddleware);

router.post('/', goalValidator, goalController.createGoal);
router.get('/', goalController.getGoals);
router.get('/:id', goalController.getGoal);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);

module.exports = router;
