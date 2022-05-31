const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middlewares/general.js');

const orders = require('../controllers/adminOrders.js');

router.get('/live', isAdmin, orders.getLiveOrders);
router.get('/completed', isAdmin, orders.getCompletedOrders);

router.post('/load/pending', isAdmin, orders.loadPendingOrders);
router.post('/load/delivery', isAdmin, orders.loadDeliveryOrders);
router.post('/load/accepted', isAdmin, orders.loadAcceptedOrders);

router.get('/delivery/:orderID', isAdmin, orders.getDeliveryOrder);

router.get('/:orderID/products', isAdmin, orders.getOrderProducts);

router.route('/:id/status', isAdmin)
  .post( orders.setOrderStatus )
  .get( orders.getOrderStatus );

module.exports = router;