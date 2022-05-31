const express = require('express');
const router = express.Router();
const ingredients = require('../controllers/ingredients.js');

const { validateIngredient } = require('../validations/menu.js');

const { isAdmin } = require('../middlewares/general.js');

router.route(`/`)
  .delete( isAdmin, ingredients.deleteIngredients );

router.route('/all')
  .get( isAdmin, ingredients.getAllIngredients );

router.route('/add')
  .put( isAdmin, validateIngredient, ingredients.addIngredient );

router.route('/:id')
  .get( isAdmin, ingredients.getIngredientData )
  .put( isAdmin, validateIngredient, ingredients.updateIngredient );

module.exports = router;