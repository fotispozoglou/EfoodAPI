const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middlewares/general.js');

const orders = require('../controllers/adminOrders.js');
const catchAsync = require('../middlewares/catchAsync.js');

router.get('/live', isAdmin, catchAsync(orders.getLiveOrders));
router.get('/completed', isAdmin, catchAsync(orders.getCompletedOrders));
router.post('/completed/search', isAdmin, catchAsync(orders.searchCompletedOrders));

router.post('/load/pending', isAdmin, catchAsync(orders.loadPendingOrders));
router.post('/load/delivery', isAdmin, catchAsync(orders.loadDeliveryOrders));
router.post('/load/accepted', isAdmin, catchAsync(orders.loadAcceptedOrders));

router.get('/delivery/:orderID', isAdmin, catchAsync(orders.getDeliveryOrder));

router.get('/:orderID/products', isAdmin, catchAsync(orders.getOrderProducts));

router.route('/:id/status', isAdmin)
  .post( catchAsync(orders.setOrderStatus) )
  .get( catchAsync(orders.getOrderStatus) );

module.exports = router;