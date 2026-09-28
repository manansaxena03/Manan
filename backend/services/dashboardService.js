const DashboardModel = require('../models/dashboardModel');
const BudgetModel = require('../models/budgetModel');

class DashboardService {
    static async getDashboardData(userId) {
        const [summary, categoryBreakdown, monthlyTrend, recentTransactions] = await Promise.all([
            DashboardModel.getSummary(userId),
            DashboardModel.getCategoryBreakdown(userId),
            DashboardModel.getMonthlyTrend(userId),
            DashboardModel.getRecentTransactions(userId, 5)
        ]);

        return {
            summary,
            categoryBreakdown,
            monthlyTrend,
            recentTransactions
        };
    }
    
    static async getInsights(userId) {
        const summary = await DashboardModel.getSummary(userId);
        const categoryBreakdown = await DashboardModel.getCategoryBreakdown(userId);
        const currentDate = new Date();
        const budgets = await BudgetModel.findAllByUser(userId, currentDate.getMonth() + 1, currentDate.getFullYear());
        
        const insights = [];
        
        // RULE 1: High spending category
        if (categoryBreakdown.length > 0) {
            const topCategory = categoryBreakdown[0];
            if (topCategory.value > summary.totalExpenses * 0.3) {
                insights.push({
                    type: 'warning',
                    message: `${topCategory.name} represents a large portion of your spending this month. Consider setting a weekly budget.`
                });
            }
        }
        
        // RULE 2: Budget exceeded
        for (const budget of budgets) {
            const categoryExpense = categoryBreakdown.find(c => c.name === budget.categories.name)?.value || 0;
            if (categoryExpense > budget.amount) {
                insights.push({
                    type: 'danger',
                    message: `You've exceeded your ${budget.categories.name} budget by ₹${(categoryExpense - budget.amount).toFixed(2)}.`
                });
            } else if (categoryExpense > budget.amount * 0.85) {
                insights.push({
                    type: 'warning',
                    message: `You've used ${Math.round((categoryExpense / budget.amount) * 100)}% of your ${budget.categories.name} budget.`
                });
            }
        }
        
        // RULE 4: Income remaining
        if (summary.remainingBalance > 0) {
            insights.push({
                type: 'success',
                message: `You currently have ₹${summary.remainingBalance.toFixed(2)} left after your recorded expenses.`
            });
        }
        
        // RULE 5: Savings suggestion
        insights.push({
            type: 'info',
            message: "Try setting aside a small amount whenever you receive money."
        });
        
        return insights;
    }
}

module.exports = DashboardService;
