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
    this.syncWithInstalledPackages();

    return Promise.all(
      Array.from(this.drivers.values()).map((driver) => driver.update())
    )
  }

  startDaemon() {
    return new Promise((resolve, reject) => {
      pm2.connect((error) => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }

  createDriver(pkgJson) {
    const driver = new Driver(pkgJson);
    this.drivers.set(driver.name, driver);
    return driver;
  }

  syncWithInstalledPackages() {
    if (require.cache[DRIVERS_INSTALL_PACKAGE_JSON_PATH]) {
      delete require.cache[DRIVERS_INSTALL_PACKAGE_JSON_PATH];
    }

    const pkgJson = require(DRIVERS_INSTALL_PACKAGE_JSON_PATH);

    if (!pkgJson.dependencies) {
      return;
    }

    // Remove drivers that have been uninstalled
    this.drivers.forEach(driver => {
      if (!pkgJson.dependencies[driver.name]) {
        this.drivers.delete(driver.name);
      }
    });

    // Add drivers that have been installed
    Object.keys(pkgJson.dependencies).forEach((driverName) => {
      if (this.drivers.has(driverName)) {
        return;
      }

      const driverPath = path.resolve(DRIVERS_INSTALL_LOCATION, 'node_modules', driverName);
      const driverPkgJsonPath = path.resolve(driverPath, 'package.json');
      const driverPkgJson = require(driverPkgJsonPath);
      const mainFilePath = path.resolve(driverPath, driverPkgJson.main);

      driverPkgJson.main = mainFilePath;
      this.drivers.set(driverName, new Driver(driverPkgJson));
    });
  }

  startPolling() {
    setInterval(() => this.poll(), 500);
  }

  poll() {
    this.syncWithInstalledPackages();

    const drivers = Array.from(this.drivers.values());

    drivers.forEach(driver => driver.update());
    this.emit('update', drivers);
  }

  getAllDrivers() {
    return Array.from(this.drivers.values());
  }

  getRunningDrivers() {
    return this.getAllDrivers().filter(driver => driver.status === 'online');
  }

  getOfflineDrivers() {
    return this.getAllDrivers().filter(driver => driver.status === 'offline' || driver.status === 'stopped');
  }

  getDriver(name) {
    return this.getAllDrivers().find(process => process.name === name);
  }

  stopAll() {
    return Promise.all(
      Array.from(this.drivers.values()).map(driver => driver.stop())
    );
  }

  startAll() {
    return Promise.all(
      Array.from(this.drivers.values()).map(driver => driver.start())
    );
  }
}

module.exports = new DriverManager();
