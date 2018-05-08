const Api = require('./api');
const PackageManager = require('./services/package-manager');
const DriverManager = require('./services/driver-manager');
const PORT = process.env.PORT || 3001;

PackageManager.init();
DriverManager.startDaemon()
  .then(() => DriverManager.init())
  .then(() => DriverManager.startAll())
  .then(() => DriverManager.startPolling())
  .then(() => {
    Api.Rest.start(PORT);
    Api.Socket.start();
  });
