const Order = require("../models/order.js");
const jwt = require('jsonwebtoken');

const {ORDER} = require('../config/statusCodes.js');

const pendingOrdersStatus = [ ORDER.STATUS_ACCEPTED, ORDER.STATUS_DELIVERING, ORDER.STATUS_PENDING ];

const isValidUser = async ( req, res, next ) => {

  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  jwt.verify( token, process.env.TOKEN_SECRET, ( err, user ) => {

    if ( err ) return res.sendStatus( 403 );

    if ( !user ) return res.sendStatus( 403 );

    return next();

  });

}

const checkUserActiveOrder = async ( req, res, next ) => {

  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  jwt.verify( token, process.env.TOKEN_SECRET, async ( err, user ) => {

    if ( err ) return res.sendStatus( 403 );

    const { _id } = user;

    const clientPendingOrders = await Order.count({ user: _id, 'status.number': { $in: pendingOrdersStatus } });

    if ( clientPendingOrders > 0 ) {

      return res.send({ status: ORDER.HAS_PENDING_ORDER });

    }

    return next();

  });

};

module.exports = {
  isValidUser,
  checkUserActiveOrder
}