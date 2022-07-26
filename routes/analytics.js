const express = require('express');
const router = express.Router();

const analytics = require('../controllers/analytics.js');
const { isAdmin } = require('../middlewares/general.js');

router.get('/orders/all', isAdmin, analytics.getAllOrdersAnalytics);

module.exports = router;