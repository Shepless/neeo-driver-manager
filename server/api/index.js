const RestApi = require('./rest-api');
const SocketApi = require('./socket-api');

RestApi.init();
SocketApi.init(RestApi.server);

module.exports = {
  Rest: RestApi,
  Socket: SocketApi
}
