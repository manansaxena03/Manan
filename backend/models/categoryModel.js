const supabase = require('../config/supabase');

class CategoryModel {
    static async findAll(type) {
        let query = supabase.from('categories').select('*').order('name');
        if (type) {
            // Include 'both' type categories alongside requested type
            query = query.in('type', [type, 'both']);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        return data;
    }
}

module.exports = CategoryModel;
