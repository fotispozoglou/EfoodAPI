const Order = require("../models/order.js");
const Product = require("../models/product.js");
const Tier = require("../models/tier.js");
const Ingredient = require("../models/ingredient.js");
const jwt = require('jsonwebtoken');

const {ORDER, GENERAL} = require('../config/statusCodes.js');
const Validate = require("../validations/Validate.js");
const { validateFields } = require("../validations/menu.js");

const pendingOrdersStatus = [ ORDER.STATUS_ACCEPTED, ORDER.STATUS_DELIVERING, ORDER.STATUS_PENDING ];

const hasValidOrderData = async orderData => {

  const { phone, address, floor } = orderData.client;

  hasValidPhone = new Validate( phone ).required('please enter a phone number');

  hasValidAddress = new Validate( address ).required('please enter an address');

  hasValidFloor = new Validate( floor ).required('please enter a floor number');

  const valid = await validateFields(
    ['phone', hasValidPhone],
    ['address', hasValidAddress],
    ['floor', hasValidFloor]
  );

  return valid;

};

const hasValidOrderProducts = async orderProducts => {

  let productsIndex = 0;

  let valid = true;

  if ( !orderProducts || orderProducts.length <= 0 ) {

    return res.send(JSON.stringify({ status: GENERAL.ERROR })); 

  }

  while ( productsIndex < orderProducts.length && valid ) { 

    const _id = orderProducts[ productsIndex ]._id;

    if ( isNaN( orderProducts[ productsIndex ].quantity ) ) {

      valid = false;

      break;

    }

    const productExists = await Product.exists({ _id });

    if ( !productExists ) valid = false;
    
    let ingredientsIndex = 0;

    const ingredients = orderProducts[ productsIndex ].ingredients;

    while ( ingredientsIndex < ingredients.length ) { 

      const isValid = ingredients[ ingredientsIndex ].split('.').length === 2;

      if ( !isValid ) {
        
        valid = false;
  
        break;

      }

      const tierID = ingredients[ ingredientsIndex ].split('.')[0];
      const ingredientID = ingredients[ ingredientsIndex ].split('.')[1];

      const tierExists = await Tier.exists({ _id: tierID });

      if ( !tierExists ) {
        
        valid = false;
  
        break;

      }

      const ingredientExists = await Ingredient.exists({ _id: ingredientID });

      if ( !ingredientExists ) {
        
        valid = false;
  
        break;

      }

      ingredientsIndex += 1;
  
    }



    productsIndex += 1;

  }

  return valid;

};

const validateOrder = async ( req, res, next ) => {

  const { order } = req.body;

  const { areValid, invalidFields } = await hasValidOrderData( order );

  if ( !areValid ) {

    return res.send({ status: GENERAL.ERROR, invalidFields });

  }

  const hasValidProducts = await hasValidOrderProducts( order.products );

  if ( areValid && hasValidProducts ) return next();

  return res.send(JSON.stringify({ status: GENERAL.ERROR, invalidFields }));

}

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
  checkUserActiveOrder,
  validateOrder
}