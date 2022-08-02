const { GENERAL, ITEM } = require('../config/statusCodes.js');
const logger = require('../logger/logger.js');
const ProductsCategory = require('../models/productsCategory.js');

const sanitizeHtml = require('sanitize-html');

module.exports.getAllProductsCategories = async ( req, res ) => {

  const productsCategories = await ProductsCategory.find({});

  return res.send(JSON.stringify(productsCategories));

};

module.exports.addProductsCategory = async ( req, res ) => {

  const { user } = req;

  try {

    const { name } = req.body;

    const newProductsCategory = new ProductsCategory({ 
      name: sanitizeHtml( name )
    });    

    // await newProductsCategory.save();

    logger.info(`ADMIN ${ user.username } ( ${ user._id } ) [ ADDED PRODUCTS CATEGORY ${ newProductsCategory._id } ]`)

    res.send(JSON.stringify({ status: GENERAL.SUCCESS, newProductsCategory } ));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.ADDING_ERROR }) );

  }

};

module.exports.getProductsCategoryData = async ( req, res ) => {

  try {

    const { id } = req.params;

    const productsCategory = await ProductsCategory.findById( id );

    res.send(JSON.stringify({ name: productsCategory.name }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.LOADING_ERROR }) );

  }
  
};

module.exports.updateProductsCategory = async ( req, res ) => {

  const { user } = req;

  try {

    const { id } = req.params;

    const { name } = req.body;

    // await ProductsCategory.updateOne({ _id: id }, { name: sanitizeHtml( name ) });

    logger.info(`ADMIN ${ user.username } ( ${ user._id } ) [ UPDATED PRODUCTS CATEGORY ${ id } ]`)

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.UPDATING_ERROR }) );

  }

}

module.exports.deleteProductsCategories = async ( req, res ) => {

  const { user } = req;

  try {

    const { productsCategoriesIDS } = req.body;

    if ( !Array.isArray( productsCategoriesIDS ) ) throw new Error("ERROR");

    for ( const productsCategoryID of productsCategoriesIDS ) {

      // await ProductsCategory.deleteOne({ _id: productsCategoryID });

    }

    logger.info(`ADMIN ${ user.username } ( ${ user._id } ) [ DELETED ${ productsCategoriesIDS.length } PRODUCTS CATEGORY/IES ${ productsCategoriesIDS.join(',') } ]`);

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.DELETING_ERROR }) );

  }

};