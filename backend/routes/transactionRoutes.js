const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { transactionValidator } = require('../validators/transactionValidator');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransaction);
router.post('/', transactionValidator, transactionController.createTransaction);
router.put('/:id', transactionValidator, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
