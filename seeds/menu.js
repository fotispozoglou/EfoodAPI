require('dotenv').config({ path: '../../.env' });

const { categories, products, ingredients, tiers } = require('./menuData.js');
const Product = require('../models/product.js');
const ProductsCategory = require('../models/productsCategory.js');
const Tier = require('../models/tier.js');
const Ingredient = require('../models/ingredient.js');

const mongoose = require('mongoose');

const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/efood';

console.log( dbUrl );

mongoose.connect(dbUrl, {
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("API Database Connected");
});

const savedIngredientsIDS = [];
const savedTiersIDS = [];
const savedProductsIDS = [];
const savedProductsCategoriesIDS = [];

const seedIngredients = async () => {

  for ( const ingredientsList of ingredients ) {

    const toSave = [  ];

    for ( const ingredient of ingredientsList ) {

      const ing = new Ingredient( ingredient );

      await ing.save();

      toSave.push( ing.id );

    }

    savedIngredientsIDS.push( toSave );

  }

};

const seedTiers = async () => {

  for ( let index = 0; index < tiers.length; index += 1 ) {

    const tierIngredientsIDS = savedIngredientsIDS[ index ];

    const { name, selectedIngredients, maxSelections, minSelections, type } = tiers[ index ];

    const t = new Tier({ name, ingredients: tierIngredientsIDS, selectedIngredients, maxSelections, minSelections, type });

    await t.save();

    savedTiersIDS.push( t.id );

  }

};

const seedProductsCategory = async () => {

  for ( let index = 0; index < categories.length; index += 1 ) {

    const cat = new ProductsCategory( categories[ index ] );

    await cat.save();

    savedProductsCategoriesIDS.push( cat.id );

  }

};

const seedProducts = async () => {

  for ( let index = 0; index < products.length; index += 1 ) {

    for ( const product of products[index] ) { 

      const productTiersIDS = [  ];

      const { name, tiers: productTiers, price, category, quantity, minQuantity, description, available } = product;

      for ( const tierIndex of productTiers ) {

        productTiersIDS.push( savedTiersIDS[ tierIndex ] );

      }

      const productCategory = savedProductsCategoriesIDS[ category ];

      const p = new Product({ name, tiers: productTiersIDS, price, category: productCategory, quantity, minQuantity, description, available });

      await p.save();

    }

  }

};

const emptyDatabase = async () => {

  await Product.deleteMany({});
  await ProductsCategory.deleteMany({});
  await Tier.deleteMany({});
  await Ingredient.deleteMany({});

};

const init = async () => {

  await emptyDatabase();

  await seedIngredients();

  await seedTiers();

  await seedProductsCategory();

  await seedProducts();

};

init().then(() => { mongoose.connection.close(); });