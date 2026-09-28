const goalService = require('../services/goalService');
const { validationResult } = require('express-validator');

exports.createGoal = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const userId = req.user.id;
        const goal = await goalService.createGoal(userId, req.body);
        res.status(201).json({ success: true, data: goal });
    } catch (error) {
        next(error);
    }
};

exports.getGoals = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const goals = await goalService.getGoals(userId);
        res.status(200).json({ success: true, data: goals });
    } catch (error) {
        next(error);
    }
};

exports.getGoal = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const goal = await goalService.getGoal(req.params.id, userId);
        res.status(200).json({ success: true, data: goal });
    } catch (error) {
        next(error);
    }
};

exports.updateGoal = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const userId = req.user.id;
        const goal = await goalService.updateGoal(req.params.id, userId, req.body);
        res.status(200).json({ success: true, data: goal });
    } catch (error) {
        next(error);
    }
};

exports.deleteGoal = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await goalService.deleteGoal(req.params.id, userId);
        res.status(200).json({ success: true, message: 'Savings goal deleted successfully' });
    } catch (error) {
        next(error);
    }
};
