const jwt = require('jsonwebtoken');

const hasValidToken = async ( req, res, next ) => {

  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if ( token == null ) return res.sendStatus( 401 );

  jwt.verify( token, process.env.TOKEN_SECRET, ( err, user ) => {

    if ( err ) return res.sendStatus( 403 );

    return next();

  });

};

const authenticateClientServer = ( req, res, next ) => {

  const authHeader = req.headers['server-token'];

  const token = authHeader && authHeader.split(' ')[1];

  if ( token == null ) {

    return res.sendStatus(401);

  }

  console.log( token );

  return jwt.verify(token, process.env.TOKEN_SECRET, ( err , data ) => {

    if (err) {
      
      if ( err.name === "TokenExpiredError" ) {

        console.log(`TOKEN EXPIRED - SEND BY ${ req.ip }`);

        return res.send(JSON.stringify({ tokenExpired: true }));

      }

      console.log(`OTHER TOKEN ERROR - SEND BY ${ req.ip }`);

      return res.sendStatus(403);

    }

    if ( !data || data.code !== process.env.CLIENT_SERVER_SECRET ) {

      return res.sendStatus( 403 );

    }

    return next();

  });

};

const isAdmin = async ( req, res, next ) => {

  const authHeader = req.headers['authorization'];

  const api_token = authHeader && authHeader.split(' ')[1];

  if (api_token == null) {

    console.log(`NULL TOKEN - SEND BY ${ req.ip }`);

    console.log(api_token);

    return res.sendStatus(401);

  }

  return jwt.verify(api_token, process.env.TOKEN_SECRET, ( err , user ) => {

    if (err) {
      
      if ( err.name === "TokenExpiredError" ) {

        console.log(`TOKEN EXPIRED - SEND BY ${ req.ip }`);

        return res.send(JSON.stringify({ tokenExpired: true }));

      }

      console.log(`OTHER TOKEN ERROR - SEND BY ${ req.ip }`);

      return res.sendStatus(403);

    }

    if ( !user || user.isAdmin === false ) { 

      console.log(`USER NOT ADMIN ( ${ user._id }, ${ user.username }, ${ user.permissions } ) - SEND BY ${ req.ip }`);
      
      return res.sendStatus( 403 );

    }

    return next();

  });

};

const authenticatePermissions = ( ...permissions ) => {

  return ( req, res, next ) => {

    const authHeader = req.headers['authorization'];

    const api_token = authHeader && authHeader.split(' ')[1];

    return jwt.verify( api_token, process.env.TOKEN_SECRET, function(err, admin) {
      
      if (err) {
      
        if ( err.name === "TokenExpiredError" ) {

          console.log(`TOKEN EXPIRED - SEND BY ${ req.ip }`);
  
          return res.send(JSON.stringify({ tokenExpired: true }));
  
        }

        console.log(`OTHER TOKEN ERROR - SEND BY ${ req.ip }`);
  
        return res.sendStatus(403);
  
      }

      let isAuthorized = true;
      let permissionsCount = 0;

      for ( const permission of permissions ) {

        if ( admin.permissions.includes( permission ) ) permissionsCount += 1;

        if ( admin.permissions.includes( permission ) == false ) isAuthorized = false;

      }

      if ( isAuthorized && permissionsCount === permissions.length ) return next();

      return res.sendStatus( 403 );

    });

  };

};

module.exports = {
  hasValidToken,
  isAdmin,
  authenticateClientServer
};