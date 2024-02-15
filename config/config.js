module.exports.IS_PRODUCTION = process.env.NODE_ENV === "production";
const LOCAL_IP = "192.168.1.4";
module.exports.CLIENT_DOMAIN = this.IS_PRODUCTION
  ? "https://efood-client.herokuapp.com"
  : process.env.DEV_CLIENT_DOMAIN;
module.exports.SERVER_DOMAIN = this.IS_PRODUCTION
  ? "https://efoodapi.herokuapp.com"
  : process.env.DEV_API_DOMAIN;
module.exports.ADMIN_DOMAIN = this.IS_PRODUCTION
  ? "https://efood-admin.herokuapp.com"
  : process.env.DEV_ADMIN_DOMAIN;
module.exports.SERVER_URL = `${this.SERVER_DOMAIN}`;
