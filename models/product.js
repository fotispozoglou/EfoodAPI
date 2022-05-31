const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  price: Number,
  tiers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tier'
    }
  ],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'ProductsCategory'
  },
  quantity: Number,
  minQuantity: Number,
  description: String,
  available: {
    type: Boolean,
    default: false
  }
});

ProductSchema.methods.getProductPrice = async function( quantity ) {

  return quantity * this.price;

};

ProductSchema.methods.switchAvailability = async function(  ) {

  this.available = !this.available;

};

module.exports = mongoose.model('Product', ProductSchema);