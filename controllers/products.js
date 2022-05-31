const { GENERAL, ITEM } = require('../config/statusCodes.js');
const Product = require('../models/product.js');

const formatResponseProduct = p => {

  return {
    status: GENERAL.SUCCESS,
    data: {
      name: p.name,
      price: p.price,
      quantity: p.quantity,
      minQuantity: p.minQuantity,
      description: p.description,
      category: p.category,
      tiers: p.tiers,
      available: p.available
    }
  };

};

module.exports.getAllProducts = async ( req, res ) => {

  const products = await Product.find({}).select('_id name price tiers category available').populate({ path: 'tiers', select: '_id name ingredients selectedIngredients' });

  return res.send(JSON.stringify(products));

};

module.exports.addProduct = async ( req, res ) => {

  try {

    const { name, price, description, category, quantity, minQuantity, tiers } = req.body;

    const newProduct = new Product({ name, price, description, category, quantity, minQuantity, tiers: tiers });

    await newProduct.save();  

    res.send(JSON.stringify({ status: GENERAL.SUCCESS, newProduct: { _id: newProduct._id, name } }));

  } catch ( e ) {

    console.log(e);

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.ADDING_ERROR }) );

  }

};

module.exports.getProductData = async ( req, res ) => {

  const { id, populate } = req.params;

  try {

    const product = populate === 'true' ? await Product.findById( id ).populate('category').populate({ path: 'tiers', populate: 'ingredients' }) : await Product.findById( id );

    res.send(JSON.stringify( formatResponseProduct( product ) ));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.LOADING_ERROR }) );

  }
  
};

module.exports.updateProduct = async ( req, res ) => {

  try {

    const { id } = req.params;

    const data = req.body;

    const { name, price, minQuantity, quantity, description, category, tiers, available } = data;

    await Product.updateOne({ _id: id }, { name, price, minQuantity, quantity, description, category, tiers, available });

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.UPDATING_ERROR }) );

  }

};

module.exports.deleteProducts = async ( req, res ) => {

  try {

    const { productsIDS } = req.body;

    await Product.deleteMany({ _id: { $in: productsIDS } });

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  } catch ( e ) {

    return res.status( 200 ).send( JSON.stringify({ status: ITEM.DELETING_ERROR }) );

  }

};

module.exports.updateProductAvailability = async ( req, res ) => {

  const { id, available } = req.body;

  await Product.updateOne({ _id: id }, { $set: { available } });

  res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

};

module.exports.controlSwitchProductsAvailability = async ( req, res ) => {

  const { productsIDS } = req.body;

  const products = [  ];

  for ( const productID of productsIDS ) {

    const product = await Product.findById( productID );

    await product.switchAvailability();

    products.push({ _id: product._id, available: product.available });

    await product.save();

  }

  res.send(JSON.stringify({ status: GENERAL.SUCCESS, products }));

};

module.exports.search = async ( req, res ) => {

  const { query } = req.params;

  const products = await Product.find({ name: { $regex: query, $options: 'i'} });

  res.send(JSON.stringify( products ));
  
};