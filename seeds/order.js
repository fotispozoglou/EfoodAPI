const mongoose = require('mongoose');
const Order = require('../models/order.js');
const Tier = require('../models/tier.js');
const Ingredient = require('../models/ingredient.js');
const ProductsCategory = require('../models/productsCategory.js');
const Product = require('../models/product.js');
const { clients, generateOrderProducts } = require('./orderData.js');
const { ORDER } = require('../config/statusCodes.js');

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const dbUrl = IS_PRODUCTION ? process.env.MONGO_URL : 'mongodb://localhost:27017/efood';

mongoose.connect(dbUrl, {
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("API Database Connected");
});

let products = [];

const loadProducts = async () => {

  products = await Product.find({}).populate('category').populate({ path: 'tiers', populate: 'ingredients' });

};

const emptyOrders = async () => {

  await Order.deleteMany({});

};

const createOrders = async () => {

  for ( let index = 0; index < clients.length; index += 1 ) {

    const randomOne = Math.floor( Math.random() * products.length );

    const randomTwo = Math.floor( Math.random() * products.length );

    const randomProducts = [ products[ randomOne ], products[ randomTwo ] ];

    const { products: finalProducts, totalPrice } = await generateOrderProducts( randomProducts );

    const order = new Order( 
      { 
        client: clients[ index ], 
        products: finalProducts, 
        totalPrice, 
        status: clients[ index ].status,
        user: "628616f0bf4b3cae55d524a1",
        orderID: Math.floor( (Math.random() * 890000) + 100000  )
      } 
    );

    await order.save();

  }

};

const init = async () => {

  await emptyOrders();

  await loadProducts();

  await createOrders();

};

init().then(() => { mongoose.connection.close(); });