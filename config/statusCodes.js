module.exports.GENERAL = {
  SUCCESS: 200,
  ERROR: -200,
  NOT_AUTHENTICATED: 400
};

module.exports.ITEM = {
  LOADING_ERROR: 300,
  ADDING_ERROR: 301,
  UPDATING_ERROR: 302,
  DELETING_ERROR: 303,
  IMAGE_ERROR: 304
};

module.exports.ORDER = {
  HAS_PENDING_ORDER: 98,
  STATUS_PENDING: 99,
  STATUS_ACCEPTED: 100,
  STATUS_DELIVERING: 101,
  STATUS_COMPLETED: 102,
  STATUS_CANCELED: -100,
  NOT_FOUND: -101
};

module.exports.VALID_STATUSES = [ 
  this.ORDER.STATUS_ACCEPTED,
  this.ORDER.STATUS_ACCEPTED,
  this.ORDER.STATUS_DELIVERING,
  this.ORDER.STATUS_COMPLETED,
  this.ORDER.STATUS_CANCELED
];