const mongoose = require('mongoose');
const Tier = require('./models/tier.js');
const Ingredient = require('./models/ingredient.js');

const dbUrl = 'mongodb://localhost:27017/efood-api';

mongoose.connect(dbUrl, {
  useUnifiedTopology: true,
});

const main = async () => {

  console.log("MAIN START");

  const tiers = await Tier.find({});

  const formatedTiers = [];

  for ( const tier of tiers ) {

    const selectedIngredients = await tier.populateSelectedIngredients(['61bb8f1d826cb67ade7e2664', '61bb8f79826cb67ade7e266c', '61bb8f80826cb67ade7e266e']);

    formatedTiers.push({ _id: tier._id, name: tier.name, ingredients: selectedIngredients });

  }

}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {

  console.log("OPENED");
  
  await main().then(() => {
    console.log("DONE");
    mongoose.connection.close();
  });

})