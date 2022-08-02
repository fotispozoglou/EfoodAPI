const crypto = require('crypto');
const User = require('../../EfoodClient/models/user.js');

const generateUser = function( username ) {

  return {
    username, 
    name: username,
    phone: `69${ Math.floor( Math.random() * 89000000 + 10000000 ) }`,
    address: `address of ${ username }`,
    floor: `${ Math.floor( (Math.random() * 3 ) + 1 ) }`,
    preferences: { 
      privacy: {
        privateName: Math.floor( Math.random() * 2 ) === 1 ? true : false, 
        privatePhone: Math.floor( Math.random() * 2 ) === 1 ? true : false 
      },
      language: 'EN'
    }
  }

}

const users = [
  { username: "fotis", password: "password" },
  { username: "nikos", password: crypto.randomBytes( 12 ).toString('hex') },
  { username: "eleni", password: crypto.randomBytes( 12 ).toString('hex') },
  { username: "maria", password: crypto.randomBytes( 12 ).toString('hex') }
];

module.exports.getUsersData = async () => {

  const registeredUsers = [  ];

  for ( const user of users ) {

    const newUserData = generateUser( user.username );
  
    registeredUsers.push({ data: newUserData, password: user.password });

  }

  return registeredUsers;

};