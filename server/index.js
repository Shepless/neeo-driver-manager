const Api = require('./api');
const PackageManager = require('./services/package-manager');
const DriverManager = require('./services/driver-manager');
const PORT = process.env.PORT || 3001;

PackageManager.init();
DriverManager.init();
DriverManager.startAll().then(() => {
  Api.Rest.start(PORT);
  Api.Socket.start();
});
