const Order = require('../models/order.js');
const Ingredient = require('../models/ingredient.js');
const Tier = require('../models/tier.js');

const { ORDER, GENERAL } = require('../config/statusCodes.js');

module.exports.setOrderStatus = async ( req, res ) => {

  const { id } = req.params;
  const { newStatus, override = false } = req.body;

  const order = await Order.findById( id );

  if ( !override && newStatus <= order.status.number && newStatus !== -100 ) {

    return res.send(JSON.stringify({ status: GENERAL.SUCCESS, statusChanged: false, actualStatus: order.status.number }));

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
    .find({ 'status.number': { $in: [ ORDER.STATUS_PENDING, ORDER.STATUS_DELIVERING, ORDER.STATUS_ACCEPTED, ORDER.STATUS_COMPLETED ] },'status.lastUpdated': { $gt: lct } })
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

module.exports.getCompletedOrders = async ( req, res ) => {

  const { page, ict } = req.query;

  const skip = ( page - 1 ) * 25;

  const orders = await Order.find({ 'status.number': ORDER.STATUS_COMPLETED, 'time.sendAt': { $gt: ict } }).skip( skip ).limit( 25 );

  const time = Date.now();

  res.send(JSON.stringify({ orders, time }));

};