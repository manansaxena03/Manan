const GoalModel = require('../models/goalModel');

class GoalService {
    static async createGoal(userId, goalData) {
        return await GoalModel.create({
            ...goalData,
            user_id: userId
        });
    }

    static async getGoals(userId) {
        return await GoalModel.findAllByUser(userId);
    }

    static async getGoal(id, userId) {
        const goal = await GoalModel.findByIdAndUser(id, userId);
        if (!goal) {
            const error = new Error('Savings goal not found');
            error.statusCode = 404;
            throw error;
        }
        return goal;
    }

    static async updateGoal(id, userId, updateData) {
        await this.getGoal(id, userId);
        return await GoalModel.update(id, userId, updateData);
    }

    static async deleteGoal(id, userId) {
        await this.getGoal(id, userId);
        return await GoalModel.delete(id, userId);
    }
}

module.exports = GoalService;
