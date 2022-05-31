const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders.js');

const { authenticateClientServer } = require('../middlewares/general.js');
const { isValidUser, checkUserActiveOrder } = require('../middlewares/orders.js');

router.route('/')
  .post(authenticateClientServer, checkUserActiveOrder, orders.completeOrder);

router.get('/all', isValidUser, orders.getClientOrders);

router.route('/user/active')
  .get( isValidUser, orders.getClientHasActiveOrder );

router.route('/:id/status')
  .get( isValidUser, orders.getOrderStatus );

router.route('/:orderID')
  .get( isValidUser, orders.getClientOrder );
  
module.exports = router;