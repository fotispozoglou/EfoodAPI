const Order = require('../models/order.js');
const Ingredient = require('../models/ingredient.js');
const Tier = require('../models/tier.js');

const { ORDER, GENERAL } = require('../config/statusCodes.js');

module.exports.setOrderStatus = async ( req, res ) => {

  const { id } = req.params;
  const { newStatus, override = false } = req.body;

  const order = await Order.findById( id );

  if ( !override && newStatus <= order.status && newStatus !== -100 ) {

    return res.send(JSON.stringify({ status: GENERAL.SUCCESS, statusChanged: false, actualStatus: order.status }));

  }

  if ( override ) {

    await order.updateStatus( newStatus );

    return res.send(JSON.stringify({ status: GENERAL.SUCCESS, statusChanged: true, actualStatus: newStatus }));

  }

  await order.updateStatus( newStatus );

  res.send(JSON.stringify({ status: GENERAL.SUCCESS, actualStatus: newStatus }));

};

module.exports.getOrderStatus = async ( req, res ) => {

  const { id } = req.params;

  const orderStatus = await Order.findById( id ).select('status');

  res.send(JSON.stringify({ orderStatus: orderStatus.status }));

};

module.exports.getOrderProducts = async ( req, res ) => {

  const { orderID } = req.params;

  const order = await Order.findOne({ _id: orderID })
    .select('orderID products totalPrice')
    .populate({ path: 'products.original', select: 'name' })
    .populate({ path: 'products.ingredients', select: 'name' });

  res.send(JSON.stringify({ status: GENERAL.SUCCESS, order }));

};

module.exports.getLiveOrders = async ( req, res ) => {

  const { lct = 0 } = req.query;

  const orders = await Order
    .find({ status: { $in: [ ORDER.STATUS_PENDING, ORDER.STATUS_DELIVERING, ORDER.STATUS_ACCEPTED, ORDER.STATUS_COMPLETED ] },'time.sendAt': { $gt: lct } })
    .select('_id status');

  const time = Date.now();

  res.send(JSON.stringify({ orders, time }));

};

module.exports.loadPendingOrders = async ( req, res ) => {

  const { ids } = req.body;

  const orders = await Order
    .find({ _id: { $in: ids } })
    .select('_id status client time totalPrice orderID');

  res.send(JSON.stringify({ orders }));

};

module.exports.loadDeliveryOrders = async ( req, res ) => {

  const { ids } = req.body;

  const orders = await Order
    .find({ _id: { $in: ids } })
    .select('_id status client time totalPrice orderID');

  res.send(JSON.stringify({ orders }));

};

module.exports.loadAcceptedOrders = async ( req, res ) => {

  const { ids } = req.body;

  const orders = await Order
    .find({ _id: { $in: ids } })
    .select('_id status client time products totalPrice orderID')
    .populate({ path: 'products.original', select: '_id name price' });

  res.send(JSON.stringify({ orders }));

};

module.exports.getOrderProducts = async ( req, res ) => {

  const { orderID } = req.params;

  const order = await Order.findOne({ _id: orderID })
    .select('orderID products totalPrice')
    .populate({ path: 'products.original', select: 'name' })
    .populate({ path: 'products.ingredients', select: 'name' });

  res.send(JSON.stringify({ status: GENERAL.SUCCESS, order }));

};

module.exports.getDeliveryOrder = async ( req, res ) => {

  const { orderID } = req.params;

  const order = await Order.findById( orderID )
    .select('_id client products totalPrice user')
    .populate({ path: 'products.original', select: '_id name price' })
    .populate({ path: 'products.ingredients', select: 'name' });

  res.send(JSON.stringify({ order }));

};

const getOrdersAnalytics = async () => {

  const todayTime = new Date();

  todayTime.setHours( 0, 0, 0, 0 );

  const todayOrdersCount = await Order.find({ 'time.sendAt': { $gt: todayTime.getTime() } }).count();

  const totalOrdersCount = await Order.count({});

  const totalOrdersPrices = await Order.aggregate(
    [
      { $match: {  } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]
  );

  const todayOrdersPrices = await Order.aggregate(
    [
      { $match: { 'time.sendAt': { $gt: todayTime.getTime() } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]
  );
    
  return { 
    todayOrdersCount, 
    totalOrdersCount, 
    totalOrdersPrices: totalOrdersPrices.length > 0 ? totalOrdersPrices[0].total : 0, 
    todayOrdersPrices: todayOrdersPrices.length > 0 ? todayOrdersPrices[0].total : 0
  };

};

module.exports.getCompletedOrders = async ( req, res ) => {

  const { page, ict } = req.query;

  const skip = ( page - 1 ) * 4;

  const orders = await Order.find({ status: ORDER.STATUS_COMPLETED, 'time.sendAt': { $gt: ict } }).skip( skip ).limit( 4 );

  const time = Date.now();

  const analytics = await getOrdersAnalytics();

  res.send(JSON.stringify({ orders, time, analytics }));

};