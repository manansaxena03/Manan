const categoryService = require('../services/categoryService');

exports.getCategories = async (req, res, next) => {
    try {
        const type = req.query.type;
        const categories = await categoryService.getCategories(type);
        
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};
