const transactionService = require('../services/transactionService');
const { validationResult } = require('express-validator');

exports.createTransaction = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const userId = req.user.id;
        const transaction = await transactionService.createTransaction(userId, req.body);
        
        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};

exports.getTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const transaction = await transactionService.getTransaction(req.params.id, userId);
        
        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};

exports.getTransactions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await transactionService.getTransactions(userId, req.query);
        
        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

exports.updateTransaction = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const userId = req.user.id;
        const transaction = await transactionService.updateTransaction(req.params.id, userId, req.body);
        
        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await transactionService.deleteTransaction(req.params.id, userId);
        
        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
