const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ORDER } = require('../config/statusCodes.js');

const OrderSchema = new Schema({
  orderID: {
    type: Number
  },
  products: [
    {
      original: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product' 
      },
      description: String,
      quantity: Number,
      ingredients: [
        {
          type: Schema.Types.ObjectId, 
          ref: 'Ingredient' 
        }
      ],
      comments: String
    }
  ],
  client: {
    address: String,
    floor: String,
    phone: String,
    comments: String,
    name: String
  },
  user: {  
    type: String
  },
  time: {
    sendAt: {
      type: Number,
      default: Date.now()
    }
  },
  totalPrice: {
    type: Number
  },
  status: {
    type: Number,
    enum: [ ORDER.STATUS_PENDING, ORDER.STATUS_ACCEPTED, ORDER.STATUS_DELIVERING, ORDER.STATUS_COMPLETED, ORDER.STATUS_CANCELED ]
  }
});

OrderSchema.pre('save', function( next ) {

  next();

});

OrderSchema.methods.ownedBy = async function( userID ) {

  return this.user === userID ? true : false;

};

OrderSchema.methods.updateStatus = async function( newStatus ) {

  this.status = newStatus;

  await this.save();

};

module.exports = mongoose.model("Order", OrderSchema);