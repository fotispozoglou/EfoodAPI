const { GENERAL, ITEM } = require('../config/statusCodes.js');
const logger = require('../logger/logger.js');
const Ingredient = require('../models/ingredient.js');
const sanitizeHtml = require('sanitize-html');

module.exports.getAllIngredients = async ( req, res ) => {

  const ingredients = await Ingredient.find({});

  return res.send(JSON.stringify(ingredients));

};

module.exports.addIngredient = async ( req, res ) => {

  const { user } = req;

  try {

    const { name, price } = req.body;

    const newIngredient = new Ingredient({ 
      name: sanitizeHtml( name ), 
      price: sanitizeHtml( price )
    });

    await newIngredient.save();

    logger.info(`ADMIN ${ user.username } ( ${ user._id } ) [ ADDED INGREDIENT ${ newIngredient._id } ]`);

    res.send(JSON.stringify({ status: GENERAL.SUCCESS, newIngredient }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.ADDING_ERROR }) );

  }

};

module.exports.getIngredientData = async ( req, res ) => {

  try {

    const { id } = req.params;

    const ingredient = await Ingredient.findById( id );

    res.send(JSON.stringify({ name: ingredient.name, price: ingredient.price }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.LOADING_ERROR }) );

  }
  
};

module.exports.updateIngredient = async ( req, res ) => {

  const { user } = req;

  try {

    const { id } = req.params;

    const { name, price } = req.body;

    await Ingredient.updateOne({ _id: id }, {
      name: sanitizeHtml( name ), 
      price: sanitizeHtml( price )
    });

    logger.info(`ADMIN ${ user.username } ( ${ user._id } ) [ UPDATED INGREDIENT ${ id } ]`);

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.UPDATING_ERROR }) );

  }

};

module.exports.deleteIngredients = async ( req, res ) => {

  const { user } = req;

  try {

    const { ingredientsIDS } = req.body;

    if ( !Array.isArray( ingredientsIDS ) ) throw new Error("ERROR");

    for ( const ingredientID of ingredientsIDS ) {

      await Ingredient.deleteOne({ _id: ingredientID });

    }

    logger.info(`ADMIN ${ user.username } ( ${ user._id } ) [ DELETED ${ ingredientsIDS.length } INGREDIENT/S ${ ingredientsIDS.join(',') } ]`);

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.DELETING_ERROR }) );

  }

};