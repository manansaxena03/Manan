const supabase = require('../config/supabase');

class DashboardModel {
    static async getSummary(userId) {
        const { data, error } = await supabase
            .from('transactions')
            .select('type, amount')
            .eq('user_id', userId);
            
        if (error) throw error;
        
        let totalIncome = 0;
        let totalExpenses = 0;
        
        data.forEach(t => {
            if (t.type === 'income') totalIncome += Number(t.amount);
            if (t.type === 'expense') totalExpenses += Number(t.amount);
        });
        
        const remainingBalance = totalIncome - totalExpenses;
        
        const { data: goals, error: goalsError } = await supabase
            .from('savings_goals')
            .select('current_amount')
            .eq('user_id', userId);
            
        if (goalsError) throw goalsError;
        
        const totalSavings = goals.reduce((sum, goal) => sum + Number(goal.current_amount), 0);
        
        return {
            totalIncome,
            totalExpenses,
            remainingBalance,
            totalSavings
        };
    }

    static async getCategoryBreakdown(userId) {
        const { data, error } = await supabase
            .from('transactions')
            .select('amount, categories(name)')
            .eq('user_id', userId)
            .eq('type', 'expense');
            
        if (error) throw error;
        
        const breakdown = {};
        data.forEach(t => {
            const categoryName = t.categories?.name || 'Uncategorized';
            breakdown[categoryName] = (breakdown[categoryName] || 0) + Number(t.amount);
        });
        
        return Object.entries(breakdown).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    }

    static async getMonthlyTrend(userId) {
        // Fetch transactions for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        
        const { data, error } = await supabase
            .from('transactions')
            .select('transaction_date, amount, type')
            .eq('user_id', userId)
            .gte('transaction_date', sixMonthsAgo.toISOString().split('T')[0])
            .order('transaction_date');
            
        if (error) throw error;
        
        const trend = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        data.forEach(t => {
            const date = new Date(t.transaction_date);
            const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
            if (!trend[monthYear]) {
                trend[monthYear] = { month: monthYear, income: 0, expense: 0 };
            }
            trend[monthYear][t.type] += Number(t.amount);
        });
        
        return Object.values(trend);
    }
    
    static async getRecentTransactions(userId, limit = 5) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*, categories(name, icon, color)')
            .eq('user_id', userId)
            .order('transaction_date', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(limit);
            
        if (error) throw error;
        return data;
    }
}

module.exports = DashboardModel;
