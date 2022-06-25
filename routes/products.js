const express = require('express');
const router = express.Router();
const products = require('../controllers/products.js');

const { validateProduct } = require('../validations/menu.js');

const { isAdmin } = require('../middlewares/general.js');

function sendError( req, res, next ) {

  return next();

  res.status( 500 ).send();

};

router.route('/')
  .delete(isAdmin, products.deleteProducts);

router.route('/all')
  .get(products.getAllProducts);

router.route('/all')
  .post(isAdmin, products.getAllProducts);

router.route('/add')
  .post(isAdmin, validateProduct, products.addProduct);

router.route('/available/switch')
  .put( isAdmin, products.controlSwitchProductsAvailability );

router.route('/available/:id')
  .put( isAdmin, products.updateProductAvailability );

router.get('/search/:query', products.search);

router.route('/:id')
  .put( isAdmin, validateProduct, products.updateProduct);

router.route('/:id/:populate')
  .get( sendError, products.getProductData);

module.exports = router;