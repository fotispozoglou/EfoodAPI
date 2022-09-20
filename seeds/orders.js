const mongoose = require('mongoose');
const Order = require('../models/order.js');
const Tier = require('../models/tier.js');
const Ingredient = require('../models/ingredient.js');
const ProductsCategory = require('../models/productsCategory.js');
const Product = require('../models/product.js');
const { clients, generateOrderProducts } = require('./orderData.js');
const { ORDER } = require('../config/statusCodes.js');
const User = require('../../EfoodClient/models/user.js');

let products = [];

const loadProducts = async () => {

  products = await Product.find({}).populate('category').populate({ path: 'tiers', populate: 'ingredients' });

};

const emptyOrders = async () => {

  await Order.deleteMany({});

};

const activeStatuses = [ 99, 100, 101 ];

const completedStatuses = [ -100, 102 ];

const createOrders = async users => {

  for ( const user of users ) {

    let hasAddedActiveOrder = false;

    for ( let index = 0; index < 5; index += 1 ) {

      const status = hasAddedActiveOrder ? 
        completedStatuses[Math.floor( Math.random() * completedStatuses.length ) ]
        :
        activeStatuses[Math.floor( Math.random() * activeStatuses.length )];

      if ( !hasAddedActiveOrder ) hasAddedActiveOrder = true;

      const randomOne = Math.floor( Math.random() * products.length );

      const randomTwo = Math.floor( Math.random() * products.length );

      const randomProducts = [ products[ randomOne ], products[ randomTwo ] ];

      const { products: finalProducts, totalPrice } = await generateOrderProducts( randomProducts );

      const randomSendAT = Date.now();

      const order = new Order( 
        { 
          client: {
            address: user.address,
            floor: user.floor,
            phone: user.phone,
            comments: `Comments For ${ user.username }'s order`,
            name: user.name
          }, 
          products: finalProducts, 
          totalPrice, 
          status: {
            number: status,
            lastUpdated: randomSendAT
          },
          user: user._id,
          time: {
            sendAt: randomSendAT
          },
          orderID: Math.floor( (Math.random() * 890000) + 100000  )
        } 
      );

      await order.save();

    }

  }

};

module.exports.seedOrders = async users => {

  await emptyOrders();

  await loadProducts();

  await createOrders( users );

};