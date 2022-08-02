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
let orderInterval;
const madeOrders = [  ];

const statuses = new Map();
statuses.set( ORDER.STATUS_PENDING, 'PENDING' );
statuses.set( ORDER.STATUS_ACCEPTED, 'ACCEPTED' );
statuses.set( ORDER.STATUS_COMPLETED, 'COMPLETED' );
statuses.set( ORDER.STATUS_DELIVERING, 'DELIVERING' );

const loadProducts = async () => {

  products = await Product.find({}).populate('category').populate({ path: 'tiers', populate: 'ingredients' });

};

const SEVEN_DAYS = 7 * 60 * 60 * 24 * 1000;

const createOrder = async () => {

  const randomClient = clients[ Math.floor( Math.random() * clients.length ) ];

  const randomOne = Math.floor( Math.random() * products.length );

  const randomTwo = Math.floor( Math.random() * products.length );

  const randomProducts = [ products[ randomOne ], products[ randomTwo ] ];

  const { products: finalProducts, totalPrice } = await generateOrderProducts( randomProducts );

  const randomSendAT = new Date().getTime() - Math.floor( Math.random() * SEVEN_DAYS );

  const order = new Order( 
    { 
      client: randomClient, 
      products: finalProducts, 
      totalPrice, 
      status: randomClient.status,
      user: "",
      time: {
        sendAt: randomSendAT
      },
      orderID: Math.floor( (Math.random() * 890000) + 100000  )
    } 
  );

  await order.save();

  return { id: order._id, statusText: statuses.get(order.status.number) };

};

const startOrderInterval = () => {

  setInterval(async() => {

    const { id, statusText } = await createOrder();

    console.log("ORDERED " + statusText);

    madeOrders.push( id );

  }, Math.floor( (Math.random() * 2) + 8 ) * 1000);

};

const deleteMadeOrders = async () => {

  for ( const orderID of madeOrders ) {

    // await Order.deleteOne({ _id: orderID });

  }

};

const init = async () => {

  await loadProducts();

  console.log("STARTING MAKING ORDERS");

  await Order.deleteMany({});

  startOrderInterval();

  process.on('SIGINT', async function() {
  
    clearInterval( orderInterval );

    await deleteMadeOrders();

    console.log("DELETED ORDERS");

    mongoose.connection.close();

    process.exit();
  
  });

};

init();
