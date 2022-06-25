const express = require('express');
const router = express.Router();
const productsCategories = require('../controllers/productsCategories.js');

const { validateProductsCategory } = require('../validations/menu.js');

const { isAdmin } = require('../middlewares/general.js');

const { PERMISSIONS } = require('../config/permissions.js');

router.route('/')
  .delete( isAdmin, productsCategories.deleteProductsCategories);

router.route('/all')
  .get( isAdmin,productsCategories.getAllProductsCategories);

router.route('/all')
  .post(isAdmin, productsCategories.getAllProductsCategories);

router.route('/add')
  .post( isAdmin, validateProductsCategory, productsCategories.addProductsCategory);

router.route('/:id')
  .get(productsCategories.getProductsCategoryData)
  .put( isAdmin, validateProductsCategory, productsCategories.updateProductsCategory)

module.exports = router;