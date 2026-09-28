const supabase = require('../config/supabase');

class TransactionModel {
    static async create(transactionData) {
        const { data, error } = await supabase
            .from('transactions')
            .insert([transactionData])
            .select(`
                *,
                categories (id, name, icon, color)
            `)
            .single();
            
        if (error) throw error;
        return data;
    }

    static async findByIdAndUser(id, userId) {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                categories (id, name, icon, color)
            `)
            .eq('id', id)
            .eq('user_id', userId)
            .single();
            
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    }

    static async findAllByUser(userId, { page = 1, limit = 20, category, type, startDate, endDate, search }) {
        let query = supabase
            .from('transactions')
            .select(`
                *,
                categories!inner(id, name, icon, color)
            `, { count: 'exact' })
            .eq('user_id', userId)
            .order('transaction_date', { ascending: false })
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('categories.name', category);
        }
        if (type) {
            query = query.eq('type', type);
        }
        if (startDate) {
            query = query.gte('transaction_date', startDate);
        }
        if (endDate) {
            query = query.lte('transaction_date', endDate);
        }
        if (search) {
            query = query.ilike('description', `%${search}%`);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        if (error) throw error;
        return { data, count };
    }

    static async update(id, userId, updateData) {
        const { data, error } = await supabase
            .from('transactions')
            .update({ ...updateData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', userId)
            .select(`
                *,
                categories (id, name, icon, color)
            `)
            .single();
            
        if (error) throw error;
        return data;
    }

    static async delete(id, userId) {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) throw error;
        return true;
    }
}

module.exports = TransactionModel;
