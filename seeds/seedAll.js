const mongoose = require('mongoose');
const User = require('../models/user.js');
const { seedMenu } = require('./menu.js');
const { seedOrders } = require('./orders.js');
const { getUsersData } = require('./users.js');

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const dbUrl = IS_PRODUCTION ? process.env.MONGO_URL : 'mongodb://localhost:27017/efood';

mongoose.connect(dbUrl, {
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("API Database Connected");
});

const seedUsers = async () => {

  const users = await getUsersData();

  const registeredUsers = [  ];

  for ( const { data: userData, password } of users ) {

    const newUser = new User( userData );

    const registeredUser = await User.register( newUser, password );

    registeredUsers.push( registeredUser );

  }

  return registeredUsers;

};

const seedAll = async () => {

  await User.deleteMany({});

  const registeredUsers = await seedUsers();

  await seedMenu();

  await seedOrders( registeredUsers );

  mongoose.connection.close();

};

seedAll();
