const Order = require('../models/order.js');
const Ingredient = require('../models/ingredient.js');
const Tier = require('../models/tier.js');

const jwt = require('jsonwebtoken');

const { ORDER, GENERAL } = require('../config/statusCodes.js');

const logger = require('../logger/logger.js');

module.exports.setOrderStatus = async ( req, res ) => {

  const { id } = req.params;
  const { newStatus, override = false } = req.body;
  const { username, _id } = req.user;

  logger.info(`ADMIN ${ username } ( ${ _id } ) [ SET ORDER { ${ id } } STATUS { ${ newStatus } } ]`);

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
    .select('_id client.name client.address time totalPrice orderID');

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
    .select('_id client.name products totalPrice orderID')
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

module.exports.searchCompletedOrders = async ( req, res ) => {

  const { value, excluded } = req.body;

  const numberValue = Number(value);

  const minRange = numberValue * ( 10 ** (6 - numberValue.toString().length) );

  const maxRange = (numberValue + 1) * ( 10 ** (6 - ((numberValue + 1).toString().length )) );

  const orders = await Order.find({ orderID: { $gte: minRange, $lte: maxRange }, _id: { $nin: excluded } });

  res.send(JSON.stringify({ status: 1, orders }));

};

module.exports.getCompletedOrders = async ( req, res ) => {

  const { page, ict } = req.query;

  const skip = ( page - 1 ) * 25;

  const orders = await Order
    .find({ 'status.number': ORDER.STATUS_COMPLETED, 'time.sendAt': { $gt: ict } })
    .select('_id time totalPrice products client orderID')
    .skip( skip )
    .limit( 25 )
    .lean();

  for ( const order of orders ) {

    order.products = order.products.length;

  }

  const time = Date.now();

  res.send(JSON.stringify({ orders, time }));

};

module.exports.getOrderClientPhone = async ( req, res ) => {

  const { orderID } = req.params;

  const authHeader = req.headers['authorization'];

  const api_token = authHeader && authHeader.split(' ')[1];

  return jwt.verify(api_token, process.env.TOKEN_SECRET, async ( err , user ) => {

    if (err) {
      
      if ( err.name === "TokenExpiredError" ) {

        logger.warn(`TOKEN EXPIRED - SEND BY ${ req.ip }`);

        return res.send(JSON.stringify({ tokenExpired: true }));

      }

      logger.warn(`OTHER TOKEN ERROR - SEND BY ${ req.ip }`);

      return res.sendStatus(403);

    }

    if ( !user || user.isAdmin === false ) { 

      logger.warn(`USER NOT ADMIN ( ${ user._id }, ${ user.username }, ${ user.permissions } ) - SEND BY ${ req.ip }`);
      
      return res.sendStatus( 403 );

    }

    logger.info(`ADMIN ${ user.username } ( ${ user._id } ) [ REQUEST ORDER ${ orderID } PHONE ]`);

    const order = await Order.findOne({ _id: orderID }).select('client.phone');

    return res.send(JSON.stringify({ status: GENERAL.SUCCESS, phone: order.client.phone }));

  });

};