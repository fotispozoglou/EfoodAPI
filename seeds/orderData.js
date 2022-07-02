const { ORDER } = require("../config/statusCodes");

module.exports.clients = [
  { 
    address: "Kostakioi", 
    comments: "Kostakioi Comments ", 
    floor: "2", 
    name: "fotis",
    phone: `69${ Math.floor( Math.random() * 89000000 + 10000000 ) }`,
    status: {
      number: ORDER.STATUS_ACCEPTED,
      lastUpdated: Date.now()
    }
  },
  { 
    address: "Argilos", 
    comments: "Argilos Comments ", 
    floor: "2", 
    name: "nikos",
    phone: `69${ Math.floor( Math.random() * 89000000 + 10000000 ) }`,
    status: {
      number: ORDER.STATUS_ACCEPTED,
      lastUpdated: Date.now()
    }
  },
  { 
    address: "Plisioi", 
    comments: "Plisioi Comments ", 
    floor: "1", 
    name: "petros",
    phone: `69${ Math.floor( Math.random() * 89000000 + 10000000 ) }`,
    status: {
      number: ORDER.STATUS_ACCEPTED,
      lastUpdated: Date.now()
    }
  },
  { 
    address: "Kleitos", 
    comments: "Kleitos Comments ", 
    floor: "2", 
    name: "eleni",
    phone: `69${ Math.floor( Math.random() * 89000000 + 10000000 ) }`,
    status: {
      number: ORDER.STATUS_DELIVERING,
      lastUpdated: Date.now()
    }
  },
  { 
    address: "Kozani", 
    comments: "Kozani Comments ", 
    floor: "2", 
    name: "maria",
    phone: `69${ Math.floor( Math.random() * 89000000 + 10000000 ) }`,
    status: {
      number: ORDER.STATUS_DELIVERING,
      lastUpdated: Date.now()
    }
  },
  { 
    address: "Zep", 
    comments: "Zep Comments ", 
    floor: "1", 
    name: "kostantina",
    phone: `69${ Math.floor( Math.random() * 89000000 + 10000000 ) }`,
    status: {
      number: ORDER.STATUS_DELIVERING,
      lastUpdated: Date.now()
    }
  },
  { 
    address: "Batero", 
    comments: "Batero Comments ", 
    floor: "2", 
    name: "giorgos",
    phone: `69${ Math.floor( Math.random() * 89000000 + 10000000 ) }`,
    status: {
      number: ORDER.STATUS_PENDING,
      lastUpdated: Date.now()
    }
  },
  { 
    address: "koila", 
    comments: "koila Comments ", 
    floor: "1", 
    name: "eirhnh",
    phone: `69${ Math.floor( Math.random() * 89000000 + 10000000 ) }`,
    status: {
      number: ORDER.STATUS_PENDING,
      lastUpdated: Date.now()
    }
  },
  { 
    address: "lefkopigi", 
    comments: "lefkopigi Comments ", 
    floor: "1", 
    name: "kostas",
    phone: `69${ Math.floor( Math.random() * 89000000 + 10000000 ) }`,
    status: {
      number: ORDER.STATUS_PENDING,
      lastUpdated: Date.now()
    }
  }
];

const pickIngredients = tiers => {

  const finalIngredients = [  ];

  for ( const tier of tiers ) {

    const ingredients = [  ];

    if ( tier.ingredients.length > 0 ) {

      for ( let index = 0; index < Math.floor( (Math.random() * tier.ingredients.length) + 1 ); index += 1 ) {

        // ingredients.push( `${ tier._id.toString() }.${ tier.ingredients[ index ]._id.toString() }` );

        ingredients.push( `${ tier.ingredients[ index ]._id.toString() }` );

      }

    }

    finalIngredients.push( ...ingredients );

  }

  return finalIngredients;

};

const formatOrderProduct = orderProduct => {

  return {
    original: orderProduct._id,
    comments: `comments for ${ orderProduct.name }`,
    ingredients: pickIngredients( orderProduct.tiers ),
    quantity: Math.floor( (Math.random() * 5) + 1 ),
    price: orderProduct.price
  };

};

module.exports.generateOrderProducts = async randomProducts => {

  const finalProducts = [];

  let totalPrice = 0;

  for ( const randomProduct of randomProducts ) {

    const formatedProduct = formatOrderProduct( randomProduct );

    totalPrice += formatedProduct.quantity * formatedProduct.price;

    finalProducts.push( formatedProduct );

  };

  return { products: finalProducts, totalPrice };

};