const EventEmitter = require('events');
const path = require('path');
const fs = require('fs');
const pm2 = require('pm2');
const {exec} = require('shelljs');
const Driver = require('../models/driver');
const {DRIVERS_INSTALL_LOCATION, DRIVERS_INSTALL_PACKAGE_JSON_PATH} = require('../constants/paths');

class DriverManager extends EventEmitter {
  constructor() {
    super();
  }

  init() {
    this.drivers = new Map();
    this.updateDrivers();

    setInterval(() => this.pollForDriverChanges(), 1000);
  }

  pollForDriverChanges() {
    return new Promise((resolve, reject) => {
      pm2.list((error, processes) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(processes);
      });
    })
    .then((processes) => {
      return processes.map(process => {
        if (!this.drivers.has(process.name)) {
          return;
        }

        const driver = this.drivers.get(process.name);

        driver.update(
          process.pid,
          process.pm2_env.status,
          process.monit.cpu + '%',
          (process.monit.memory / 1000000).toFixed(0) + 'MB',
          ((Date.now() - process.pm2_env.created_at) / 1000) + 's'
        );

        return driver;
      });
    })
    .then((drivers) => this.emit('update', drivers));
  }

  updateDrivers () {
    if (require.cache[DRIVERS_INSTALL_PACKAGE_JSON_PATH]) {
      delete require.cache[DRIVERS_INSTALL_PACKAGE_JSON_PATH];
    }

    const pkgJson = require(DRIVERS_INSTALL_PACKAGE_JSON_PATH);

    if (!pkgJson.dependencies) {
      return;
    }

    Object.keys(pkgJson.dependencies).forEach((driverName) => {
      const driverPath = path.resolve(DRIVERS_INSTALL_LOCATION, 'node_modules', driverName);
      const driverPkgJsonPath = path.resolve(driverPath, 'package.json');
      const driverPkgJson = require(driverPkgJsonPath);
      const mainFilePath = path.resolve(driverPath, driverPkgJson.main);

      driverPkgJson.main = mainFilePath;
      this.drivers.set(driverName, new Driver(driverPkgJson));
    });
  }

  checkDriverIsInstalled(name) {
    this.updateDrivers();

    if (!this.drivers.has(name)) {
      throw new Error(`Cannot find driver "${name}", please make sure it is installed and try again.`);
    }
  }

  startDaemon() {
    return new Promise((resolve, reject) => {
      pm2.connect((error) => {
        if (error) {
          process.exit(2);
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  getAllDrivers() {
    return Array.from(this.drivers.values());
  }

  getDriver(name) {
    return this.getAllDrivers().find(process => process.name === name);
  }

  delete(name) {
    try {
      this.checkDriverIsInstalled(name);
    } catch (e) {
      return Promise.resolve();
    }

    const driver = this.drivers.get(name);
    return driver.delete().then(() => this.drivers.delete(name));
  }

  stopAll() {
    return Promise.all(
      Array.from(this.drivers.keys()).map(name => this.stop(name))
    );
  }

  stop(name) {
    try {
      this.checkDriverIsInstalled(name);
    } catch (e) {
      return Promise.resolve();
    }

    const driver = this.drivers.get(name);
    return driver.stop();
  }

  startAll() {
    return Promise.all(
      Array.from(this.drivers.keys()).map(name => this.start(name))
    );
  }

  start(name) {
    try {
      this.checkDriverIsInstalled(name);
    } catch (e) {
      return Promise.reject(e);
    }

    const driver = this.drivers.get(name);
    return driver.start();
  }
}

module.exports = new DriverManager();
