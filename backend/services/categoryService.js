const CategoryModel = require('../models/categoryModel');

class CategoryService {
    static async getCategories(type) {
        return await CategoryModel.findAll(type);
    }
}

module.exports = CategoryService;
