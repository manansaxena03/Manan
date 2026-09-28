const BudgetModel = require('../models/budgetModel');

class BudgetService {
    static async createBudget(userId, budgetData) {
        // Prevent duplicate budgets for the same category in the same month/year
        const existingBudgets = await BudgetModel.findAllByUser(userId, budgetData.month, budgetData.year);
        const exists = existingBudgets.find(b => b.category_id === budgetData.category_id);
        if (exists) {
            const error = new Error('Budget for this category already exists for the specified month and year');
            error.statusCode = 409;
            throw error;
        }

        return await BudgetModel.create({
            ...budgetData,
            user_id: userId
        });
    }

    static async getBudgets(userId, month, year) {
        return await BudgetModel.findAllByUser(userId, month, year);
    }

    static async updateBudget(id, userId, updateData) {
        const budget = await BudgetModel.findByIdAndUser(id, userId);
        if (!budget) {
            const error = new Error('Budget not found');
            error.statusCode = 404;
            throw error;
        }
        return await BudgetModel.update(id, userId, updateData);
    }

    static async deleteBudget(id, userId) {
        const budget = await BudgetModel.findByIdAndUser(id, userId);
        if (!budget) {
            const error = new Error('Budget not found');
            error.statusCode = 404;
            throw error;
        }
        return await BudgetModel.delete(id, userId);
    }
}

module.exports = BudgetService;
