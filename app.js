if ( process.env.NODE_ENV !== "production" ) {

  require('dotenv').config();

}

const port = process.env.PORT || 3000;

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { SERVER_IP } = require('./config/config.js');

const mongoSanitize = require('express-mongo-sanitize');

const dbUrl = 'mongodb://localhost:27017/efood-api'; // process.env.DB_URL

const logger = require('./logger/logger.js');

const jwt = require('jsonwebtoken');

mongoose.connect(dbUrl, {
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("API Database Connected");
});

const productsRoutes = require('./routes/products.js');
const ingredientsRoutes = require('./routes/ingredients.js');
const productsCategoriesRoutes = require('./routes/productsCategories.js');
const tiersRoutes = require('./routes/tiers.js');
const ordersRoutes = require('./routes/orders.js');
const adminOrdersRoutes = require('./routes/adminOrders.js');
const analyticsRoutes = require('./routes/analytics.js');
const { GENERAL } = require('./config/statusCodes.js');

const corsOptions = {
  origin: [`http://${ SERVER_IP }:8080`, `http://${ SERVER_IP }:8000`, `http://${ SERVER_IP }`],
  optionsSuccessStatus: 200 
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors( corsOptions ));
app.use(mongoSanitize());

app.use(function(req, res, next) {
  res.locals.userToken = req.userToken;  
  next();
});

app.use('/orders', ordersRoutes);
app.use('/orders/admin', adminOrdersRoutes);
app.use('/products', productsRoutes);
app.use('/ingredients', ingredientsRoutes);
app.use('/productsCategories', productsCategoriesRoutes);
app.use('/tiers', tiersRoutes);
app.use('/analytics', analyticsRoutes);

app.all('*', ( req, res ) => {

  res.status( 403 ).send();

});

app.listen(port, () => {

  console.log("API STARTED");

});