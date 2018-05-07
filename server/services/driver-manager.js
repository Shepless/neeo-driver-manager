const path = require('path');
const fs = require('fs');
const pm2 = require('pm2');
const {exec} = require('shelljs');
const {DRIVERS_INSTALL_LOCATION, DRIVERS_INSTALL_PACKAGE_JSON_PATH} = require('../constants/paths');

module.exports = {
  init() {
    this.installedDrivers = new Map();
    this.updateInstalledDrivers();
  },

  updateInstalledDrivers () {
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

      this.installedDrivers.set(driverName, driverPkgJson);
    });
  },

  checkDriverIsInstalled(name) {
    this.updateInstalledDrivers();

    if (!this.installedDrivers.has(name)) {
      throw new Error(`Cannot find driver "${name}", please make sure it is installed and try again.`);
    }
  },

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
  },

  getAllProcesses() {
    return new Promise((resolve, reject) => {
      pm2.list(function (error, processes) {
        if (error) {
          reject(error);
          return;
        }

        resolve(processes);
      });
    });
  },

  getProcess(name) {
    return this.getAllProcesses().then(
      processes => processes.find(process => process.name === name)
    );
  },

  delete(name) {
    try {
      this.checkDriverIsInstalled(name);
    } catch (e) {
      return Promise.resolve();
    }

    return this.getAllProcesses().then((processes) => {
      const process = processes.find(process => process.name === name);

      pm2.delete(process.name, (error) => {
        if (error) {
          return Promise.reject(error);
        }
      });
    });
  },

  stopAll() {
    return Promise.all(
      Array.from(this.installedDrivers.keys()).map(name => this.stop(name))
    );
  },

  stop(name) {
    try {
      this.checkDriverIsInstalled(name);
    } catch (e) {
      return Promise.resolve();
    }

    return this.getAllProcesses().then((processes) => {
      const process = processes.find(process => process.name === name);

      return new Promise ((resolve, reject) => {
        pm2.stop(process.name, (error) => {
          if (error) {
            return reject(error);
          }

          resolve();
        });
      });
    });
  },

  startAll() {
    return Promise.all(
      Array.from(this.installedDrivers.keys()).map(name => this.start(name))
    );
  },

  start(name) {
    try {
      this.checkDriverIsInstalled(name);
    } catch (e) {
      return Promise.reject(e);
    }

    const driverInfo = this.installedDrivers.get(name);

    return this.startDaemon().then(() => {
      return new Promise((resolve, reject) => {
        pm2.start({
          name: name,
          script: driverInfo.main,
          instances: 1,
          max_memory_restart: '100M'
        }, (error) => {
          if (error) {
            reject(error);
            return
          }

          resolve(driverInfo);
        });
      });
    });
  }
};
