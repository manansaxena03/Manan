const budgetService = require('../services/budgetService');
const { validationResult } = require('express-validator');

exports.createBudget = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const userId = req.user.id;
        const budget = await budgetService.createBudget(userId, req.body);
        res.status(201).json({ success: true, data: budget });
    } catch (error) {
        next(error);
    }
};

exports.getBudgets = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { month, year } = req.query;
        const budgets = await budgetService.getBudgets(userId, month, year);
        res.status(200).json({ success: true, data: budgets });
    } catch (error) {
        next(error);
    }
};

exports.updateBudget = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const userId = req.user.id;
        const budget = await budgetService.updateBudget(req.params.id, userId, req.body);
        res.status(200).json({ success: true, data: budget });
    } catch (error) {
        next(error);
    }
};

exports.deleteBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await budgetService.deleteBudget(req.params.id, userId);
        res.status(200).json({ success: true, message: 'Budget deleted successfully' });
    } catch (error) {
        next(error);
    }
};
