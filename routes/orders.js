const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders.js');
const catchAsync = require('../middlewares/catchAsync.js');

const { authenticateClientServer } = require('../middlewares/general.js');
const { isValidUser, checkUserActiveOrder } = require('../middlewares/orders.js');

router.route('/')
  .post(authenticateClientServer, checkUserActiveOrder, catchAsync(orders.completeOrder));

router.get('/all', isValidUser, catchAsync(orders.getClientOrders));

router.route('/user/active')
  .get( isValidUser, catchAsync(orders.getClientHasActiveOrder) );

router.route('/:id/status')
  .get( isValidUser, catchAsync(orders.getOrderStatus) );

router.route('/:orderID')
  .get( isValidUser, catchAsync(orders.getClientOrder) );
  
module.exports = router;