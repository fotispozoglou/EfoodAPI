const { GENERAL, ITEM } = require('../config/statusCodes.js');
const logger = require('../logger/logger.js');
const Tier = require('../models/tier.js');
const sanitizeHtml = require('sanitize-html');

module.exports.getAllTiers = async ( req, res ) => {

  const tiers = await Tier.find({});

  return res.send(JSON.stringify(tiers));

};

module.exports.addTier = async ( req, res ) => {

  const { user } = req;

  try {

    const { name, ingredients, selectedIngredients, maxSelections, minSelections, type } = req.body;

    const newTier = new Tier({ 
      name: sanitizeHtml( name ), 
      ingredients, 
      selectedIngredients, 
      maxSelections: sanitizeHtml( maxSelections ), 
      minSelections: sanitizeHtml( minSelections ), 
      type: sanitizeHtml( type )
    });

    await newTier.save();

    logger.info(`ADMIN ${ user.username } ( ${ user._id } ) [ ADDED TIER ${ newTier._id } ]`);

    res.send(JSON.stringify({ status: GENERAL.SUCCESS, newTier }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.ADDING_ERROR }) );

  }

};

module.exports.getTierData = async ( req, res ) => {

  try {

    const { id, populate } = req.params;

    const tier = populate === 'true' ? await Tier.findById( id ).populate('ingredients').populate('selectedIngredients') : await Tier.findById( id );

    res.send(JSON.stringify({ 
      name: tier.name, 
      ingredients: tier.ingredients,
      selectedIngredients: tier.selectedIngredients,
      maxSelections: tier.maxSelections,
      minSelections: tier.minSelections,
      type: tier.type
    }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.LOADING_ERROR }) );

  }
  
};

module.exports.updateTier = async ( req, res ) => {

  const { user } = req;

  try {

    const { id } = req.params;

    const { name, ingredients, selectedIngredients, maxSelections, minSelections, type } = req.body;

    await Tier.updateOne({ _id: id }, {
      name: sanitizeHtml( name ), 
      ingredients, 
      selectedIngredients, 
      maxSelections: sanitizeHtml( maxSelections ), 
      minSelections: sanitizeHtml( minSelections ), 
      type: sanitizeHtml( type )
    });

    logger.info(`ADMIN ${ user.username } ( ${ user._id } ) [ UPDATED TIER ${ id } ]`);

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    logger.error( e );

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.UPDATING_ERROR }) );

  }

};

module.exports.deleteTiers = async ( req, res ) => {

  const { user } = req;

  try {

    const { tiersIDS } = req.body;

    if ( !Array.isArray( tiersIDS ) ) throw new Error("ERROR");

    for ( const tierID of tiersIDS ) {

      await Tier.deleteOne({ _id: tierID });

    }

    logger.info(`ADMIN ${ user.username } ( ${ user._id } ) [ DELETED ${ tiersIDS.length } TIER/S ${ tiersIDS.join(',') } ]`);

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.DELETING_ERROR }) );

  }

};