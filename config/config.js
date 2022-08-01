module.exports.IS_PRODUCTION = process.env.NODE_ENV === "production";
const LOCAL_IP = '192.168.1.4';
module.exports.CLIENT_DOMAIN = this.IS_PRODUCTION ? 'https://efood-client.herokuapp.com' : `http://${ LOCAL_IP }:8000`;
module.exports.SERVER_DOMAIN = this.IS_PRODUCTION ? 'https://efoodapi.herokuapp.com' : `http://${ LOCAL_IP }:3000`;
module.exports.ADMIN_DOMAIN = this.IS_PRODUCTION ? 'https://efood-admin.herokuapp.com' : `http://${ LOCAL_IP }:8080`;
module.exports.SERVER_URL = `${ this.SERVER_DOMAIN }`;