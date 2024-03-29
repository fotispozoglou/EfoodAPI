if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const port = process.env.PORT || 3000;

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const {
  SERVER_IP,
  CLIENT_DOMAIN,
  SERVER_DOMAIN,
  ADMIN_DOMAIN,
  IS_PRODUCTION,
} = require("./config/config.js");
const helmet = require("helmet");
const logger = require("./logger/logger.js");

const mongoSanitize = require("express-mongo-sanitize");

const dbUrl = IS_PRODUCTION ? process.env.MONGO_URL : process.env.DEV_MONGO_URL;

mongoose.connect(dbUrl, {
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  logger.info("API Database Connected");
});

const productsRoutes = require("./routes/products.js");
const ingredientsRoutes = require("./routes/ingredients.js");
const productsCategoriesRoutes = require("./routes/productsCategories.js");
const tiersRoutes = require("./routes/tiers.js");
const ordersRoutes = require("./routes/orders.js");
const adminOrdersRoutes = require("./routes/adminOrders.js");
const { GENERAL } = require("./config/statusCodes.js");

const corsOptions = {
  origin: [`${CLIENT_DOMAIN}`, `${SERVER_DOMAIN}`, `${ADMIN_DOMAIN}`],
  optionsSuccessStatus: 200,
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(mongoSanitize());

app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));

app.use(function (req, res, next) {
  res.locals.userToken = req.userToken;
  next();
});

app.use("/orders", ordersRoutes);
app.use("/orders/admin", adminOrdersRoutes);
app.use("/products", productsRoutes);
app.use("/ingredients", ingredientsRoutes);
app.use("/productsCategories", productsCategoriesRoutes);
app.use("/tiers", tiersRoutes);

app.all("*", (req, res) => {
  res.status(403).send();
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;

  if (!err.message) err.message = "Server Error";

  logger.info(err.stack);

  res.status(statusCode).send(JSON.stringify({ status: GENERAL.ERROR }));
});

app.listen(port, () => {
  logger.info("API Server Started");
});
