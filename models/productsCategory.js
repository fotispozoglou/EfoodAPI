const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsCategorySchema = new Schema({
  name: String,
  items: []
});

module.exports = mongoose.model('ProductsCategory', ProductsCategorySchema);