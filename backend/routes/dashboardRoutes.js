const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', dashboardController.getDashboardData);
router.get('/insights', dashboardController.getInsights);

module.exports = router;
