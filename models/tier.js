const mongoose = require('mongoose');
const { schema } = mongoose;
const Ingredient = require('./ingredient.js');

const TierSchema = new mongoose.Schema({
  name: String,
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient'
    }
  ],
  selectedIngredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient'
    }
  ],
  maxSelections: Number,
  minSelections: Number,
  type: String
});

TierSchema.methods.populateSelectedIngredients = async function( selectedIngredientsIDS ) {

  const tiersIngredientsInSelected = this.ingredients.map(ingredient => ingredient.toString()).filter(ingredient => selectedIngredientsIDS.includes( ingredient ));

  const populatedIngredients = [];

  if ( tiersIngredientsInSelected.length > 0 ) {

    for ( const ingredientID of tiersIngredientsInSelected ) {

      const ingredient = await Ingredient.findById( ingredientID ).select('_id name').lean();

      if ( ingredient ) populatedIngredients.push( ingredient );

    }

  }

  return populatedIngredients;

}

module.exports = mongoose.model('Tier', TierSchema);