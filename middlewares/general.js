const jwt = require('jsonwebtoken');

const logger = require('../logger/logger.js');

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

  return jwt.verify(token, process.env.TOKEN_SECRET, ( err , data ) => {

    if (err) {
      
      if ( err.name === "TokenExpiredError" ) {

        logger.warn(`TOKEN EXPIRED - SEND BY ${ req.ip }`);

        return res.send(JSON.stringify({ tokenExpired: true }));

      }

      logger.warn(`OTHER TOKEN ERROR - SEND BY ${ req.ip }`);

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

    logger.warn(`NULL TOKEN - SEND BY ${ req.ip }`);

    return res.sendStatus(401);

  }

  return jwt.verify(api_token, process.env.TOKEN_SECRET, ( err , user ) => {

    if (err) {
      
      if ( err.name === "TokenExpiredError" ) {

        logger.warn(`TOKEN EXPIRED - SEND BY ${ req.ip }`);

        return res.send(JSON.stringify({ tokenExpired: true }));

      }

      logger.warn(`NULL TOKEN - SEND BY ${ req.ip }`);

      return res.sendStatus(403);

    }

    if ( !user || user.isAdmin === false ) { 

      logger.warn(`USER NOT ADMIN ( ${ user._id }, ${ user.username } ) - SEND BY ${ req.ip }`);
      
      return res.sendStatus( 403 );

    }

    req.user = user;

    return next();

  });

};

module.exports = {
  hasValidToken,
  isAdmin,
  authenticateClientServer
};