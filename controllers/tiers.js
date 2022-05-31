const { GENERAL, ITEM } = require('../config/statusCodes.js');
const Tier = require('../models/tier.js');

module.exports.getAllTiers = async ( req, res ) => {

  const tiers = await Tier.find({});

  return res.send(JSON.stringify(tiers));

};

module.exports.addTier = async ( req, res ) => {

  try {

    const { name, ingredients, selectedIngredients, maxSelections, minSelections, type } = req.body;

    const newTier = new Tier({ name, ingredients, selectedIngredients, maxSelections, minSelections, type });

    await newTier.save();

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

  try {

    const { id } = req.params;

    const data = req.body;

    await Tier.updateOne({ _id: id }, data);

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.UPDATING_ERROR }) );

  }

};

module.exports.deleteTiers = async ( req, res ) => {

  try {

    const { tiersIDS } = req.body;

    for ( const tierID of tiersIDS ) {

      await Tier.deleteOne({ _id: tierID });

    }

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.DELETING_ERROR }) );

  }

};