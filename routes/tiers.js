const express = require('express');
const router = express.Router();
const tiers = require('../controllers/tiers.js');

const { validateTiers } = require('../validations/menu.js');

const { isAdmin } = require('../middlewares/general.js');

router.route('/')
  .delete( isAdmin, tiers.deleteTiers);

router.route('/all')
  .get(isAdmin, tiers.getAllTiers);

router.route('/add')
  .put( isAdmin, validateTiers, tiers.addTier);

router.route('/:id')
  .put( isAdmin, validateTiers, tiers.updateTier);

router.route('/:id/:populate')
  .get(tiers.getTierData);
  
module.exports = router;