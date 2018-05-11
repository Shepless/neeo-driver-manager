const path = require('path');
const fs = require('fs');
const pm2 = require('pm2');
const axios = require('axios');
const shell = require('shelljs');
const {which, exec, mkdir, cd} = require('shelljs');
const {DRIVERS_INSTALL_LOCATION, DRIVERS_INSTALL_PACKAGE_JSON_PATH} = require('../constants/paths');

module.exports = {
  init() {
    if (!which('git')) {
      return false;
    }

    if (!which('npm')) {
      return false;
    }

    if (!fs.existsSync(DRIVERS_INSTALL_LOCATION)) {
      mkdir(DRIVERS_INSTALL_LOCATION);
    }

    if (!fs.existsSync(DRIVERS_INSTALL_PACKAGE_JSON_PATH)) {
      exec('npm init --yes --force', { async: false, silent: true, cwd: DRIVERS_INSTALL_LOCATION });
    }

    return true;
  },

  clearCache() {
    if (require.cache[DRIVERS_INSTALL_PACKAGE_JSON_PATH]) {
      delete require.cache[DRIVERS_INSTALL_PACKAGE_JSON_PATH];
    }
  },

  getAll() {
    this.clearCache();

    const dependencies = require(DRIVERS_INSTALL_PACKAGE_JSON_PATH).dependencies;
    const packages = Object.keys(dependencies).map((key, index) => {
      return {
        name: key,
        version: dependencies[key]
      }
    });

    return Promise.resolve(packages);
  },

  search(query) {
    return axios.get(`https://www.npmjs.com/search/suggestions?q=${query}-&fields=name`).then((response) => {
      return response.data
        .map(result => Object.assign(result, { isInstalled: this.exists(result.name) }))
        .filter(result => result.name.toLowerCase().includes('neeo'));
    }).catch(e => console.log(e));
  },

  exists(pkgName) {
    this.clearCache();
    const pkgJson = require(DRIVERS_INSTALL_PACKAGE_JSON_PATH);
    return pkgJson.dependencies ? !!pkgJson.dependencies[pkgName] : false;
  },

  install(pkgName, version) {
    if (this.exists(pkgName)) {
      return Promise.resolve(`Driver ${pkgName} is already installed`);
    }

    pkgName = version ? `${pkgName}@${version}` : pkgName;

    return new Promise((resolve, reject) => {
      exec(`npm install ${pkgName}`, {silent: true, cwd: DRIVERS_INSTALL_LOCATION }, (code, stdout, stderr) => {
        if (code > 0) {
          return reject(new Error(`Failed to install driver "${pkgName}" from npm`));
        }

        resolve(require(path.resolve(DRIVERS_INSTALL_LOCATION, 'node_modules', pkgName, 'package.json')));
      });
    });
  },

  update(pkgName) {
    if (pkgName && !this.exists(pkgName)) {
      return Promise.resolve(`Driver ${pkgName} is not installed`);
    }

    return new Promise((resolve, reject) => {
      exec(`npm update ${pkgName}`, {silent: true, cwd: DRIVERS_INSTALL_LOCATION }, (code, stdout, stderr) => {
        if (code > 0) {
          return reject(new Error(`Failed to uninstall driver "${pkgName}"`));
        }

        resolve(stdout);
      });
    });
  },

  uninstall(pkgName) {
    if (!this.exists(pkgName)) {
      return Promise.resolve(`Driver ${pkgName} is already uninstalled`);
    }

    return new Promise((resolve, reject) => {
      exec(`npm uninstall ${pkgName}`, {silent: true, cwd: DRIVERS_INSTALL_LOCATION }, (code, stdout, stderr) => {
        if (code > 0) {
          return reject(new Error(`Failed to uninstall driver "${pkgName}"`));
        }

        resolve(stdout);
      });
    });
  }
};
