const Order = require('../models/order.js');
const { ORDER } = require('../config/statusCodes.js');

const getTimeString = time => {

  const date = new Date( time );

  return `${ date.toLocaleDateString( 'en-us',  {weekday:'long'} ) }`;

  // return `${ date.getDate() }/${ date.getMonth() + 1 }`;

};

const categorizeOrders = orders => {

  if ( orders.length <= 0 ) return [];

  const DELAY = 1 * 60 * 60 * 24 * 1000;

  const firstOrderTime = orders[0]._id;

  const categorizedOrders = [{ count: 1, label: `${ getTimeString( firstOrderTime ) }` }];

  let categorizedIndex = 0;

  let currentTime = firstOrderTime + DELAY;

  for ( let index = 0; index < orders.length; index += 1 ) {

    if ( orders[ index ]._id <= currentTime && orders[ index ]._id >= currentTime - DELAY ) {

      categorizedOrders[ categorizedIndex ].count += 1;

    } else {

      categorizedOrders.push({ count: 1, label: `${ getTimeString( orders[ index ]._id ) }` });

      categorizedIndex += 1;

      currentTime = orders[ index ]._id + DELAY;

    }

  }

  return categorizedOrders;

};

module.exports.getAllOrdersAnalytics = async ( req, res ) => {

  const firstDayTimestamp = new Date().getTime() - 7 * 60 * 60 * 24 * 1000;

  const lastDayTimestamp = new Date().getTime();

  await Order.aggregate(
      [ 
          { "$group":  { 
            "_id": "$time.sendAt", 
            "status" : { $first: '$status.number' },
            "count": { "$sum": 1 } } 
          },
          { "$match": { 
              "$and": [
                { "status": ORDER.STATUS_COMPLETED },
                { "_id": { $gte: firstDayTimestamp } }, 
                { "_id": { $lte: lastDayTimestamp } }
              ] 
            } 
          },
          { "$sort": { "_id": 1 } }

      ],  function(err, results) {

        if ( err ) return res.send(JSON.stringify({ status: -1 }));

        const categorizedOrders = categorizeOrders( results );

        const categorizedOrdersLabels = categorizedOrders.map(co => co.label);

        const categorizedOrdersValues = categorizedOrders.map(co => co.count);

        res.send(JSON.stringify({ status: 1, orders: { labels: categorizedOrdersLabels, values: categorizedOrdersValues } }));

      }
    );

};