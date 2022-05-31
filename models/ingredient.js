const mongoose = require('mongoose');
const { Schema } = mongoose;

const IngredientSchema = new Schema({
  name: String,
  price: Number,
  shortage: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Ingredient', IngredientSchema);