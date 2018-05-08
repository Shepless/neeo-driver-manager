const DriverManager = require('../services/driver-manager');
const PackageManager = require('../services/package-manager');
const DriverModel = require('../models/driver');

module.exports = {
  getAll(req, res) {
    const drivers = DriverManager.getAllDrivers();
    res.send(drivers);
  },

  search(req, res) {
    const query = req.params.query;

    if (!query) {
      return res.send([]);
    }

    PackageManager.search(query)
      .then((packages) => res.send(packages))
      .catch((error) => res.status(500).send(error));
  },

  install(req, res) {
    const name = req.body.name;
    const version = req.body.version;

    if (!name) {
      return res.status(500).send({
        error: new Error('Please provide a name of a driver to install')
      });
    }

    PackageManager.install(name, version)
      .then((pkgJson) => DriverManager.createDriver(pkgJson))
      .then((driver) => {
        driver.start(name).then(() => res.send(driver));
      })
      .catch((error) => res.status(500).send({
        error: error.message
      }));
  },

  update(req, res) {
    const action = req.body.action;
    const name = req.body.name;

    if (!name) {
      return res.status(500).send({
        error: new Error('A driver name must be provided')
      });
    }

    const driver = DriverManager.getDriver(name);
    const promise = Promise.resolve();

    switch (action) {
      case 'start':
        promise.then(() => driver.start(name));
        break;
      case 'stop':
        promise.then(() => driver.stop(name));
        break;
      default:
        promise.then(() => Promise.reject(new Error(`"${action}" is not supported on drivers`)));
        break;
    }

    promise
      .then(() => res.send(driver))
      .catch(error => res.status(500).send({
        error: error
      }));
  },

  delete(req, res) {
    const name = req.query.name;

    if (!name) {
      return res.status(500).send({
        error: new Error('A driver name must be provided')
      });
    }
    
    const driver = DriverManager.getDriver(name);

    driver.delete(name)
      .then(() => PackageManager.uninstall(name))
      .then(() => res.send())
      .catch((error) => res.status(500).send({
        error: error
      }));
  }
};
