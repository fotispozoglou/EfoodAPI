const { GENERAL, ITEM } = require('../config/statusCodes.js');
const Ingredient = require('../models/ingredient.js');

module.exports.getAllIngredients = async ( req, res ) => {

  const ingredients = await Ingredient.find({});

  return res.send(JSON.stringify(ingredients));

};

module.exports.addIngredient = async ( req, res ) => {

  try {

    const { name, price } = req.body;

    const newIngredient = new Ingredient({ name, price });

    await newIngredient.save();

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

  try {

    const { id } = req.params;

    const data = req.body;

    await Ingredient.updateOne({ _id: id }, data);

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.UPDATING_ERROR }) );

  }

};

module.exports.deleteIngredients = async ( req, res ) => {

  try {

    const { ingredientsIDS } = req.body;

    for ( const ingredientID of ingredientsIDS ) {

      await Ingredient.deleteOne({ _id: ingredientID });

    }

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.DELETING_ERROR }) );

  }

};