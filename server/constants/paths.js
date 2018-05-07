const path = require('path');

exports.DRIVERS_INSTALL_LOCATION = path.resolve(__dirname, '..', '..', 'drivers');
exports.DRIVERS_INSTALL_PACKAGE_JSON_PATH = path.resolve(exports.DRIVERS_INSTALL_LOCATION, 'package.json');
