const ProductsCategory = require('../models/productsCategory.js');
const Tier = require('../models/tier.js');

const Validate = require('./Validate.js');
const ValidateModel = require("./ValidateModel.js");

const { GENERAL } = require('../config/statusCodes.js');
const Ingredient = require('../models/ingredient.js');

module.exports.validateFields = async ( ...fields ) => {

  let areValid = true;

  const invalidFields = [];

  for ( const field of fields ) {

    console.log(field);

    const isValid = field[1].isValid();

    if ( isValid === false ) {

      areValid = false;

      invalidFields.push({ field: field[0], errors: field[1].getInvalidMessage() });

    }

  }

  return { areValid, invalidFields };

};

module.exports.validateProduct = async ( req, res, next ) => {

  const { name, price, available, category, quantity, minQuantity, tiers } = req.body;

  try {

    const isValidName = new Validate( name ).required('Name Must Be Defined');

    const isValidPrice = new Validate( price )
      .required('Price Must Be Defined')
      .number('Price Must Be A Number')
      .min( 0, 'Price Value Must Be Greater Than Or Equal To 0' );

    const isValidAvailable = new Validate( available )
      .enum( [ true, false ], "You Need To Specify If Product Is Available" );

    const isValidQuantity = new Validate( quantity )
      .required('Quntity Must Be Defined')
      .number('Price Must Be A Number')
      .min( 1, 'Quantity Value Must Be Greater Than Or Equal To 1' );

    const isValidMinimumQuantity = new Validate( minQuantity )
      .required('Minimum Quntity Must Be Defined')
      .number('Price Must Be A Number')
      .min( 1, 'Minimum Quantity Must Be Greater Than Or Equal To 1' );

    const isValidCategory = await new ValidateModel( ProductsCategory, category )
      .validateID('Select A Category')
      .exists('Select A Category');

    const hasValidTiers = await new ValidateModel( Tier, tiers ) 
      .validateIDS('Invalid Tiers Selected')
      .IDSExists('Invalid Tiers Selected');

    const areValidFields = await this.validateFields( 
      ['name', isValidName ], 
      ['price', isValidPrice ],
      ['available', isValidAvailable],
      ['quantity', isValidQuantity ],
      ['minQuantity', isValidMinimumQuantity ],
      ['category', isValidCategory ],
      ['tiers', hasValidTiers ]
    );

    if ( areValidFields.areValid ) {

      next();

    } else {

      const { invalidFields } = areValidFields;

      res.send(JSON.stringify({ status: GENERAL.ERROR, invalidFields }));

    }
  
  } catch ( e ) {

    console.log(e);

    res.send( JSON.stringify({ status: GENERAL.ERROR }) );

  }

};

module.exports.validateIngredient = async ( req, res, next ) => {

  const { name, price } = req.body;

  const isValidName = new Validate( name ).required('Name Must Be Defined');

  const isValidPrice = new Validate( price ).number('Price Must Be A Number').min( 0, 'Price Value Must Be Greater Than Or Equal To 0' );

  const areValidFields = await this.validateFields( ['name', isValidName], ['price', isValidPrice] );

  if ( areValidFields.areValid ) {

    next();

  } else {

    const { invalidFields } = areValidFields;

    res.send(JSON.stringify({ status: GENERAL.ERROR, invalidFields }));

  }

};

module.exports.validateProductsCategory = async ( req, res, next ) => {

  const { name } = req.body;

  const isValidName = new Validate( name ).required('Name Must Be Defined');

  const areValidFields = await validateFields( ['name', isValidName] );

  if ( areValidFields.areValid ) {

    next();

  } else {

    const { invalidFields } = areValidFields;

    res.send(JSON.stringify({ status: GENERAL.ERROR, invalidFields }));

  }

};

module.exports.validateTiers = async ( req, res, next ) => {

  const { name, ingredients, selectedIngredients, maxSelections, minSelections, type } = req.body;

  const isValidName = new Validate( name ).required('Name Must Be Defined');

  const hasValidMaxSelections = new Validate( maxSelections )
    .required('Maximum Selections Must Be Defined')
    .number('Maximum Selections Must Be A Number')
    .min( 1, 'Maximum Selections Value Must Be Greater Than Or Equal To 1' );

  const hasValidMinSelections = new Validate( minSelections )
    .required('Minimum Selections Must Be Defined')
    .number('Minimum Selections Must Be A Number')
    .max( maxSelections, 'Minimum Selection Must Be Smaller Than Maximum Selections' )
    .min( 0, 'Minimum Selections Must Be Greater Than Or Equal To 0' ); 

  const hasValidType = new Validate( type )
    .enum(['radio', 'checkbox'], 'Select A Valid Type');

  const hasValidIngredients = await new ValidateModel( Ingredient, ingredients )
    .validateIDS('Invalid Tiers Selected')
    .IDSExists('Invalid Ingredients Selected');

  const hasValidSelectedIngredients = await new ValidateModel( Ingredient, selectedIngredients )
    .validateIDS('Invalid Tiers Selected')
    .enum( ingredients, 'Default Ingredients Must Be In Ingredients' )
    .IDSExists('Invalid Default Ingredients Selected');

  const areValidFields = await this.validateFields( 
    ['name', isValidName ], 
    ['maxSelections', hasValidMaxSelections ],
    ['minSelections', hasValidMinSelections ],
    ['type', hasValidType ],
    ['ingredients', hasValidIngredients],
    ['selectedIngredients', hasValidSelectedIngredients]
  );

  if ( areValidFields.areValid ) {

    next();

  } else {

    const { invalidFields } = areValidFields;

    res.send(JSON.stringify({ status: GENERAL.ERROR, invalidFields }));

  }

};