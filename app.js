if ( process.env.NODE_ENV !== "production" ) {

  require('dotenv').config();

}

const port = process.env.PORT;

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { SERVER_IP } = require('./config/config.js');

const mongoSanitize = require('express-mongo-sanitize');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/efood-api';

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

const corsOptions = {
  origin: [`https://efood-admin.herokuapp.com`, 'https://client-efood.herokuapp.com'],
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

app.listen(port, () => {

  console.log("API STARTED");

});