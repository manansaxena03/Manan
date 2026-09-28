const supabase = require('../config/supabase');

class UserModel {
    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
            
        if (error && error.code !== 'PGRST116') { // PGRST116 is no rows returned
            throw error;
        }
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, currency, monthly_income, created_at, updated_at')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        return data;
    }

    static async create(userData) {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select('id, name, email, currency, monthly_income')
            .single();
            
        if (error) throw error;
        return data;
    }
}

module.exports = UserModel;
