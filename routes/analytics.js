const express = require('express');
const router = express.Router();

const analytics = require('../controllers/analytics.js');

router.get('/orders/all', analytics.getAllOrdersAnalytics);

module.exports = router;