const express = require('express');
const router = express.Router();
const tiers = require('../controllers/tiers.js');

const { validateTiers } = require('../validations/menu.js');

const { isAdmin } = require('../middlewares/general.js');

const { PERMISSIONS } = require('../config/permissions.js');

router.route('/')
  .delete(tiers.deleteTiers);

router.route('/all')
  .get(isAdmin, tiers.getAllTiers);

router.route('/add')
  .put(validateTiers, tiers.addTier);

router.route('/:id')
  .put(validateTiers, tiers.updateTier);

router.route('/:id/:populate')
  .get(tiers.getTierData);
  
module.exports = router;