const dashboardService = require('../services/dashboardService');

exports.getDashboardData = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await dashboardService.getDashboardData(userId);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

exports.getInsights = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const insights = await dashboardService.getInsights(userId);
        res.status(200).json({ success: true, data: insights });
    } catch (error) {
        next(error);
    }
};
