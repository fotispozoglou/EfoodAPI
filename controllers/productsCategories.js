const { GENERAL, ITEM } = require('../config/statusCodes.js');
const ProductsCategory = require('../models/productsCategory.js');

module.exports.getAllProductsCategories = async ( req, res ) => {

  const productsCategories = await ProductsCategory.find({});

  return res.send(JSON.stringify(productsCategories));

};

module.exports.addProductsCategory = async ( req, res ) => {

  try {

    const { name } = req.body;

    const newProductsCategory = new ProductsCategory({ name });

    await newProductsCategory.save();

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

  try {

    const { id } = req.params;

    const data = req.body;

    await ProductsCategory.updateOne({ _id: id }, data);

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.UPDATING_ERROR }) );

  }

}

module.exports.deleteProductsCategories = async ( req, res ) => {

  try {

    const { productsCategoriesIDS } = req.body;

    for ( const productsCategoryID of productsCategoriesIDS ) {

      await ProductsCategory.deleteOne({ _id: productsCategoryID });

    }

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.DELETING_ERROR }) );

  }

};