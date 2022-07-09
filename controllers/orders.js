const Ingredient = require('../models/ingredient.js');
const Order = require('../models/order.js');
const Tier = require('../models/tier.js');

const { ORDER, GENERAL } = require('../config/statusCodes.js');
const Product = require('../models/product.js');

const jwt = require('jsonwebtoken');

const getToken = headers => {

  const authHeader = headers['authorization'];

  return authHeader && authHeader.split(' ')[1];

};

module.exports.getOrderStatus = async ( req, res ) => {

  const { id } = req.params;

  const orderStatus = await Order.findById( id ).select('status');

  if ( !orderStatus ) return res.send(JSON.stringify({ orderStatus: { number: ORDER.NOT_FOUND } }));

  res.send(JSON.stringify({ orderStatus: orderStatus.status }));

};

const formatOrderObject = order => {

  const products = [];

  for ( const product of order.products ) {

    const ingredients = product.ingredients.map(ingredient => ingredient.split('.')[1]);

    products.push({ original: product._id, quantity: product.quantity, ingredients: [ ...ingredients ], comments: product.comments, description: product.description });

  }

  delete order.products;

  order.products = [ ...products ];

  const date = Date.now();

  order.status = {
    lastUpdated: date,
    number: ORDER.STATUS_PENDING
  };

  order.time = { sendAt: date };

  order.orderID = Math.floor((Math.random() * 899999) + 100000);

  return order;

};

const calculateOrderTotalPrice = async products => {

  const extractedData = products.map(({ original, quantity }) => { return { original, quantity } });

  let finalPrice = 0;

  for ( const { original, quantity } of extractedData ) {

    const originalProduct = await Product.findById( original );

    const productFinalPrice = await originalProduct.getProductPrice( quantity );

    finalPrice += productFinalPrice;

  }

  return finalPrice;

};

module.exports.completeOrder = async ( req, res ) => {

  const { order } = req.body;

  const formatedOrder = formatOrderObject( order );

  order.client.name = order.user.name;

  order.totalPrice = await calculateOrderTotalPrice( formatedOrder.products );

  const newOrder = new Order( formatedOrder );

  await newOrder.save();

  const newOrderResponse = await Order.findById( newOrder.id ).select('_id orderID totalPrice products status time')
    .populate({ path: 'products', populate: { path: 'original', select: 'name price' }, select: 'quantity' });

  res.send(JSON.stringify({ status: GENERAL.SUCCESS, orderID: newOrder.id, order: newOrderResponse }));

};

module.exports.getClientOrders = async ( req, res ) => {

  const token = getToken( req.headers );

  jwt.verify( token, process.env.TOKEN_SECRET, async ( err, user ) => {

    const orders = await Order.find({ user: user._id }).sort({ 'time.sendAt': -1 }).select('orderID totalPrice products time status');

    res.send(JSON.stringify({ orders }));

  });

};

module.exports.getClientOrder = async ( req, res ) => {

  const { orderID } = req.params;

  const token = getToken( req.headers );

  jwt.verify( token, process.env.TOKEN_SECRET, async ( err, user ) => {

    const foundOrder = await Order.findById( orderID );

    const ownedByUser = foundOrder.ownedBy( user._id );

    if ( !ownedByUser ) return res.sendStatus( 401 );

    const order = await Order.findById( orderID ).select('_id orderID totalPrice products status')
      .populate({ path: 'products', populate: { path: 'original', select: 'name price' }, select: 'quantity' });

    res.send(JSON.stringify({ order }));

  });

};

module.exports.removeOrder = async ( req, res ) => {

  const { orderID } = req.params;

  await Order.deleteOne({ _id: orderID });

  res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

};

module.exports.getClientHasActiveOrder = async ( req, res ) => {

  const token = getToken( req.headers );

  return jwt.verify( token, process.env.TOKEN_SECRET, async ( err, user ) => {

    const foundOrder = await Order.findOne({ 'status.number': { $nin: [ ORDER.STATUS_COMPLETED, ORDER.STATUS_CANCELED ] }, user: user._id });

    const orderID = foundOrder ? foundOrder._id : "";

    const orderStatus = foundOrder ? foundOrder.status : "";

    return res.send( JSON.stringify({ hasPendingOrders: foundOrder != null, orderID, orderStatus }) );

  });

};

module.exports.removeClientInfo = async ( req, res ) => {

  const { userID } = req.body;

  const userOrders = await Order.find({ user: userID, 'status.number': { $nin: [ ORDER.STATUS_COMPLETED, ORDER.STATUS_CANCELED ] } });

  if ( userOrders.length > 0 ) return res.send( JSON.stringify({ hasPendingOrders: true, status: GENERAL.SUCCESS }) );

  const clearedValues = { 
    user: '', 
    'client.address': '', 
    'client.floor': '',
    'client.phone': '',
    'client.comments': '',
    'client.name': 'deleted'
  };

  await Order.updateMany({ user: userID }, { $set: clearedValues });

  res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

};