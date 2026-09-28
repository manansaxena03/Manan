const supabase = require('../config/supabase');

class BudgetModel {
    static async create(budgetData) {
        const { data, error } = await supabase
            .from('budgets')
            .insert([budgetData])
            .select(`*, categories (name, icon, color)`)
            .single();
        if (error) throw error;
        return data;
    }

    static async findByIdAndUser(id, userId) {
        const { data, error } = await supabase
            .from('budgets')
            .select(`*, categories (name, icon, color)`)
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    static async findAllByUser(userId, month, year) {
        let query = supabase
            .from('budgets')
            .select(`*, categories (name, icon, color)`)
            .eq('user_id', userId);
            
        if (month) query = query.eq('month', month);
        if (year) query = query.eq('year', year);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    static async update(id, userId, updateData) {
        const { data, error } = await supabase
            .from('budgets')
            .update({ ...updateData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', userId)
            .select(`*, categories (name, icon, color)`)
            .single();
        if (error) throw error;
        return data;
    }

    static async delete(id, userId) {
        const { error } = await supabase
            .from('budgets')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return true;
    }
}

module.exports = BudgetModel;
