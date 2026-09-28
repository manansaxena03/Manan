const supabase = require('../config/supabase');

class GoalModel {
    static async create(goalData) {
        const { data, error } = await supabase
            .from('savings_goals')
            .insert([goalData])
            .select('*')
            .single();
        if (error) throw error;
        return data;
    }

    static async findByIdAndUser(id, userId) {
        const { data, error } = await supabase
            .from('savings_goals')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    static async findAllByUser(userId) {
        const { data, error } = await supabase
            .from('savings_goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    static async update(id, userId, updateData) {
        const { data, error } = await supabase
            .from('savings_goals')
            .update({ ...updateData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', userId)
            .select('*')
            .single();
        if (error) throw error;
        return data;
    }

    static async delete(id, userId) {
        const { error } = await supabase
            .from('savings_goals')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return true;
    }
}

module.exports = GoalModel;
